"use client";

import { useEffect, useState } from "react";
import { getCustomer } from "@/actions/customer";
import { getCustomerTransactions } from "@/actions/transaction";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";
import { Phone, MapPin, PlusCircle, CreditCard, CheckCircle2, AlertCircle, ChevronLeft, Calendar, FileSpreadsheet, Download } from "lucide-react";
import { use } from "react";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([getCustomer(id), getCustomerTransactions(id)]).then(([c, t]) => {
      setCustomer(c);
      setTransactions(t);
      setLoading(false);
    });
  }, [id]);

  const exportExcel = async () => {
    setExporting(true);
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Customer Statement', {
        views: [{ state: 'frozen', ySplit: 1 }]
      });

      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Amount (Rs)', key: 'amount', width: 15 },
        { header: 'Balance (Rs)', key: 'balance', width: 15 },
        { header: 'Details', key: 'details', width: 40 },
      ];

      // Header Style
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

      transactions.forEach((tx, index) => {
        const row = worksheet.addRow({
          date: tx.nepaliDate,
          type: tx.type === 'credit' ? 'उधार' : 'भुक्तानी',
          amount: tx.amount,
          balance: tx.remainingBalance,
          details: tx.itemDetails || '-'
        });

        if (index % 2 !== 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }

        row.getCell('amount').numFmt = '"रु "#,##0';
        row.getCell('balance').numFmt = '"रु "#,##0';
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${customer.name}_Statement.xlsx`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("Excel download failed");
    }
    setExporting(null);
  };

  if (loading) return <div className="p-8 text-center text-slate-400 text-lg font-medium animate-pulse">Loading...</div>;
  if (!customer) return <div className="p-8 text-center text-red-500 font-bold text-lg">Customer not found</div>;

  const lastTx = transactions.length > 0 ? transactions[0] : null;
  const currentBalance = lastTx ? lastTx.remainingBalance : 0;

  return (
    <div className="space-y-5">
      {/* Back + Name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/customers" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{customer.name}</h1>
            <p className="text-sm text-slate-500 font-medium">ग्राहक विवरण • Customer Details</p>
          </div>
        </div>
        <button 
          onClick={exportExcel}
          disabled={exporting}
          className="bg-green-50 text-green-700 px-3 py-2 rounded-xl text-xs font-bold border border-green-200 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          {exporting ? '...' : <><FileSpreadsheet size={16} /> Excel</>}
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold opacity-80 mb-2">बाँकी रकम (Balance)</p>
              <p className="text-4xl font-extrabold tracking-tighter">{formatCurrency(currentBalance)}</p>
            </div>
            <div className="bg-white/15 p-3 rounded-xl backdrop-blur-md">
              <CreditCard size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-5 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Phone size={16} className="opacity-70" />
              <div>
                <p className="text-[11px] opacity-60 font-black uppercase">Phone</p>
                <p className="text-sm font-bold">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="opacity-70" />
              <div>
                <p className="text-[11px] opacity-60 font-black uppercase">Address</p>
                <p className="text-sm font-bold">{customer.address || '-'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link 
          href={`/transactions/new?customerId=${id}&type=credit`} 
          className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <PlusCircle size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">नयाँ उधार</p>
            <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Add Credit</p>
          </div>
        </Link>
        <Link 
          href={`/transactions/new?customerId=${id}&type=payment`} 
          className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">भुक्तानी</p>
            <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Payment</p>
          </div>
        </Link>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            इतिहास • History
          </h2>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
            {transactions.length} Records
          </span>
        </div>

        <div className="card-lg overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx: any) => (
                <div key={tx._id} className="px-4 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        tx.type === 'credit' ? "bg-orange-50 text-orange-500" : "bg-green-50 text-green-500"
                      )}>
                        {tx.type === 'credit' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{tx.nepaliDate}</p>
                          <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                            tx.type === 'credit' ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                          )}>
                            {tx.type === 'credit' ? 'Credit' : 'Paid'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {tx.itemDetails || 'No details'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-lg font-black tracking-tight",
                        tx.type === 'credit' ? "text-orange-500" : "text-green-500"
                      )}>
                        {tx.type === 'credit' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Bal: {formatCurrency(tx.remainingBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-slate-200" />
              </div>
              <p className="text-lg font-bold text-slate-700">कुनै कारोबार छैन</p>
              <p className="text-sm font-medium mt-1">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
