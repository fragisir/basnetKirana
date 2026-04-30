"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, PlusCircle, ArrowRight, Users, FileText, Store, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/actions/customer";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(err => {
        console.error(err);
        setError("डेटाबेस जडानमा त्रुटि (Database Connection Error)");
      });
  }, []);

  if (error) return (
    <div className="p-10 text-center space-y-4">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
        <Store size={32} />
      </div>
      <p className="text-xl font-bold text-slate-800">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary px-6"
      >
        Try Again
      </button>
    </div>
  );

  if (!stats) return (
    <div className="p-8 text-center text-slate-400 text-lg font-medium animate-pulse">
      Loading Dashboard...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">ड्यासबोर्ड</h1>
        <p className="text-base text-slate-500 font-medium mt-0.5">आजको हिसाब • Today's Overview</p>
      </div>

      {/* Hero Card */}
      <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Store size={18} />
            <span className="text-sm font-semibold opacity-90">Basnet Khadnya Bikri Sasta</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold opacity-75 mb-1">कुल बाँकी (Total Pending)</p>
              <p className="text-3xl font-extrabold">{formatCurrency(stats.totalPending)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-75 mb-1">आजको संकलन (Today's Collection)</p>
              <p className="text-3xl font-extrabold">{formatCurrency(stats.todayCollection)}</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">बाँकी रकम</p>
              <p className="text-xl font-extrabold text-orange-600">{formatCurrency(stats.totalPending)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">आजको भुक्तानी</p>
              <p className="text-xl font-extrabold text-green-600">{formatCurrency(stats.todayCollection)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">द्रुत कार्य • Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/transactions/new?type=credit" className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <PlusCircle size={28} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-900">नयाँ उधार</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">New Credit</p>
            </div>
          </Link>

          <Link href="/transactions/new?type=payment" className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]">
            <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <ArrowDownRight size={28} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-900">भुक्तानी</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Payment</p>
            </div>
          </Link>

          <Link href="/customers" className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Users size={28} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-900">ग्राहक सूची</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Customers</p>
            </div>
          </Link>

          <Link href="/reports" className="card p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.98]">
            <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/25">
              <FileText size={28} />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-900">रिपोर्ट</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-slate-900">हालको कारोबार • Recent</h2>
          <Link href="/transactions" className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
            सबै हेर्नुहोस् <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="card-lg overflow-hidden">
          {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentTransactions.map((tx: any) => (
                <div key={tx._id} className="px-4 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      tx.type === 'credit' 
                        ? "bg-orange-50 text-orange-500" 
                        : "bg-green-50 text-green-500"
                    )}>
                      {tx.type === 'credit' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900">{tx.customerId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400 font-medium">{tx.nepaliDate} • {tx.itemDetails || '-'}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "text-base font-extrabold",
                    tx.type === 'credit' ? "text-orange-500" : "text-green-500"
                  )}>
                    {tx.type === 'credit' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400">
              <FileText size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-base">कुनै कारोबार छैन</p>
              <p className="text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
