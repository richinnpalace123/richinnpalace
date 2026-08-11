import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function sanitizePhoneInput(input: string): string {
  const sanitized = input.replace(/[^0-9+\-\s()]/g, "");
  if (sanitized.startsWith("+91")) {
    return sanitized.slice(0, 15);
  }
  if (sanitized.startsWith("91") && !sanitized.startsWith("+")) {
    return sanitized.slice(0, 14);
  }
  const digitsOnly = sanitized.replace(/[^0-9]/g, "");
  if (digitsOnly.length > 10 && !sanitized.startsWith("+")) {
    return digitsOnly.slice(0, 10);
  }
  return sanitized;
}

export function validateIndianPhoneNumber(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Please enter your contact phone number.";

  let digits = trimmed.replace(/[^0-9]/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.length < 10) {
    return "Phone number must be exactly 10 digits (e.g. 98847 62222).";
  }
  if (digits.length > 10) {
    return "Phone number cannot exceed 10 digits (e.g. 98847 62222).";
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
  }

  return null;
}
