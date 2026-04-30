"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Filter, Calendar, TrendingUp, TrendingDown, ChevronRight, BarChart3, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";

export default function ReportsPage({ customers, transactions }: { customers: any[], transactions: any[] }) {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const exportExcel = async () => {
    setLoadingType('excel');
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Pasal Udhaar';
      workbook.lastModifiedBy = 'Pasal Udhaar';
      workbook.created = new Date();

      // 1. Customer Balances Sheet
      const worksheetBal = workbook.addWorksheet('Customer Balances', {
        views: [{ state: 'frozen', ySplit: 1 }],
        properties: { tabColor: { argb: 'FF2563EB' } }
      });

      worksheetBal.columns = [
        { header: 'S.N.', key: 'sn', width: 8 },
        { header: 'Customer Name', key: 'name', width: 30 },
        { header: 'Phone Number', key: 'phone', width: 20 },
        { header: 'Current Balance (Rs)', key: 'balance', width: 25 },
      ];

      // Style Header
      const headerRow = worksheetBal.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;

      let totalPending = 0;
      customers.forEach((c, index) => {
        const cTxs = transactions.filter(t => t.customerId === c._id || t.customerId?._id === c._id);
        const latestTx = cTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const balance = latestTx ? latestTx.remainingBalance : 0;
        totalPending += balance;

        const row = worksheetBal.addRow({
          sn: index + 1,
          name: c.name,
          phone: c.phone,
          balance: balance
        });

        // Zebra Striping
        if (index % 2 !== 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }
        
        row.getCell('balance').numFmt = '"रु "#,##0';
        row.alignment = { vertical: 'middle' };
      });

      // Add Total Row
      const footerRow = worksheetBal.addRow({
        phone: 'TOTAL PENDING',
        balance: totalPending
      });
      footerRow.font = { bold: true, size: 13 };
      footerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      footerRow.getCell('balance').numFmt = '"रु "#,##0';

      // 2. Full Transaction History Sheet
      const worksheetHist = workbook.addWorksheet('Transaction History', {
        views: [{ state: 'frozen', ySplit: 1 }],
        properties: { tabColor: { argb: 'FF22C55E' } }
      });

      worksheetHist.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer', key: 'customer', width: 30 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Amount (Rs)', key: 'amount', width: 20 },
        { header: 'Balance After', key: 'remaining', width: 20 },
        { header: 'Details/Items', key: 'details', width: 40 },
      ];

      // Style Header
      const histHeader = worksheetHist.getRow(1);
      histHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      histHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166534' } };
      histHeader.alignment = { vertical: 'middle', horizontal: 'center' };
      histHeader.height = 25;

      transactions.forEach((t, index) => {
        const row = worksheetHist.addRow({
          date: t.nepaliDate,
          customer: t.customerId?.name || 'Unknown',
          type: t.type === 'credit' ? 'उधार (Credit)' : 'भुक्तानी (Paid)',
          amount: t.amount,
          remaining: t.remainingBalance,
          details: t.itemDetails || '-'
        });

        if (index % 2 !== 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } };
        }

        const typeCell = row.getCell('type');
        if (t.type === 'credit') {
          typeCell.font = { color: { argb: 'FFEA580C' }, bold: true };
        } else {
          typeCell.font = { color: { argb: 'FF16A34A' }, bold: true };
        }

        row.getCell('amount').numFmt = '"रु "#,##0';
        row.getCell('remaining').numFmt = '"रु "#,##0';
        row.alignment = { vertical: 'middle' };
      });

      // Borders for all cells
      [worksheetBal, worksheetHist].forEach(ws => {
        ws.eachRow((row) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
          });
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pasal_Udhaar_Full_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("Error exporting Excel");
    }
    setLoadingType(null);
  };

  const exportPDF = async () => {
    setLoadingType('pdf');
    try {
      const { jsPDF } = (await import('jspdf'));
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("PASAL UDHAAR", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("Basnet Khadnya Bikri Sasta • Credit Statement", 14, 28);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34);

      // Summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Customer Balances Summary", 14, 50);
      
      let totalPending = 0;
      const tableData = customers.map((c, index) => {
        const cTxs = transactions.filter(t => t.customerId === c._id || t.customerId?._id === c._id);
        const latestTx = cTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const balance = latestTx ? latestTx.remainingBalance : 0;
        totalPending += balance;
        return [
          index + 1,
          c.name,
          c.phone,
          `Rs. ${balance.toLocaleString()}`
        ];
      });

      autoTable(doc, {
        head: [['S.N.', 'Name', 'Phone', 'Balance']],
        body: tableData,
        startY: 55,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
        foot: [['', 'TOTAL PENDING', '', `Rs. ${totalPending.toLocaleString()}`]],
        footStyles: { fillColor: [254, 226, 226], textColor: [153, 27, 27], fontStyle: 'bold' },
      });

      doc.save(`Pasal_Udhaar_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Error exporting PDF");
    }
    setLoadingType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">रिपोर्ट</h1>
          <p className="text-base text-slate-500 font-medium">Reports & Analytics</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5">
          <Calendar size={14} />
          As of today
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-lg p-5 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Credit</span>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0))}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">Lifetime total credit given</p>
        </div>
        
        <div className="card-lg p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} className="text-green-500" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Paid</span>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(transactions.filter(t => t.type === 'payment').reduce((acc, t) => acc + t.amount, 0))}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">Total payments received</p>
        </div>

        <div className="card-lg p-5 border-l-4 border-l-blue-600 bg-blue-50/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Net Pending</span>
          </div>
          <p className="text-2xl font-black text-blue-700">
            {formatCurrency(
              transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0) -
              transactions.filter(t => t.type === 'payment').reduce((acc, t) => acc + t.amount, 0)
            )}
          </p>
          <p className="text-xs text-blue-400 font-medium mt-1">Current market balance</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Download size={20} className="text-primary" />
          डाटा डाउनलोड • Export Statement
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button 
            onClick={exportExcel}
            disabled={loadingType !== null}
            className="group relative bg-slate-50 hover:bg-green-50 border-2 border-slate-100 hover:border-green-200 rounded-2xl p-6 text-left transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Excel Statement</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Detailed ledger with frozen headers, colors, and auto-calculations.</p>
              <div className="mt-5 flex items-center gap-2 text-green-700 font-bold text-sm">
                {loadingType === 'excel' ? (
                  <span className="flex items-center gap-2 italic">
                    <div className="w-4 h-4 border-2 border-green-300 border-t-green-700 rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>Download Full XLSX <ChevronRight size={16} /></>
                )}
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform" />
          </button>

          <button 
            onClick={exportPDF}
            disabled={loadingType !== null}
            className="group relative bg-slate-50 hover:bg-red-50 border-2 border-slate-100 hover:border-red-200 rounded-2xl p-6 text-left transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">PDF Statement</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Print-ready summary of all customer balances with shop branding.</p>
              <div className="mt-5 flex items-center gap-2 text-red-700 font-bold text-sm">
                {loadingType === 'pdf' ? (
                  <span className="flex items-center gap-2 italic">
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-700 rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <>Download PDF Summary <ChevronRight size={16} /></>
                )}
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform" />
          </button>
        </div>
      </div>

      <div className="card p-6 bg-slate-900 text-white border-none">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <BarChart3 className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Smart Reporting</h3>
            <p className="text-sm text-slate-400 mt-1 font-medium leading-relaxed">
              Our reports are automatically formatted for professional use. Excel files include separate sheets for balances and full history with automatic accounting formulas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
