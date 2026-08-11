import { Suspense } from "react";
import type { Metadata } from "next";
import ThankYouClient from "@/components/checkout/ThankYouClient";

export const metadata: Metadata = {
  title: "Reservation Received | Rich Inn Palace Chennai",
  description: "Thank you for requesting your stay at Rich Inn Palace Chennai. Our team will contact you shortly.",
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-dark min-h-screen pt-32 pb-24 text-center text-text-gray font-sans">
          <p className="text-xs uppercase tracking-[0.2em] text-gold animate-pulse">
            Loading Confirmation...
          </p>
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
