import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  type: "credit" | "payment";
  amount: number;
  remainingBalance: number;
  itemDetails?: string;
  nepaliDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["credit", "payment"], required: true },
    amount: { type: Number, required: true },
    remainingBalance: { type: Number, required: true },
    itemDetails: { type: String },
    nepaliDate: { type: String, required: true },
  },
  { timestamps: true }
);

// To avoid recompiling model in dev mode
export const Transaction = (mongoose.models?.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>("Transaction", TransactionSchema);
