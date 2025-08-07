"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComparison } from './ComparisonContext';
import {
  Download,
  FileSpreadsheet,
  FilePdf,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getAllServices } from './comparisonUtils';
import { ComparisonFeature, comparisonFeatures } from './comparisonUtils';

export function ExportComparison() {
  const { selectedCompanies } = useComparison();
  const [isOpen, setIsOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    pdf: 'idle' | 'loading' | 'success' | 'error';
    csv: 'idle' | 'loading' | 'success' | 'error';
  }>({
    pdf: 'idle',
    csv: 'idle'
  });

  // Function to export as CSV
  const exportAsCSV = () => {
    setExportStatus(prev => ({ ...prev, csv: 'loading' }));

    try {
      // Create CSV header row
      const header = ['Feature', ...selectedCompanies.map(c => c.name)];
      const rows: string[][] = [header];

      // Add basic info rows
      rows.push(['', '']); // Empty row
      rows.push(['BASIC INFORMATION', '']);

      comparisonFeatures
        .filter(feature => feature.category === 'basic')
        .forEach(feature => {
          const row = [
            feature.label,
            ...selectedCompanies.map(company => {
              const value = feature.getValue(company);
              return value !== undefined ? String(value) : 'Not specified';
            })
          ];
          rows.push(row);
        });

      // Add financial info rows
      rows.push(['', '']); // Empty row
      rows.push(['FINANCIAL INFORMATION', '']);

      comparisonFeatures
        .filter(feature => feature.category === 'financial')
        .forEach(feature => {
          const row = [
            feature.label,
            ...selectedCompanies.map(company => {
              const value = feature.getValue(company);
              return value !== undefined ? String(value) : 'Not specified';
            })
          ];
          rows.push(row);
        });

      // Add services rows
      rows.push(['', '']); // Empty row
      rows.push(['SERVICES', '']);

      const allServices = getAllServices(selectedCompanies);
      allServices.forEach(service => {
        const row = [
          service,
          ...selectedCompanies.map(company =>
            company.services.includes(service) ? 'Yes' : 'No'
          )
        ];
        rows.push(row);
      });

      // Convert rows to CSV string
      const csvContent = rows
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'company-comparison.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportStatus(prev => ({ ...prev, csv: 'success' }));
      setTimeout(() => {
        setExportStatus(prev => ({ ...prev, csv: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportStatus(prev => ({ ...prev, csv: 'error' }));
      setTimeout(() => {
        setExportStatus(prev => ({ ...prev, csv: 'idle' }));
      }, 2000);
    }
  };

  // Function to export as PDF
  const exportAsPDF = () => {
    setExportStatus(prev => ({ ...prev, pdf: 'loading' }));

    try {
      // In a real implementation, we would use a library like jsPDF or html2pdf
      // to generate a PDF with proper styling and formatting.
      // For this demo, we'll simulate the PDF export with a timeout

      setTimeout(() => {
        // In a real implementation, we would generate the PDF here
        console.log('PDF export would happen here with a library like jsPDF');

        // Simulating success
        setExportStatus(prev => ({ ...prev, pdf: 'success' }));
        setTimeout(() => {
          setExportStatus(prev => ({ ...prev, pdf: 'idle' }));
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setExportStatus(prev => ({ ...prev, pdf: 'error' }));
      setTimeout(() => {
        setExportStatus(prev => ({ ...prev, pdf: 'idle' }));
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
          disabled={selectedCompanies.length === 0}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Comparison</DialogTitle>
          <DialogDescription>
            Export your company comparison data as a PDF or spreadsheet.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            className="flex flex-col items-center justify-center h-auto py-6"
            onClick={exportAsPDF}
            disabled={exportStatus.pdf === 'loading'}
          >
            {exportStatus.pdf === 'loading' ? (
              <span className="loading loading-spinner"></span>
            ) : exportStatus.pdf === 'success' ? (
              <Check className="h-10 w-10 mb-2" />
            ) : (
              <FilePdf className="h-10 w-10 mb-2" />
            )}
            <span className="mt-2">Export as PDF</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-auto py-6"
            onClick={exportAsCSV}
            disabled={exportStatus.csv === 'loading'}
          >
            {exportStatus.csv === 'loading' ? (
              <span className="loading loading-spinner"></span>
            ) : exportStatus.csv === 'success' ? (
              <Check className="h-10 w-10 mb-2" />
            ) : (
              <FileSpreadsheet className="h-10 w-10 mb-2" />
            )}
            <span className="mt-2">Export as Spreadsheet</span>
          </Button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>The CSV export includes all comparison data and can be opened in any spreadsheet application like Excel or Google Sheets.</p>
          <p className="mt-2">The PDF export includes a formatted report with company profiles and comparison tables.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
