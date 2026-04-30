import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number | undefined | null): string => {
  const num = Number(amount);
  if (isNaN(num) || amount === null || amount === undefined) {
    return "रु 0";
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(num));
  return `रु ${formatted}`;
};
