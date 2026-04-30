import { Suspense } from "react";
import { getCustomers } from "@/actions/customer";
import NewTransactionForm from "@/components/NewTransactionForm";

export default async function NewTransactionPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
          नयाँ कारोबार
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 font-bold">नयाँ हिसाब थप्नुहोस् (New Transaction)</p>
      </header>

      <Suspense fallback={<div className="p-12 text-center text-slate-500 animate-pulse">Loading form...</div>}>
        <NewTransactionForm customers={customers} />
      </Suspense>
    </div>
  );
}
