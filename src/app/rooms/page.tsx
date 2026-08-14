import type { Metadata } from "next";
import { Suspense } from "react";
import RoomsClient from "@/components/rooms/RoomsClient";
import { SITE_CONFIG } from "@/lib/config";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Chennai Room Varieties & Tariffs | Rich Inn Palace Chennai",
  description:
    "Explore room varieties and tariffs across our 3 branches in T. Nagar (Rangan St & Pondy Bazaar) and Vadapalani (Saligramam). South Indian buffet breakfast and 24/7 room service included.",
  keywords: [
    "Chennai Hotel Tariffs",
    "Rich Inn Palace Rooms",
    "T. Nagar Executive Room Tariff",
    "Vadapalani Hotel Rooms",
    "Pondy Bazaar Hotel Chennai",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/rooms`,
  },
  openGraph: {
    title: "Room Varieties & Tariffs | Rich Inn Palace Chennai",
    description:
      "Explore Executive and Suite tariffs across 3 prime Chennai branches.",
    url: `${SITE_CONFIG.domain}/rooms`,
    siteName: "Rich Inn Palace Hotel",
    images: [
      {
        url: "/images/rangon_street/1.jpeg",
        width: 1200,
        height: 630,
        alt: "Rich Inn Palace Chennai Room Tariffs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-dark min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      }
    >
      <RoomsClient />
    </Suspense>
  );
}
