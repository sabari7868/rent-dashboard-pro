import { RentRecordWithMember } from '@/hooks/useRentRecords';

export const exportToPDF = (records: RentRecordWithMember[]) => {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rent Records</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f4f4f4; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .paid { color: green; }
        .pending { color: orange; }
        .unpaid { color: red; }
      </style>
    </head>
    <body>
      <h1>Monthly Rent Sheet</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Month</th>
            <th class="text-right">Rent</th>
            <th class="text-right">EB Share</th>
            <th class="text-right">Extra</th>
            <th class="text-right">Advance</th>
            <th class="text-right">Total</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => `
            <tr>
              <td>${record.member?.name || 'Unknown'}</td>
              <td>${record.month?.month_name || ''} ${record.month?.year || ''}</td>
              <td class="text-right">₹${Number(record.rent || 0).toLocaleString()}</td>
              <td class="text-right">₹${Number(record.eb_share || 0).toLocaleString()}</td>
              <td class="text-right">₹${Number(record.extra_share || 0).toLocaleString()}</td>
              <td class="text-right">₹${Number(record.advance || 0).toLocaleString()}</td>
              <td class="text-right">₹${Number(record.final_total || 0).toLocaleString()}</td>
              <td class="text-center ${record.payment_status}">${record.payment_status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export const exportToExcel = (records: RentRecordWithMember[]) => {
  // Create CSV content
  const headers = ['Member', 'Month', 'Rent', 'EB Share', 'Extra', 'Advance', 'Total', 'Status'];
  const rows = records.map(record => [
    record.member?.name || 'Unknown',
    `${record.month?.month_name || ''} ${record.month?.year || ''}`,
    record.rent || 0,
    record.eb_share || 0,
    record.extra_share || 0,
    record.advance || 0,
    record.final_total || 0,
    record.payment_status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `rent_records_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
