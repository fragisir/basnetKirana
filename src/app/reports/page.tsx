import { getCustomers } from "@/actions/customer";
import { getAllTransactions } from "@/actions/transaction";
import ReportsPageClient from "@/components/ReportsPage";

export default async function ReportsPage() {
  const customers = await getCustomers();
  const transactions = await getAllTransactions();

  return <ReportsPageClient customers={customers} transactions={transactions} />;
}
