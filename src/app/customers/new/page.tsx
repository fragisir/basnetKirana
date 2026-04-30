"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/actions/customer";
import { User, Phone, MapPin, FileText, UserPlus, ChevronLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createCustomer(formData);
    setSuccess(true);
    setLoading(false);
    
    setTimeout(() => {
      router.push("/customers");
    }, 1500);
  };

  if (success) {
    return (
      <div className="card-lg p-12 text-center mt-8">
        <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">ग्राहक थपियो!</h3>
        <p className="text-slate-500 font-medium">Customer added successfully</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customers" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">नयाँ ग्राहक</h1>
          <p className="text-sm text-slate-500 font-medium">Add New Customer</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-lg p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="label">पूरा नाम (Full Name) *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="input-field pl-11 text-base"
              placeholder="उदा. राम बहादुर"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="label">फोन नम्बर (Phone) *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="input-field pl-11 text-base"
              placeholder="९८XXXXXXXX"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="label">ठेगाना (Address) *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              required
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="input-field pl-11 text-base"
              placeholder="उदा. काठमाडौं-१५"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="label">टिप्पणी (Note - Optional)</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea 
              rows={3}
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
              className="input-field pl-11"
              placeholder="ग्राहकको बारेमा केही थप विवरण..."
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : (
            <>
              <UserPlus size={18} />
              <span>ग्राहक थप्नुहोस् (Save)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
