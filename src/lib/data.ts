// Dummy data for the Rent & EB Management Application

export interface Member {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface RentRecord {
  id: string;
  memberId: string;
  memberName: string;
  month: string;
  year: number;
  rent: number;
  ebShare: number;
  extraShare: number;
  advance: number;
  total: number;
  status: 'paid' | 'pending' | 'unpaid';
  paidDate?: string;
}

export interface EBRecord {
  id: string;
  month: string;
  year: number;
  previousReading: number;
  currentReading: number;
  units: number;
  perUnitCost: number;
  totalAmount: number;
  perHeadShare: number;
}

export interface Expense {
  id: string;
  month: string;
  year: number;
  water: number;
  gas: number;
  internet: number;
  misc: number;
  total: number;
  perHead: number;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: 'rent' | 'advance' | 'other';
  status: 'completed' | 'pending' | 'failed';
}

export const members: Member[] = [
  { id: '1', name: 'Rahul Kumar', avatar: 'RK', phone: '+91 98765 43210', email: 'rahul@email.com', joinDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Priya Sharma', avatar: 'PS', phone: '+91 98765 43211', email: 'priya@email.com', joinDate: '2024-02-01', status: 'active' },
  { id: '3', name: 'Amit Patel', avatar: 'AP', phone: '+91 98765 43212', email: 'amit@email.com', joinDate: '2024-01-20', status: 'active' },
  { id: '4', name: 'Sneha Reddy', avatar: 'SR', phone: '+91 98765 43213', email: 'sneha@email.com', joinDate: '2024-03-10', status: 'active' },
  { id: '5', name: 'Vikram Singh', avatar: 'VS', phone: '+91 98765 43214', email: 'vikram@email.com', joinDate: '2024-02-15', status: 'inactive' },
];

export const rentRecords: RentRecord[] = [
  { id: '1', memberId: '1', memberName: 'Rahul Kumar', month: 'November', year: 2024, rent: 5000, ebShare: 450, extraShare: 200, advance: 0, total: 5650, status: 'paid', paidDate: '2024-11-05' },
  { id: '2', memberId: '2', memberName: 'Priya Sharma', month: 'November', year: 2024, rent: 5000, ebShare: 450, extraShare: 200, advance: 500, total: 5150, status: 'paid', paidDate: '2024-11-03' },
  { id: '3', memberId: '3', memberName: 'Amit Patel', month: 'November', year: 2024, rent: 5000, ebShare: 450, extraShare: 200, advance: 0, total: 5650, status: 'pending' },
  { id: '4', memberId: '4', memberName: 'Sneha Reddy', month: 'November', year: 2024, rent: 5000, ebShare: 450, extraShare: 200, advance: 1000, total: 4650, status: 'unpaid' },
  { id: '5', memberId: '1', memberName: 'Rahul Kumar', month: 'October', year: 2024, rent: 5000, ebShare: 420, extraShare: 180, advance: 0, total: 5600, status: 'paid', paidDate: '2024-10-05' },
  { id: '6', memberId: '2', memberName: 'Priya Sharma', month: 'October', year: 2024, rent: 5000, ebShare: 420, extraShare: 180, advance: 0, total: 5600, status: 'paid', paidDate: '2024-10-04' },
  { id: '7', memberId: '3', memberName: 'Amit Patel', month: 'October', year: 2024, rent: 5000, ebShare: 420, extraShare: 180, advance: 0, total: 5600, status: 'paid', paidDate: '2024-10-06' },
  { id: '8', memberId: '4', memberName: 'Sneha Reddy', month: 'October', year: 2024, rent: 5000, ebShare: 420, extraShare: 180, advance: 0, total: 5600, status: 'paid', paidDate: '2024-10-02' },
];

export const ebRecords: EBRecord[] = [
  { id: '1', month: 'November', year: 2024, previousReading: 4520, currentReading: 4880, units: 360, perUnitCost: 5, totalAmount: 1800, perHeadShare: 450 },
  { id: '2', month: 'October', year: 2024, previousReading: 4180, currentReading: 4520, units: 340, perUnitCost: 5, totalAmount: 1700, perHeadShare: 425 },
  { id: '3', month: 'September', year: 2024, previousReading: 3850, currentReading: 4180, units: 330, perUnitCost: 5, totalAmount: 1650, perHeadShare: 412.5 },
  { id: '4', month: 'August', year: 2024, previousReading: 3500, currentReading: 3850, units: 350, perUnitCost: 5, totalAmount: 1750, perHeadShare: 437.5 },
  { id: '5', month: 'July', year: 2024, previousReading: 3180, currentReading: 3500, units: 320, perUnitCost: 5, totalAmount: 1600, perHeadShare: 400 },
  { id: '6', month: 'June', year: 2024, previousReading: 2880, currentReading: 3180, units: 300, perUnitCost: 5, totalAmount: 1500, perHeadShare: 375 },
];

export const expenses: Expense[] = [
  { id: '1', month: 'November', year: 2024, water: 400, gas: 200, internet: 150, misc: 50, total: 800, perHead: 200 },
  { id: '2', month: 'October', year: 2024, water: 380, gas: 180, internet: 150, misc: 10, total: 720, perHead: 180 },
  { id: '3', month: 'September', year: 2024, water: 350, gas: 200, internet: 150, misc: 100, total: 800, perHead: 200 },
  { id: '4', month: 'August', year: 2024, water: 400, gas: 220, internet: 150, misc: 30, total: 800, perHead: 200 },
];

export const payments: Payment[] = [
  { id: '1', memberId: '1', memberName: 'Rahul Kumar', amount: 5650, date: '2024-11-05', type: 'rent', status: 'completed' },
  { id: '2', memberId: '2', memberName: 'Priya Sharma', amount: 5150, date: '2024-11-03', type: 'rent', status: 'completed' },
  { id: '3', memberId: '2', memberName: 'Priya Sharma', amount: 500, date: '2024-10-15', type: 'advance', status: 'completed' },
  { id: '4', memberId: '4', memberName: 'Sneha Reddy', amount: 1000, date: '2024-10-20', type: 'advance', status: 'completed' },
  { id: '5', memberId: '3', memberName: 'Amit Patel', amount: 5650, date: '2024-11-10', type: 'rent', status: 'pending' },
];

export const monthlyStats = [
  { month: 'Jun', rent: 20000, eb: 1500, expenses: 800 },
  { month: 'Jul', rent: 20000, eb: 1600, expenses: 720 },
  { month: 'Aug', rent: 20000, eb: 1750, expenses: 800 },
  { month: 'Sep', rent: 20000, eb: 1650, expenses: 800 },
  { month: 'Oct', rent: 20000, eb: 1700, expenses: 720 },
  { month: 'Nov', rent: 20000, eb: 1800, expenses: 800 },
];

export const ebUsageData = [
  { month: 'Jun', units: 300 },
  { month: 'Jul', units: 320 },
  { month: 'Aug', units: 350 },
  { month: 'Sep', units: 330 },
  { month: 'Oct', units: 340 },
  { month: 'Nov', units: 360 },
];

export const paymentStatusData = [
  { name: 'Paid', value: 2, color: 'hsl(var(--success))' },
  { name: 'Pending', value: 1, color: 'hsl(var(--warning))' },
  { name: 'Unpaid', value: 1, color: 'hsl(var(--destructive))' },
];
