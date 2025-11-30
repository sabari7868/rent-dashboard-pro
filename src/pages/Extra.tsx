import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Droplets, Flame, Wifi, MoreHorizontal, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { expenses, members } from '@/lib/data';

const expenseIcons = {
  water: Droplets,
  gas: Flame,
  internet: Wifi,
  misc: MoreHorizontal,
};

const Extra = () => {
  const [water, setWater] = useState(expenses[0].water);
  const [gas, setGas] = useState(expenses[0].gas);
  const [internet, setInternet] = useState(expenses[0].internet);
  const [misc, setMisc] = useState(expenses[0].misc);

  const total = water + gas + internet + misc;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const perHead = activeMembers > 0 ? total / activeMembers : 0;

  const expenseItems = [
    { id: 'water', label: 'Water', value: water, setValue: setWater, icon: Droplets, color: 'info' },
    { id: 'gas', label: 'Gas', value: gas, setValue: setGas, icon: Flame, color: 'warning' },
    { id: 'internet', label: 'Internet', value: internet, setValue: setInternet, icon: Wifi, color: 'primary' },
    { id: 'misc', label: 'Miscellaneous', value: misc, setValue: setMisc, icon: MoreHorizontal, color: 'muted' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Extra Expenses"
        description="Manage additional monthly expenses"
        icon={Wallet}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense Cards */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {expenseItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-soft hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-${item.color}/10`}>
                          <item.icon className={`h-4 w-4 text-${item.color}`} />
                        </div>
                        {item.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor={item.id} className="text-xs text-muted-foreground">
                          Amount (₹)
                        </Label>
                        <Input
                          id={item.id}
                          type="number"
                          value={item.value}
                          onChange={(e) => item.setValue(Number(e.target.value))}
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Per Head</span>
                        <span className="font-medium text-foreground">
                          ₹{activeMembers > 0 ? (item.value / activeMembers).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-soft sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {expenseItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">
                      ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-medium text-foreground">{activeMembers}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-medium text-foreground">Per Head Share</span>
                  <span className="font-bold text-xl text-primary">
                    ₹{perHead.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button className="w-full gap-2 mt-4">
                <Save className="h-4 w-4" />
                Save Expenses
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-xl border bg-card shadow-soft overflow-hidden"
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-card-foreground">Expense History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Month
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Water
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Gas
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Internet
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Misc
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Per Head
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {expense.month} {expense.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                    ₹{expense.water}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                    ₹{expense.gas}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                    ₹{expense.internet}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                    ₹{expense.misc}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                    ₹{expense.total}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-primary">
                    ₹{expense.perHead}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Extra;
