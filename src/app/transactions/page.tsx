"use client";

import { useEffect, useState } from "react";
import { getAllTransactions } from "@/actions/transaction";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";
import { Search, Calendar, ChevronRight, ArrowUpRight, ArrowDownLeft, History, UserPlus } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllTransactions().then(txs => {
      setTransactions(txs);
      setLoading(false);
    });
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    tx.customerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.itemDetails?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-400 text-lg font-medium animate-pulse">कारोबार लोड हुँदैछ...</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">सबै कारोबार</h1>
        <p className="text-base text-slate-500 font-medium">Transaction History</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="ग्राहक वा सामान खोज्नुहोस्... (Search)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12 text-base"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <Link key={tx._id} href={`/customers/${tx.customerId?._id}`} className="block">
              <div className="card px-4 py-4 hover:shadow-md transition-shadow active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-white",
                      tx.type === 'credit' ? "bg-orange-500" : "bg-green-500"
                    )}>
                      {tx.type === 'credit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900">
                        {tx.customerId?.name || 'Unknown'}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">{tx.nepaliDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className={cn(
                        "text-lg font-extrabold",
                        tx.type === 'credit' ? "text-orange-500" : "text-green-500"
                      )}>
                        {tx.type === 'credit' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        {tx.type === 'credit' ? 'उधार' : 'भुक्तानी'}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                </div>
                
                {tx.itemDetails && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
                      📝 {tx.itemDetails}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="card p-12 text-center">
            <History size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-bold text-slate-700">कुनै कारोबार भेटिएन</p>
            <p className="text-sm text-slate-400 font-medium mt-1">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
