import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Calculator, TrendingUp, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthSelector } from '@/components/months/MonthSelector';
import { useMonths, useUpdateMonth, useAddMonth } from '@/hooks/useMonths';
import { useMembers } from '@/hooks/useMembers';

interface EBFormData {
  previousReading: string;
  currentReading: string;
  perUnitCost: string;
}

const EBCalculatorForm = memo(({
  formData,
  onChange,
  units,
  totalAmount,
  activeMembers,
  perHeadShare,
  onSave,
  isSaving,
}: {
  formData: EBFormData;
  onChange: (field: keyof EBFormData, value: string) => void;
  units: number;
  totalAmount: number;
  activeMembers: number;
  perHeadShare: number;
  onSave: () => void;
  isSaving: boolean;
}) => (
  <Card className="shadow-soft">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <Calculator className="h-5 w-5 text-primary" />
        EB Calculator
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="previous">Previous Reading</Label>
        <Input
          id="previous"
          type="number"
          placeholder="Enter previous reading"
          value={formData.previousReading}
          onChange={(e) => onChange('previousReading', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="current">Current Reading</Label>
        <Input
          id="current"
          type="number"
          placeholder="Enter current reading"
          value={formData.currentReading}
          onChange={(e) => onChange('currentReading', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="perUnit">Per Unit Cost (₹)</Label>
        <Input
          id="perUnit"
          type="number"
          step="0.5"
          placeholder="Enter per unit cost"
          value={formData.perUnitCost}
          onChange={(e) => onChange('perUnitCost', e.target.value)}
        />
      </div>

      <div className="pt-4 border-t space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Units Consumed</span>
          <span className="font-semibold text-foreground">{units}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="font-semibold text-warning">
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Active Members</span>
          <span className="font-semibold text-foreground">{activeMembers}</span>
        </div>
        <div className="flex justify-between pt-3 border-t">
          <span className="text-muted-foreground">Per Head Share</span>
          <span className="font-bold text-lg text-primary">
            ₹{perHeadShare.toFixed(2)}
          </span>
        </div>
      </div>

      <Button 
        className="w-full mt-4" 
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Calculation'}
      </Button>
    </CardContent>
  </Card>
));

EBCalculatorForm.displayName = 'EBCalculatorForm';

const EB = () => {
  const { data: months = [], isLoading: loadingMonths } = useMonths();
  const { data: members = [], isLoading: loadingMembers } = useMembers();
  const updateMonth = useUpdateMonth();
  const addMonth = useAddMonth();

  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [formData, setFormData] = useState<EBFormData>({
    previousReading: '',
    currentReading: '',
    perUnitCost: '5',
  });

  const selectedMonth = months.find(m => m.id === selectedMonthId);

  // Set first month as default when months load
  useEffect(() => {
    if (months.length > 0 && !selectedMonthId) {
      setSelectedMonthId(months[0].id);
    }
  }, [months, selectedMonthId]);

  // Load month data when selected month changes
  useEffect(() => {
    if (selectedMonth) {
      setFormData({
        previousReading: selectedMonth.eb_prev ? String(selectedMonth.eb_prev) : '',
        currentReading: selectedMonth.eb_curr ? String(selectedMonth.eb_curr) : '',
        perUnitCost: selectedMonth.unit_rate ? String(selectedMonth.unit_rate) : '5',
      });
    }
  }, [selectedMonth]);

  const handleFormChange = useCallback((field: keyof EBFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const prevReading = parseFloat(formData.previousReading) || 0;
  const currReading = parseFloat(formData.currentReading) || 0;
  const unitCost = parseFloat(formData.perUnitCost) || 0;
  const units = Math.max(0, currReading - prevReading);
  const totalAmount = units * unitCost;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const perHeadShare = activeMembers > 0 ? totalAmount / activeMembers : 0;

  const chartData = months.slice(0, 6).reverse().map((record) => ({
    month: record.month_name?.slice(0, 3) || '',
    units: Number(record.eb_units || 0),
    amount: Number(record.eb_total || 0),
  }));

  const handleSave = useCallback(() => {
    if (selectedMonthId) {
      updateMonth.mutate({
        id: selectedMonthId,
        eb_prev: prevReading,
        eb_curr: currReading,
        eb_units: units,
        unit_rate: unitCost,
        eb_total: totalAmount,
        eb_per_head: perHeadShare,
        total_members: activeMembers,
      });
    }
  }, [selectedMonthId, prevReading, currReading, units, unitCost, totalAmount, perHeadShare, activeMembers, updateMonth]);

  const handleAddMonth = useCallback(async (monthData: { month_name: string; year: number; month_year: string }) => {
    const result = await addMonth.mutateAsync(monthData);
    setSelectedMonthId(result.id);
  }, [addMonth]);

  if (loadingMonths || loadingMembers) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="EB Calculation"
        description="Calculate and track electricity bill"
        icon={Zap}
      />

      {/* Month Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-xs"
      >
        <MonthSelector
          months={months}
          selectedMonthId={selectedMonthId}
          onMonthChange={setSelectedMonthId}
          onAddMonth={handleAddMonth}
          isAddingMonth={addMonth.isPending}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <EBCalculatorForm
            formData={formData}
            onChange={handleFormChange}
            units={units}
            totalAmount={totalAmount}
            activeMembers={activeMembers}
            perHeadShare={perHeadShare}
            onSave={handleSave}
            isSaving={updateMonth.isPending}
          />
        </motion.div>

        {/* Stats and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: 'This Month Units',
                value: units,
                change: '+6%',
                isPositive: false,
              },
              {
                label: 'Total Amount',
                value: `₹${totalAmount.toLocaleString()}`,
                change: '+5%',
                isPositive: false,
              },
              {
                label: 'Avg. Monthly Units',
                value: months.length > 0 
                  ? Math.round(months.reduce((acc, r) => acc + Number(r.eb_units || 0), 0) / months.length)
                  : 0,
                change: 'Last 6 months',
                isPositive: null,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border bg-card p-4 shadow-soft"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                {stat.isPositive !== null && (
                  <p
                    className={`text-xs mt-1 ${
                      stat.isPositive ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                )}
                {stat.isPositive === null && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-card p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                EB Usage Trend
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Last 6 months
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="units"
                    name="Units"
                    fill="hsl(var(--warning))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </motion.div>

          {/* History Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border bg-card shadow-soft overflow-hidden"
          >
            <div className="p-4 border-b">
              <h3 className="font-semibold text-card-foreground">EB History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Previous</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Current</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Units</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Per Head</th>
                  </tr>
                </thead>
                <tbody>
                  {months.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No EB records found
                      </td>
                    </tr>
                  ) : (
                    months.slice(0, 5).map((record) => (
                      <tr
                        key={record.id}
                        className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-foreground">
                          {record.month_name} {record.year}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                          {Number(record.eb_prev || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                          {Number(record.eb_curr || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                          {Number(record.eb_units || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-warning">
                          ₹{Number(record.eb_total || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                          ₹{Number(record.eb_per_head || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EB;
