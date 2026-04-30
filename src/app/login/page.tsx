"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { Lock, Store, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await login(pin);
    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "PIN Code गलत छ!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-5">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-primary/25">
            <Store size={32} />
          </div>
          
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Pasal Udhaar</h1>
          <p className="text-sm text-slate-500 font-medium mb-8">Enter your 4-digit PIN to login</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* PIN Input */}
            <div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                pattern="\d*"
                inputMode="numeric"
                autoFocus
                className="w-full text-center text-5xl tracking-[0.6em] font-extrabold text-slate-900 border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-100 rounded-xl py-5 transition-all outline-none placeholder:text-slate-200"
                placeholder="••••"
              />
            </div>
            
            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-red-100">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-30 disabled:shadow-none active:scale-[0.98] text-lg"
            >
              प्रवेश गर्नुहोस् (Login)
            </button>
          </form>
          
          <p className="mt-8 text-xs text-slate-400 font-medium">
            Basnet Khadnya Bikri Sasta
          </p>
        </div>
      </div>
    </div>
  );
}
