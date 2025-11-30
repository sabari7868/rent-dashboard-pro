import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Calculator, TrendingUp } from 'lucide-react';
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
import { ebRecords, members } from '@/lib/data';

const EB = () => {
  const [previousReading, setPreviousReading] = useState(ebRecords[0].previousReading);
  const [currentReading, setCurrentReading] = useState(ebRecords[0].currentReading);
  const [perUnitCost, setPerUnitCost] = useState(ebRecords[0].perUnitCost);

  const units = Math.max(0, currentReading - previousReading);
  const totalAmount = units * perUnitCost;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const perHeadShare = activeMembers > 0 ? totalAmount / activeMembers : 0;

  const chartData = ebRecords.map((record) => ({
    month: record.month.slice(0, 3),
    units: record.units,
    amount: record.totalAmount,
  }));

  return (
    <AppLayout>
      <PageHeader
        title="EB Calculation"
        description="Calculate and track electricity bill"
        icon={Zap}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
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
                  value={previousReading}
                  onChange={(e) => setPreviousReading(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">Current Reading</Label>
                <Input
                  id="current"
                  type="number"
                  value={currentReading}
                  onChange={(e) => setCurrentReading(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="perUnit">Per Unit Cost (₹)</Label>
                <Input
                  id="perUnit"
                  type="number"
                  step="0.5"
                  value={perUnitCost}
                  onChange={(e) => setPerUnitCost(Number(e.target.value))}
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

              <Button className="w-full mt-4">Save Calculation</Button>
            </CardContent>
          </Card>
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
                value: Math.round(
                  ebRecords.reduce((acc, r) => acc + r.units, 0) / ebRecords.length
                ),
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Month
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Previous
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Current
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Units
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Per Head
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ebRecords.slice(0, 5).map((record, index) => (
                    <tr
                      key={record.id}
                      className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {record.month} {record.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {record.previousReading}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {record.currentReading}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                        {record.units}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-warning">
                        ₹{record.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                        ₹{record.perHeadShare.toFixed(2)}
                      </td>
                    </tr>
                  ))}
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
