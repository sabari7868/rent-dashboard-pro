import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { exportToPDF, exportToExcel } from '@/lib/export';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRentRecords, useDeleteRentRecord, useAddRentRecord, useUpdateRentRecord, RentRecordWithMember } from '@/hooks/useRentRecords';
import { useMembers } from '@/hooks/useMembers';
import { useMonths } from '@/hooks/useMonths';
import { RentRecordForm, initialFormData, RentFormData } from '@/components/rent/RentRecordForm';

const Rent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RentRecordWithMember | null>(null);
  const [formData, setFormData] = useState<RentFormData>(initialFormData);
  const itemsPerPage = 5;

  const { data: rentRecords = [], isLoading, error } = useRentRecords();
  const { data: members = [] } = useMembers();
  const { data: months = [] } = useMonths();
  const deleteRentRecord = useDeleteRentRecord();
  const addRentRecord = useAddRentRecord();
  const updateRentRecord = useUpdateRentRecord();

  const filteredRecords = rentRecords.filter((record) => {
    const memberName = record.member?.name || '';
    const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const calculateTotal = (data: RentFormData) => {
    const rent = parseFloat(data.rent) || 0;
    const eb = parseFloat(data.eb_share) || 0;
    const extra = parseFloat(data.extra_share) || 0;
    const advance = parseFloat(data.advance) || 0;
    return rent + eb + extra - advance;
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleAdd = async () => {
    if (!formData.member_id || !formData.month_id) {
      toast({ title: 'Error', description: 'Please select member and month', variant: 'destructive' });
      return;
    }
    
    await addRentRecord.mutateAsync({
      member_id: formData.member_id,
      month_id: formData.month_id,
      rent: parseFloat(formData.rent) || 0,
      eb_share: parseFloat(formData.eb_share) || 0,
      extra_share: parseFloat(formData.extra_share) || 0,
      advance: parseFloat(formData.advance) || 0,
      final_total: calculateTotal(formData),
      payment_status: formData.payment_status,
    });
    
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = (record: RentRecordWithMember) => {
    setSelectedRecord(record);
    setFormData({
      member_id: record.member_id,
      month_id: record.month_id,
      rent: record.rent ? String(record.rent) : '',
      eb_share: record.eb_share ? String(record.eb_share) : '',
      extra_share: record.extra_share ? String(record.extra_share) : '',
      advance: record.advance ? String(record.advance) : '',
      payment_status: record.payment_status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRecord) return;
    
    await updateRentRecord.mutateAsync({
      id: selectedRecord.id,
      member_id: formData.member_id,
      month_id: formData.month_id,
      rent: parseFloat(formData.rent) || 0,
      eb_share: parseFloat(formData.eb_share) || 0,
      extra_share: parseFloat(formData.extra_share) || 0,
      advance: parseFloat(formData.advance) || 0,
      final_total: calculateTotal(formData),
      payment_status: formData.payment_status,
    });
    
    setIsEditModalOpen(false);
    setSelectedRecord(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-destructive">
          Error loading rent records: {error.message}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Monthly Rent Sheet"
        description="Manage and track monthly rent payments"
        icon={Receipt}
        action={
          <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Rent Record</DialogTitle>
                <DialogDescription>
                  Create a new rent record for a member. EB and Extra shares are auto-filled from the selected month.
                </DialogDescription>
              </DialogHeader>
              <RentRecordForm
                formData={formData}
                setFormData={setFormData}
                members={members}
                months={months}
                onSubmit={handleAdd}
                onClose={() => setIsAddModalOpen(false)}
                isSubmitting={addRentRecord.isPending}
                submitLabel="Add Record"
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              exportToPDF(filteredRecords);
              toast({ title: 'PDF Export', description: 'PDF opened in new tab for printing' });
            }}
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              exportToExcel(filteredRecords);
              toast({ title: 'Excel Export', description: 'CSV file downloaded successfully' });
            }}
          >
            <Download className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border bg-card shadow-soft overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold">Member</TableHead>
                <TableHead className="font-semibold">Month</TableHead>
                <TableHead className="font-semibold text-right">Rent</TableHead>
                <TableHead className="font-semibold text-right">EB Share</TableHead>
                <TableHead className="font-semibold text-right">Extra</TableHead>
                <TableHead className="font-semibold text-right">Advance</TableHead>
                <TableHead className="font-semibold text-right">Total</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No rent records found. Click "Add Record" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {record.member?.avatar || record.member?.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <span className="text-foreground">{record.member?.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.month?.month_name} {record.month?.year}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ₹{Number(record.rent || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ₹{Number(record.eb_share || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ₹{Number(record.extra_share || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ₹{Number(record.advance || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ₹{Number(record.final_total || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={record.payment_status as 'paid' | 'pending' | 'unpaid'} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteRentRecord.mutate(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of{' '}
              {filteredRecords.length} records
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setSelectedRecord(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Rent Record</DialogTitle>
            <DialogDescription>
              Update the rent record details.
            </DialogDescription>
          </DialogHeader>
          <RentRecordForm
            formData={formData}
            setFormData={setFormData}
            members={members}
            months={months}
            onSubmit={handleUpdate}
            onClose={() => setIsEditModalOpen(false)}
            isSubmitting={updateRentRecord.isPending}
            submitLabel="Update Record"
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Rent;
