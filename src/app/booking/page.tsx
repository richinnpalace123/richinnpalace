import type { Metadata } from "next";
import BookingClient from "@/components/booking/BookingClient";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Reserve Your Stay & Bespoke Reservation | Rich Inn Palace Chennai",
  description:
    "Secure your stay at Rich Inn Palace Chennai. Experience private butler care, authentic architecture, and unhurried luxury.",
  keywords: [
    "Book Rich Inn Palace Chennai",
    "Chennai Luxury Hotel Booking",
    "Reserve Suite Chennai",
    "Boutique Hotel Reservation Tamil Nadu",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/booking`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reserve Your Stay & Bespoke Reservation | Rich Inn Palace Chennai",
    description:
      "Secure your stay at Rich Inn Palace Chennai. Experience private butler care and unhurried luxury.",
    url: `${SITE_CONFIG.domain}/booking`,
    siteName: "Rich Inn Palace Hotel",
    images: [
      {
        url: "/images/rangon_street/1.jpeg",
        width: 1200,
        height: 630,
        alt: "Reserve Your Stay at Rich Inn Palace Chennai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reserve Your Stay | Rich Inn Palace Chennai",
    description:
      "Secure your stay at Rich Inn Palace Chennai. Experience private butler care and unhurried luxury.",
    images: ["/images/rangon_street/1.jpeg"],
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
