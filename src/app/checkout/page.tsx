import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout & Reserve Stay | Rich Inn Palace Chennai",
  description: "Complete your sanctuary reservation details for Rich Inn Palace Chennai.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-dark min-h-screen pt-32 pb-24 text-center text-text-gray font-sans">
          <p className="text-xs uppercase tracking-[0.2em] text-gold animate-pulse">
            Loading Checkout...
          </p>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
