import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

export type Payment = Tables<'payments'>;
export type PaymentInsert = TablesInsert<'payments'>;
export type PaymentUpdate = TablesUpdate<'payments'>;

export interface PaymentWithMember extends Payment {
  member: { name: string; avatar: string | null } | null;
}

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          member:members(name, avatar)
        `)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data as PaymentWithMember[];
    },
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: Omit<PaymentInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({ title: 'Success', description: 'Payment recorded successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to record payment', variant: 'destructive' });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: PaymentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({ title: 'Success', description: 'Payment updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to update payment', variant: 'destructive' });
    },
  });
};
