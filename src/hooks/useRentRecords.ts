import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

export type RentRecord = Tables<'rent_records'>;
export type RentRecordInsert = TablesInsert<'rent_records'>;
export type RentRecordUpdate = TablesUpdate<'rent_records'>;

export interface RentRecordWithMember extends RentRecord {
  member: { name: string; avatar: string | null } | null;
  month: { month_year: string; month_name: string; year: number } | null;
}

export const useRentRecords = () => {
  return useQuery({
    queryKey: ['rent_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rent_records')
        .select(`
          *,
          member:members(name, avatar),
          month:months(month_year, month_name, year)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RentRecordWithMember[];
    },
  });
};

export const useAddRentRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<RentRecordInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rent_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent_records'] });
      toast({ title: 'Success', description: 'Rent record added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to add rent record', variant: 'destructive' });
    },
  });
};

export const useUpdateRentRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: RentRecordUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('rent_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent_records'] });
      toast({ title: 'Success', description: 'Rent record updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to update rent record', variant: 'destructive' });
    },
  });
};

export const useDeleteRentRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rent_records').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent_records'] });
      toast({ title: 'Success', description: 'Rent record deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete rent record', variant: 'destructive' });
    },
  });
};
