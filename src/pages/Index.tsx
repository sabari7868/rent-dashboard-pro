import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  IndianRupee,
  Users,
  Zap,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  RentCollectionChart,
  EBUsageChart,
  PaymentStatusChart,
} from '@/components/dashboard/Charts';
import { PageHeader } from '@/components/ui/PageHeader';
import { members, rentRecords, ebRecords, expenses } from '@/lib/data';

const Index = () => {
  // Calculate dashboard stats
  const totalMembers = members.filter((m) => m.status === 'active').length;
  const totalRent = rentRecords
    .filter((r) => r.month === 'November' && r.year === 2024)
    .reduce((acc, r) => acc + r.rent, 0);
  const currentEB = ebRecords[0];
  const currentExpenses = expenses[0];
  const paidCount = rentRecords.filter(
    (r) => r.month === 'November' && r.year === 2024 && r.status === 'paid'
  ).length;
  const totalMonthlyRecords = rentRecords.filter(
    (r) => r.month === 'November' && r.year === 2024
  ).length;

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
          trend={{ value: 5, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Active Members"
          value={totalMembers}
          icon={Users}
          variant="success"
          delay={0.1}
        />
        <StatCard
          title="EB Units"
          value={currentEB.units}
          icon={Zap}
          variant="warning"
          trend={{ value: 6, isPositive: false }}
          delay={0.2}
        />
        <StatCard
          title="Extra Expenses"
          value={`₹${currentExpenses.total.toLocaleString()}`}
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
                ₹{currentEB.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10">
              <Zap className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              ₹{currentEB.perHeadShare}/head
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              ₹{currentEB.perUnitCost}/unit
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
                ₹{(
                  rentRecords
                    .filter(
                      (r) =>
                        r.month === 'November' &&
                        r.year === 2024 &&
                        r.status !== 'paid'
                    )
                    .reduce((acc, r) => acc + r.total, 0)
                ).toLocaleString()}
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
        <RentCollectionChart />
        <EBUsageChart />
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
              {[
                { name: 'Rahul Kumar', action: 'paid rent', time: '2 hours ago', amount: '₹5,650' },
                { name: 'Priya Sharma', action: 'paid rent', time: '1 day ago', amount: '₹5,150' },
                { name: 'Sneha Reddy', action: 'added advance', time: '3 days ago', amount: '₹1,000' },
              ].map((activity, index) => (
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
              ))}
            </div>
          </motion.div>
        </div>
        <PaymentStatusChart />
      </div>
    </AppLayout>
  );
};

export default Index;
