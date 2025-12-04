import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  IndianRupee,
  Users,
  Zap,
  Wallet,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  RentCollectionChart,
  EBUsageChart,
  PaymentStatusChart,
} from '@/components/dashboard/Charts';
import { PageHeader } from '@/components/ui/PageHeader';
import { useMembers } from '@/hooks/useMembers';
import { useMonths } from '@/hooks/useMonths';
import { useRentRecords } from '@/hooks/useRentRecords';
import { usePayments } from '@/hooks/usePayments';

const Index = () => {
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: months = [], isLoading: monthsLoading } = useMonths();
  const { data: rentRecords = [], isLoading: rentLoading } = useRentRecords();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();

  const isLoading = membersLoading || monthsLoading || rentLoading || paymentsLoading;

  // Get current/latest month data
  const currentMonth = months[0];
  const activeMembers = members.filter((m) => m.status === 'active').length;

  // Calculate dashboard stats from real data
  const totalRent = currentMonth?.total_rent || 0;
  const ebUnits = currentMonth?.eb_units || 0;
  const ebTotal = currentMonth?.eb_total || 0;
  const ebPerHead = currentMonth?.eb_per_head || 0;
  const unitRate = currentMonth?.unit_rate || 5;
  const extraTotal = currentMonth?.extra_total || 0;

  // Payment status from rent records for current month
  const currentMonthRecords = rentRecords.filter(
    (r) => r.month_id === currentMonth?.id
  );
  const paidCount = currentMonthRecords.filter(
    (r) => r.payment_status === 'paid'
  ).length;
  const totalMonthlyRecords = currentMonthRecords.length || 1;
  const pendingAmount = currentMonthRecords
    .filter((r) => r.payment_status !== 'paid')
    .reduce((acc, r) => acc + (r.final_total || 0), 0);

  // Prepare chart data from months
  const monthlyStats = months.slice(0, 6).reverse().map((m) => ({
    month: m.month_name?.slice(0, 3) || '',
    rent: m.total_rent || 0,
    eb: m.eb_total || 0,
  }));

  const ebUsageData = months.slice(0, 6).reverse().map((m) => ({
    month: m.month_name?.slice(0, 3) || '',
    units: m.eb_units || 0,
  }));

  const paymentStatusData = [
    { name: 'Paid', value: paidCount, color: 'hsl(var(--success))' },
    { name: 'Pending', value: currentMonthRecords.filter((r) => r.payment_status === 'pending').length, color: 'hsl(var(--warning))' },
    { name: 'Unpaid', value: currentMonthRecords.filter((r) => r.payment_status === 'unpaid').length, color: 'hsl(var(--destructive))' },
  ];

  // Recent activity from payments
  const recentActivity = payments.slice(0, 5).map((p) => ({
    name: p.member?.name || 'Unknown',
    action: p.payment_type === 'advance' ? 'added advance' : 'paid rent',
    time: new Date(p.payment_date).toLocaleDateString('en-IN'),
    amount: `₹${p.amount.toLocaleString()}`,
  }));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your rent and utility management"
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Rent"
          value={`₹${totalRent.toLocaleString()}`}
          icon={IndianRupee}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Active Members"
          value={activeMembers}
          icon={Users}
          variant="success"
          delay={0.1}
        />
        <StatCard
          title="EB Units"
          value={ebUnits}
          icon={Zap}
          variant="warning"
          delay={0.2}
        />
        <StatCard
          title="Extra Expenses"
          value={`₹${extraTotal.toLocaleString()}`}
          icon={Wallet}
          variant="info"
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total EB Amount</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ₹{ebTotal.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10">
              <Zap className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              ₹{ebPerHead}/head
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              ₹{unitRate}/unit
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border bg-card p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {paidCount}/{totalMonthlyRecords}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{
                  width: `${(paidCount / totalMonthlyRecords) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((paidCount / totalMonthlyRecords) * 100)}% collected
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border bg-card p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ₹{pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {totalMonthlyRecords - paidCount} member(s) pending
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <RentCollectionChart data={monthlyStats} />
        <EBUsageChart data={ebUsageData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border bg-card p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {activity.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activity.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-success">
                      {activity.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
        <PaymentStatusChart data={paymentStatusData} />
      </div>
    </AppLayout>
  );
};

export default Index;