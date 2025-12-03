import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

export type Month = Tables<'months'>;
export type MonthInsert = TablesInsert<'months'>;
export type MonthUpdate = TablesUpdate<'months'>;

export const useMonths = () => {
  return useQuery({
    queryKey: ['months'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('months')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Month[];
    },
  });
};

export const useAddMonth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (month: Omit<MonthInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('months')
        .insert(month)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      toast({ title: 'Success', description: 'Month record added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to add month record', variant: 'destructive' });
    },
  });
};

export const useUpdateMonth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: MonthUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('months')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      toast({ title: 'Success', description: 'Month record updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to update month record', variant: 'destructive' });
    },
  });
};
