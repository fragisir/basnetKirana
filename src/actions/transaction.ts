"use server";

import connectToDatabase from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { Customer } from "@/models/Customer";

export async function createTransaction(data: {
  customerId: string;
  type: "credit" | "payment";
  amount: number;
  itemDetails?: string;
  nepaliDate: string;
}) {
  await connectToDatabase();
  
  // Calculate new remaining balance
  const lastTx = await Transaction.findOne({ customerId: data.customerId }).sort({ createdAt: -1 });
  const currentBalance = Number(lastTx?.remainingBalance) || 0;
  const amount = Number(data.amount) || 0;
  
  const remainingBalance = data.type === 'credit' 
    ? currentBalance + amount 
    : currentBalance - amount;

  const transaction = await Transaction.create({
    ...data,
    remainingBalance
  });

  return JSON.parse(JSON.stringify(transaction));
}

export async function getCustomerTransactions(customerId: string) {
  await connectToDatabase();
  const transactions = await Transaction.find({ customerId }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(transactions));
}

export async function getAllTransactions() {
  await connectToDatabase();
  const transactions = await Transaction.find().populate('customerId').sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(transactions));
}
