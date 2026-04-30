"use client";

import { useEffect, useState } from "react";
import { getCustomersWithBalances } from "@/actions/customer";
import Link from "next/link";
import { UserPlus, Search, Phone, Banknote, CreditCard, PlusCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentModal } from "@/components/PaymentModal";
import { CreditModal } from "@/components/CreditModal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState<any>(null);
  const [selectedCustomerForCredit, setSelectedCustomerForCredit] = useState<any>(null);

  const loadCustomers = () => {
    getCustomersWithBalances().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ग्राहक सूची</h1>
          <p className="text-base text-slate-500 font-medium">Customers List</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="ग्राहक खोज्नुहोस्... (Search by name or phone)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12 text-base"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-slate-50" />
          ))
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="relative">
              <Link href={`/customers/${customer._id}`} className="block">
                <div className="card px-4 py-4 flex justify-between items-center hover:shadow-md transition-shadow active:scale-[0.99]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary text-lg font-extrabold shadow-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-900">{customer.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone size={13} className="text-slate-400" />
                        <span className="text-sm text-slate-500 font-medium">{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-right mr-1 sm:mr-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Balance</p>
                      <p className={cn(
                        "text-lg font-extrabold tracking-tight",
                        (customer.balance || 0) > 0 ? "text-orange-500" : "text-green-500"
                      )}>
                        {formatCurrency(customer.balance)}
                      </p>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCustomerForCredit(customer);
                        }}
                        className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all active:scale-95"
                      >
                        उधार
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCustomerForPayment(customer);
                        }}
                        className="bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-sm active:scale-95"
                      >
                        भुक्तानी
                      </button>
                    </div>

                    {/* Mobile Buttons Overlay */}
                    <div className="sm:hidden flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCustomerForCredit(customer);
                        }}
                        className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center active:scale-90"
                      >
                        <PlusCircle size={22} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCustomerForPayment(customer);
                        }}
                        className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-90"
                      >
                        <Banknote size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="card p-10 text-center">
            <p className="text-lg font-bold text-slate-700 mb-1">कुनै ग्राहक भेटिएन</p>
            <p className="text-sm text-slate-400 font-medium mb-4">No customers found</p>
            <Link 
              href="/customers/new"
              className="inline-flex btn-primary text-sm"
            >
              + नयाँ ग्राहक थप्नुहोस्
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      <PaymentModal
        customer={selectedCustomerForPayment}
        isOpen={!!selectedCustomerForPayment}
        onClose={() => setSelectedCustomerForPayment(null)}
        onSuccess={loadCustomers}
      />

      <CreditModal
        customer={selectedCustomerForCredit}
        isOpen={!!selectedCustomerForCredit}
        onClose={() => setSelectedCustomerForCredit(null)}
        onSuccess={loadCustomers}
      />
    </div>
  );
}
