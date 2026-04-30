import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

// To avoid recompiling model in dev mode
export const Customer = (mongoose.models?.Customer as Model<ICustomer>) || mongoose.model<ICustomer>("Customer", CustomerSchema);
