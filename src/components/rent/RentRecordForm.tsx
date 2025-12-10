import { useState, useEffect, memo } from 'react';
import { Loader2 } from 'lucide-react';
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
import { Tables } from '@/integrations/supabase/types';

type Member = Tables<'members'>;
type Month = Tables<'months'>;

export interface RentFormData {
  member_id: string;
  month_id: string;
  rent: string;
  eb_share: string;
  extra_share: string;
  advance: string;
  payment_status: string;
}

export const initialFormData: RentFormData = {
  member_id: '',
  month_id: '',
  rent: '',
  eb_share: '',
  extra_share: '',
  advance: '',
  payment_status: 'pending',
};

interface RentRecordFormProps {
  formData: RentFormData;
  setFormData: React.Dispatch<React.SetStateAction<RentFormData>>;
  members: Member[];
  months: Month[];
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const RentRecordFormComponent = ({
  formData,
  setFormData,
  members,
  months,
  onSubmit,
  onClose,
  isSubmitting,
  submitLabel,
}: RentRecordFormProps) => {
  const calculateTotal = () => {
    const rent = parseFloat(formData.rent) || 0;
    const eb = parseFloat(formData.eb_share) || 0;
    const extra = parseFloat(formData.extra_share) || 0;
    const advance = parseFloat(formData.advance) || 0;
    return rent + eb + extra - advance;
  };

  // Auto-fill EB and Extra when month is selected
  useEffect(() => {
    if (formData.month_id) {
      const selectedMonth = months.find(m => m.id === formData.month_id);
      if (selectedMonth) {
        setFormData(prev => ({
          ...prev,
          eb_share: selectedMonth.eb_per_head ? String(selectedMonth.eb_per_head) : '',
          extra_share: selectedMonth.extra_per_head ? String(selectedMonth.extra_per_head) : '',
        }));
      }
    }
  }, [formData.month_id, months, setFormData]);

  const handleChange = (field: keyof RentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Member *</Label>
          <Select 
            value={formData.member_id} 
            onValueChange={(value) => handleChange('member_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Month *</Label>
          <Select 
            value={formData.month_id} 
            onValueChange={(value) => handleChange('month_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No months available. Create one in EB or Extra page first.
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rent">Rent (₹)</Label>
          <Input
            id="rent"
            type="number"
            placeholder="Enter rent"
            value={formData.rent}
            onChange={(e) => handleChange('rent', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eb_share">EB Share (₹)</Label>
          <Input
            id="eb_share"
            type="number"
            placeholder="Auto-filled from month"
            value={formData.eb_share}
            onChange={(e) => handleChange('eb_share', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="extra_share">Extra Share (₹)</Label>
          <Input
            id="extra_share"
            type="number"
            placeholder="Auto-filled from month"
            value={formData.extra_share}
            onChange={(e) => handleChange('extra_share', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="advance">Advance (₹)</Label>
          <Input
            id="advance"
            type="number"
            placeholder="Enter advance"
            value={formData.advance}
            onChange={(e) => handleChange('advance', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Payment Status</Label>
        <Select 
          value={formData.payment_status} 
          onValueChange={(value) => handleChange('payment_status', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          onClick={onSubmit} 
          disabled={isSubmitting || !formData.member_id || !formData.month_id}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export const RentRecordForm = memo(RentRecordFormComponent);
