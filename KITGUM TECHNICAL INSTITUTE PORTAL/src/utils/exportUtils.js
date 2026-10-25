import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to CSV (Excel compatible)
 */
export const exportToCSV = (data, filename, columns) => {
  // Extract headers
  const headers = columns.map(col => col.header).join(',');
  
  // Extract rows
  const rows = data.map(item => {
    return columns.map(col => {
      let cell = item[col.key];
      // Escape quotes and wrap in quotes if there's a comma
      if (typeof cell === 'string') {
        cell = cell.replace(/"/g, '""');
        if (cell.includes(',')) {
          cell = `"${cell}"`;
        }
      }
      return cell;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to PDF using jsPDF and autoTable
 */
export const exportToPDF = (data, filename, columns, title) => {
  const doc = new jsPDF();
  
  const headers = [columns.map(col => col.header)];
  const rows = data.map(item => columns.map(col => item[col.key]));

  doc.text(title, 14, 15);
  
  doc.autoTable({
    head: headers,
    body: rows,
    startY: 20,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] } // Primary Navy color
  });

  doc.save(`${filename}.pdf`);
};
