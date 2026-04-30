"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTransaction, getCustomerTransactions } from "@/actions/transaction";
import { getCurrentNepaliDate } from "@/lib/nepaliDate";
import { Calendar, User, FileText, Banknote, CreditCard, CheckCircle2, ChevronDown, ArrowRight, Wallet, TrendingUp, Search, Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function NewTransactionForm({ customers }: { customers: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get('customerId') || (customers.length > 0 ? customers[0]._id : '');
  const initialType = searchParams.get('type') as 'credit' | 'payment' || 'credit';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [formData, setFormData] = useState({
    customerId: initialCustomerId,
    type: initialType,
    amount: '',
    itemDetails: '',
    nepaliDate: getCurrentNepaliDate(),
  });

  // Searchable picker state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedCustomer = customers.find(c => c._id === formData.customerId);

  useEffect(() => {
    if (formData.customerId) {
      getCustomerTransactions(formData.customerId).then(txs => {
        const lastTx = txs.length > 0 ? txs[0] : null;
        setCurrentBalance(lastTx ? lastTx.remainingBalance : 0);
      });
    }
  }, [formData.customerId]);

  // Close picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
    c.phone.includes(pickerSearch)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      return;
    }
    
    setLoading(true);
    await createTransaction({
      ...formData,
      amount: Number(formData.amount)
    });
    setSuccess(true);
    setLoading(false);
    
    setTimeout(() => {
      const redirectUrl = searchParams.get('customerId') 
        ? `/customers/${searchParams.get('customerId')}` 
        : '/transactions';
      router.push(redirectUrl);
    }, 1500);
  };

  const nextBalance = formData.type === 'credit' 
    ? currentBalance + (Number(formData.amount) || 0)
    : currentBalance - (Number(formData.amount) || 0);

  const quickAmounts = [500, 1000, 2000, 5000];

  if (success) {
    return (
      <div className="card-lg p-12 text-center">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">सफलतापूर्वक सेभ भयो!</h3>
        <p className="text-slate-500 font-medium">Transaction saved successfully</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'credit'})}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
            formData.type === 'credit' 
              ? "bg-orange-500 text-white shadow-md" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <CreditCard size={18} />
          उधार (Credit)
        </button>
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'payment'})}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
            formData.type === 'payment' 
              ? "bg-green-500 text-white shadow-md" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Banknote size={18} />
          भुक्तानी (Payment)
        </button>
      </div>

      {/* Balance Preview */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-500">Current Balance</span>
          </div>
          <span className="text-base font-bold text-slate-900">{formatCurrency(currentBalance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-semibold text-slate-500">New Balance</span>
          </div>
          <span className="text-2xl font-extrabold text-primary">{formatCurrency(nextBalance)}</span>
        </div>
      </div>

      {/* Searchable Customer Picker */}
      <div className="relative" ref={pickerRef}>
        <label className="label">ग्राहक छान्नुहोस् (Customer)</label>
        <button
          type="button"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          className="input-field flex items-center justify-between text-left h-[58px]"
        >
          <div className="flex items-center gap-3">
            <User className="text-slate-400" size={18} />
            {selectedCustomer ? (
              <div>
                <p className="text-[15px] font-bold text-slate-900 leading-tight">{selectedCustomer.name}</p>
                <p className="text-xs text-slate-500 font-medium">{selectedCustomer.phone}</p>
              </div>
            ) : (
              <span className="text-slate-400 font-medium">ग्राहक छान्नुहोस्...</span>
            )}
          </div>
          <ChevronDown className={cn("text-slate-400 transition-transform", isPickerOpen && "rotate-180")} size={18} />
        </button>

        {isPickerOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="खोज्नुहोस्..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:border-primary outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[250px] overflow-y-auto no-scrollbar">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, customerId: c._id });
                      setIsPickerOpen(false);
                      setPickerSearch("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left",
                      formData.customerId === c._id && "bg-blue-50"
                    )}
                  >
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{c.phone}</p>
                    </div>
                    {formData.customerId === c._id && <Check className="text-primary" size={16} />}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-bold text-slate-400">ग्राहक भेटिएन</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="label">रकम (Amount - Rs)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">रु</span>
          <input 
            type="number" 
            required
            min="1"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            className="input-field pl-14 text-3xl font-extrabold text-primary"
            placeholder="0"
          />
        </div>
      </div>

      {/* Quick Amounts */}
      {formData.type === 'payment' && (
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => setFormData({...formData, amount: amt.toString()})}
              className={cn(
                "flex-1 min-w-[70px] py-2.5 rounded-lg text-sm font-bold border-2 transition-all",
                formData.amount === amt.toString()
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
              )}
            >
              {formatCurrency(amt)}
            </button>
          ))}
        </div>
      )}

      {/* Item Details (Credit only) */}
      {formData.type === 'credit' && (
        <div>
          <label className="label">विवरण (Item Details)</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea 
              rows={3}
              value={formData.itemDetails}
              onChange={e => setFormData({...formData, itemDetails: e.target.value})}
              className="input-field pl-11"
              placeholder="चामल, तेल, दाल..."
            ></textarea>
          </div>
        </div>
      )}

      {/* Date */}
      <div>
        <label className="label">मिति (Nepali Date)</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            required
            value={formData.nepaliDate}
            onChange={e => setFormData({...formData, nepaliDate: e.target.value})}
            className="input-field pl-11 text-base"
            placeholder="२०८३/०१/१५"
          />
        </div>
      </div>

      {/* Submit */}
      <button 
        type="submit" 
        disabled={loading}
        className={cn(
          "w-full py-4 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50",
          formData.type === 'credit' 
            ? "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20" 
            : "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
        )}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : (
          <>
            <span>सेभ गर्नुहोस् (Save)</span>
            <ArrowRight size={20} />
          </>
        )}
      </button>
    </form>
  );
}
