"use server";

import connectToDatabase from "@/lib/db";
import { Customer, ICustomer } from "@/models/Customer";
import { Transaction } from "@/models/Transaction";

export async function getCustomers() {
  await connectToDatabase();
  const customers = await Customer.find().sort({ updatedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(customers));
}

export async function getCustomersWithBalances() {
  await connectToDatabase();
  const customers = await Customer.find().sort({ updatedAt: -1 }).lean();
  
  const customersWithBalances = await Promise.all(
    customers.map(async (c) => {
      const lastTx = await Transaction.findOne({ customerId: c._id }).sort({ createdAt: -1 }).lean();
      return {
        ...c,
        balance: Number(lastTx?.remainingBalance) || 0,
      };
    })
  );
  
  return JSON.parse(JSON.stringify(customersWithBalances));
}

export async function getCustomer(id: string) {
  await connectToDatabase();
  const customer = await Customer.findById(id).lean();
  return JSON.parse(JSON.stringify(customer));
}

export async function createCustomer(data: { name: string; phone: string; address: string; note?: string }) {
  await connectToDatabase();
  const customer = await Customer.create(data);
  return JSON.parse(JSON.stringify(customer));
}

export async function updateCustomer(id: string, data: Partial<{ name: string; phone: string; address: string; note: string }>) {
  await connectToDatabase();
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true }).lean();
  return JSON.parse(JSON.stringify(customer));
}

export async function getDashboardStats() {
  await connectToDatabase();
  const totalCustomers = await Customer.countDocuments();
  
  const transactions = await Transaction.find().lean();
  let totalPending = 0;
  
  // Actually, computing total pending is better done by fetching latest remaining balance per customer,
  // or summarizing from transactions if we track it properly, but easiest is to sum the latest transaction remaining balance for each customer.
  const customers = await Customer.find().lean();
  for (let c of customers) {
    const lastTx = await Transaction.findOne({ customerId: c._id }).sort({ createdAt: -1 }).lean();
    if (lastTx && !isNaN(Number(lastTx.remainingBalance))) {
      totalPending += Number(lastTx.remainingBalance);
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => {
    try {
      return t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] === todayStr : false;
    } catch { return false; }
  });
  const todayCollection = todayTransactions.filter(t => t.type === 'payment').reduce((acc, t) => acc + t.amount, 0);

  const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5).populate('customerId').lean();

  return {
    totalPending,
    todayCollection,
    totalCustomers,
    recentTransactions: JSON.parse(JSON.stringify(recentTransactions))
  };
}
