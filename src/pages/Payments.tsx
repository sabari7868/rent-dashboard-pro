import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayments } from '@/hooks/usePayments';
import { useMonths } from '@/hooks/useMonths';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: payments = [], isLoading: loadingPayments, error } = usePayments();
  const { data: months = [] } = useMonths();

  const filteredPayments = payments.filter((payment) => {
    const memberName = payment.member?.name || '';
    const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const thisMonthPayments = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date);
      const now = new Date();
      return p.status === 'completed' && 
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const paymentChartData = months.slice(0, 6).reverse().map((month) => ({
    month: month.month_name?.slice(0, 3) || '',
    amount: Number(month.total_rent || 0) + Number(month.eb_total || 0) + Number(month.extra_total || 0),
  }));

  if (loadingPayments) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-destructive">
          Error loading payments: {error.message}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Payments & Advances"
        description="Track all payments and advance collections"
        icon={CreditCard}
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          {
            title: 'Total Collected',
            value: `₹${totalCollected.toLocaleString()}`,
            icon: CheckCircle,
            color: 'success',
          },
          {
            title: 'Pending',
            value: `₹${pendingAmount.toLocaleString()}`,
            icon: Clock,
            color: 'warning',
          },
          {
            title: 'This Month',
            value: `₹${thisMonthPayments.toLocaleString()}`,
            icon: TrendingUp,
            color: 'primary',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Payment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={paymentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="advance">Advance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Payments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No payments found
          </div>
        ) : (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-soft hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {payment.member?.avatar || payment.member?.name?.split(' ').map((n) => n[0]).join('') || '?'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{payment.member?.name || 'Unknown'}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize">{payment.payment_type}</span>
                    <span>•</span>
                    <span>
                      {new Date(payment.payment_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={payment.status as 'completed' | 'pending' | 'failed'} />
                <span className="font-semibold text-lg text-foreground">
                  ₹{Number(payment.amount).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Payments;
