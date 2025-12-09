import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MemberFormData {
  name: string;
  phone: string;
  email: string;
  room_no: string;
}

interface MemberFormProps {
  initialData?: MemberFormData;
  onSubmit: (data: MemberFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const MemberForm = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  submitLabel,
}: MemberFormProps) => {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    phone: '',
    email: '',
    room_no: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter member name"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="room_no">Room Number</Label>
        <Input
          id="room_no"
          value={formData.room_no}
          onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
          placeholder="e.g., 101"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91 98765 43210"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !formData.name.trim()}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
