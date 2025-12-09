import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Edit,
  Loader2,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMonths, useAddMonth, useUpdateMonth } from '@/hooks/useMonths';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Months = () => {
  const { data: months = [], isLoading, error } = useMonths();
  const addMonth = useAddMonth();
  const updateMonth = useUpdateMonth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<typeof months[0] | null>(null);
  
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    month_name: '',
    year: currentYear,
    total_rent: 0,
  });

  const resetForm = () => {
    setFormData({ month_name: '', year: currentYear, total_rent: 0 });
  };

  const handleAdd = async () => {
    if (!formData.month_name) return;
    
    await addMonth.mutateAsync({
      month_name: formData.month_name,
      year: formData.year,
      month_year: `${formData.month_name} ${formData.year}`,
      total_rent: formData.total_rent || null,
    });
    
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = (month: typeof months[0]) => {
    setSelectedMonth(month);
    setFormData({
      month_name: month.month_name,
      year: month.year,
      total_rent: Number(month.total_rent || 0),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedMonth || !formData.month_name) return;
    
    await updateMonth.mutateAsync({
      id: selectedMonth.id,
      month_name: formData.month_name,
      year: formData.year,
      month_year: `${formData.month_name} ${formData.year}`,
      total_rent: formData.total_rent || null,
    });
    
    setIsEditModalOpen(false);
    setSelectedMonth(null);
    resetForm();
  };

  const MonthForm = ({
    onSubmit,
    onClose,
    isSubmitting,
    submitLabel,
  }: {
    onSubmit: () => void;
    onClose: () => void;
    isSubmitting: boolean;
    submitLabel: string;
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="month_name">Month *</Label>
        <Select 
          value={formData.month_name} 
          onValueChange={(value) => setFormData({ ...formData, month_name: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year *</Label>
        <Select 
          value={formData.year.toString()} 
          onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="total_rent">Monthly Rent (₹)</Label>
        <Input
          id="total_rent"
          type="number"
          value={formData.total_rent}
          onChange={(e) => setFormData({ ...formData, total_rent: Number(e.target.value) })}
          placeholder="Enter monthly rent amount"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          onClick={onSubmit} 
          disabled={isSubmitting || !formData.month_name}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load months</p>
            <p className="text-muted-foreground text-sm">{error.message}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Months Management"
        description="Create and manage billing months"
        icon={Calendar}
        action={
          <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Month
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Month</DialogTitle>
                <DialogDescription>
                  Create a new billing month for rent records.
                </DialogDescription>
              </DialogHeader>
              <MonthForm
                onSubmit={handleAdd}
                onClose={() => setIsAddModalOpen(false)}
                isSubmitting={addMonth.isPending}
                submitLabel="Add Month"
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : months.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No months yet. Add your first month!
          </p>
        </div>
      ) : (
        /* Months Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {months.map((month, index) => (
              <motion.div
                key={month.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl border bg-card p-6 shadow-soft hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-lg font-semibold text-primary-foreground">
                      {month.month_name.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{month.month_name} {month.year}</h3>
                      <p className="text-sm text-muted-foreground">
                        {month.total_members || 0} members
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(month)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rent</span>
                    <span className="font-medium">₹{Number(month.total_rent || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EB Total</span>
                    <span className="font-medium">₹{Number(month.eb_total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra Total</span>
                    <span className="font-medium">₹{Number(month.extra_total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setSelectedMonth(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Month</DialogTitle>
            <DialogDescription>
              Update month information.
            </DialogDescription>
          </DialogHeader>
          <MonthForm
            onSubmit={handleUpdate}
            onClose={() => setIsEditModalOpen(false)}
            isSubmitting={updateMonth.isPending}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Months;
