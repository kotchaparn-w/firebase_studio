import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GiftCardData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateGiftCardNumber(data: Pick<GiftCardData, 'recipientName' | 'amount' | 'occasion'>): string {
  const recipientInitials = data.recipientName?.substring(0, 2).toUpperCase() || 'XX';
  const occasionCode = data.occasion?.substring(0, 2).toUpperCase() || 'XX';
  // Generate a 4-character alphanumeric suffix for uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GC-${recipientInitials}${data.amount}${occasionCode}-${randomSuffix}`;
}
