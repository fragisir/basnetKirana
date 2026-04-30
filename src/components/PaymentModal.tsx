"use client";

import { useState, useEffect } from "react";
import { X, Banknote, CheckCircle2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { createTransaction } from "@/actions/transaction";
import { getCurrentNepaliDate } from "@/lib/nepaliDate";

interface PaymentModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ customer, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [payAmount, setPayAmount] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPayAmount("");
      setPaySuccess(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0 || !customer) return;
    setPayLoading(true);
    await createTransaction({
      customerId: customer._id,
      type: "payment",
      amount: Number(payAmount),
      nepaliDate: getCurrentNepaliDate(),
    });
    setPayLoading(false);
    setPaySuccess(true);
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
        onClick={() => !payLoading && onClose()} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-10 duration-300">
        {/* Header */}
        <div className="bg-green-600 px-6 py-6 text-white relative">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">भुक्तानी गर्नुहोस्</p>
              <h3 className="text-xl font-extrabold mt-1 tracking-tight">{customer?.name}</h3>
            </div>
            <button 
              onClick={() => !payLoading && onClose()} 
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-5 bg-white/15 rounded-2xl px-5 py-4 backdrop-blur-md border border-white/10 relative z-10">
            <p className="text-[11px] font-bold opacity-75 uppercase tracking-widest">बाँकी रकम (Current Balance)</p>
            <p className="text-3xl font-extrabold mt-0.5 tracking-tighter">
              {formatCurrency(customer?.balance || 0)}
            </p>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </div>

        {paySuccess ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">भुक्तानी सफल!</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Payment saved successfully</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Amount Input */}
            <div>
              <label className="label text-slate-500">रकम (Amount)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">रु</span>
                <input 
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={customer?.balance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-12 pr-4 text-3xl font-extrabold text-green-600 focus:border-green-500 focus:bg-white outline-none transition-all tracking-tighter"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.filter(a => a <= (customer?.balance || 999999)).map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPayAmount(amt.toString())}
                  className={cn(
                    "flex-1 min-w-[80px] py-3 rounded-xl text-sm font-bold border-2 transition-all",
                    payAmount === amt.toString()
                      ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20"
                      : "bg-white text-slate-600 border-slate-100 hover:border-green-400"
                  )}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
              {/* Full amount button */}
              {customer?.balance > 0 && (
                <button
                  type="button"
                  onClick={() => setPayAmount(customer.balance.toString())}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold border-2 transition-all",
                    payAmount === customer.balance.toString()
                      ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20"
                      : "bg-green-50 text-green-700 border-green-200 hover:border-green-400"
                  )}
                >
                  पूरा रकम तिर्नुहोस् • Full Pay: {formatCurrency(customer.balance)}
                </button>
              )}
            </div>

            {/* New Balance Preview */}
            {payAmount && Number(payAmount) > 0 && (
              <div className="bg-slate-50 rounded-2xl px-5 py-4 flex justify-between items-center border border-slate-100">
                <span className="text-sm font-bold text-slate-500">नयाँ बाँकी (New Balance)</span>
                <span className="text-lg font-extrabold text-primary tracking-tight">
                  {formatCurrency((customer?.balance || 0) - Number(payAmount))}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={!payAmount || Number(payAmount) <= 0 || payLoading}
              className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 shadow-xl shadow-green-600/20"
            >
              {payLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Banknote size={24} />
                  <span>भुक्तानी सुरक्षित गर्नुहोस्</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
