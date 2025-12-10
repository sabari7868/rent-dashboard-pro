import { memo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tables } from '@/integrations/supabase/types';

type Month = Tables<'months'>;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthSelectorProps {
  months: Month[];
  selectedMonthId: string;
  onMonthChange: (monthId: string) => void;
  showAddButton?: boolean;
  onAddMonth?: (month: { month_name: string; year: number; month_year: string }) => Promise<void>;
  isAddingMonth?: boolean;
}

interface NewMonthFormProps {
  onSubmit: (data: { month_name: string; year: number }) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const NewMonthFormComponent = ({ onSubmit, isSubmitting, onClose }: NewMonthFormProps) => {
  const currentDate = new Date();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      month_name: formData.get('month_name') as string,
      year: parseInt(formData.get('year') as string),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="month_name">Month</Label>
          <Select name="month_name" defaultValue={MONTH_NAMES[currentDate.getMonth()]}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={currentDate.getFullYear()}
            min={2020}
            max={2100}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Month
        </Button>
      </div>
    </form>
  );
};

const NewMonthForm = memo(NewMonthFormComponent);

const MonthSelectorComponent = ({
  months,
  selectedMonthId,
  onMonthChange,
  showAddButton = true,
  onAddMonth,
  isAddingMonth = false,
}: MonthSelectorProps) => {
  const handleAddMonth = async (data: { month_name: string; year: number }) => {
    if (onAddMonth) {
      await onAddMonth({
        month_name: data.month_name,
        year: data.year,
        month_year: `${data.month_name} ${data.year}`,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Label className="text-sm text-muted-foreground mb-1 block">Select Month</Label>
        <Select value={selectedMonthId} onValueChange={onMonthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No months available
              </div>
            ) : (
              months.map((month) => (
                <SelectItem key={month.id} value={month.id}>
                  {month.month_name} {month.year}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {showAddButton && onAddMonth && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="mt-5">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New Month</DialogTitle>
              <DialogDescription>
                Add a new billing month to track expenses.
              </DialogDescription>
            </DialogHeader>
            <NewMonthForm 
              onSubmit={handleAddMonth}
              isSubmitting={isAddingMonth}
              onClose={() => {}}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export const MonthSelector = memo(MonthSelectorComponent);
