"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, CheckCircle2, FileText } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { createTransaction } from "@/actions/transaction";
import { getCurrentNepaliDate } from "@/lib/nepaliDate";

interface CreditModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreditModal({ customer, isOpen, onClose, onSuccess }: CreditModalProps) {
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDetails("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0 || !customer) return;
    setLoading(true);
    await createTransaction({
      customerId: customer._id,
      type: "credit",
      amount: Number(amount),
      itemDetails: details,
      nepaliDate: getCurrentNepaliDate(),
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1200);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-5 pt-10 sm:items-center sm:pt-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => !loading && onClose()} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-10 duration-300">
        {/* Header */}
        <div className="bg-orange-600 px-6 py-6 text-white relative">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">उधार थप्नुहोस्</p>
              <h3 className="text-xl font-extrabold mt-1 tracking-tight">{customer?.name}</h3>
            </div>
            <button 
              onClick={() => !loading && onClose()} 
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-5 bg-white/15 rounded-2xl px-5 py-4 backdrop-blur-md border border-white/10 relative z-10">
            <p className="text-[11px] font-bold opacity-75 uppercase tracking-widest">हालको बाँकी (Current Balance)</p>
            <p className="text-3xl font-extrabold mt-0.5 tracking-tighter">
              {formatCurrency(customer?.balance || 0)}
            </p>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </div>

        {success ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">उधार थपियो!</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Credit added successfully</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Amount Input */}
            <div>
              <label className="label text-slate-500">उधार रकम (Credit Amount)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">रु</span>
                <input 
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-12 pr-4 text-3xl font-extrabold text-orange-600 focus:border-orange-500 focus:bg-white outline-none transition-all tracking-tighter"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "flex-1 min-w-[80px] py-3 rounded-xl text-sm font-bold border-2 transition-all",
                    amount === amt.toString()
                      ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                      : "bg-white text-slate-600 border-slate-100 hover:border-orange-400"
                  )}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>

            {/* Details Input */}
            <div>
              <label className="label text-slate-500">विवरण (Details)</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea 
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-orange-500 focus:bg-white outline-none transition-all"
                  placeholder="उदा. चामल, दाल, तेल..."
                ></textarea>
              </div>
            </div>

            {/* New Balance Preview */}
            {amount && Number(amount) > 0 && (
              <div className="bg-slate-50 rounded-2xl px-5 py-4 flex justify-between items-center border border-slate-100">
                <span className="text-sm font-bold text-slate-500">नयाँ बाँकी (New Balance)</span>
                <span className="text-lg font-extrabold text-primary tracking-tight">
                  {formatCurrency((customer?.balance || 0) + Number(amount))}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!amount || Number(amount) <= 0 || loading}
              className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 shadow-xl shadow-orange-600/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <CreditCard size={24} />
                  <span>उधार सुरक्षित गर्नुहोस्</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
