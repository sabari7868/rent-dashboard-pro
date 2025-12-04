import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MonthlyStatData {
  month: string;
  rent: number;
  eb: number;
}

interface EBUsageData {
  month: string;
  units: number;
}

interface PaymentStatusData {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-lg">
        <p className="text-sm font-medium text-popover-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface RentCollectionChartProps {
  data: MonthlyStatData[];
}

export function RentCollectionChart({ data }: RentCollectionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border bg-card p-6 shadow-soft"
    >
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Monthly Overview
      </h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ebGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="rent"
              name="Rent"
              stroke="hsl(var(--primary))"
              fill="url(#rentGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="eb"
              name="EB"
              stroke="hsl(var(--warning))"
              fill="url(#ebGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

interface EBUsageChartProps {
  data: EBUsageData[];
}

export function EBUsageChart({ data }: EBUsageChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border bg-card p-6 shadow-soft"
    >
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        EB Usage (Units)
      </h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="units" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

interface PaymentStatusChartProps {
  data: PaymentStatusData[];
}

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border bg-card p-6 shadow-soft"
    >
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Payment Status
      </h3>
      {!hasData ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No payment data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}