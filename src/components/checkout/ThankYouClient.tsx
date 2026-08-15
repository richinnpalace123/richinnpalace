"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  MessageSquare,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { WhatsAppReservationData, buildWhatsAppUrl } from "@/lib/whatsapp";
import { branches, EXTRA_BED_RATE } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref") || "RIP-84920";
  const branchId = searchParams.get("branch") || branches[0].id;
  const estimatedTotal = searchParams.get("total") || "₹3,776";
  const guestNameParam = searchParams.get("guest") || "Guest";

  const [reservationData, setReservationData] = useState<WhatsAppReservationData | null>(null);

  const branch = useMemo(() => {
    return branches.find((b) => b.id === branchId || b.slug === branchId) || branches[0];
  }, [branchId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("rip_reservation_payload");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setReservationData(parsed);
        } catch (e) {
          console.error("Failed to parse stored reservation payload", e);
        }
      }
    }
  }, []);

  const whatsappUrl = useMemo(() => {
    if (reservationData) {
      return buildWhatsAppUrl(reservationData);
    }
    return buildWhatsAppUrl({
      guestName: guestNameParam,
      roomName: "Executive Stay",
      propertyName: branch.name,
      occupancyType: "Direct Stay Request",
      extraBeds: 0,
      checkIn: "Tomorrow",
      checkOut: "Day after",
      duration: "1 night",
      guests: 2,
      specialRequests: "",
      estimatedTotal: estimatedTotal,
      branchPhone: branch.phone,
    });
  }, [reservationData, guestNameParam, branch, estimatedTotal]);

  const displayGuestName = reservationData?.guestName || guestNameParam;

  return (
    <div className="bg-bg-dark min-h-screen pt-24 md:pt-32 pb-24 font-sans text-text-offwhite">
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-[0_0_25px_rgba(199,168,109,0.2)]"
          >
            <Check size={28} className="stroke-[2.5]" />
          </motion.div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium block">
            RESERVATION REQUEST LOGGED
          </span>

          <h1 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-tight">
            Thank You, {displayGuestName.split(" ")[0]}!
          </h1>

          <p className="text-xs md:text-sm text-text-gray font-light leading-relaxed">
            Your stay reservation request has been received by our desk concierge. Our team will review availability and contact you shortly to confirm your booking.
          </p>
        </div>

        {/* Reservation Voucher Summary Card */}
        <div className="relative bg-surface-dark border border-border-dark/80 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-left space-y-6">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Card Top Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark/40 pb-5">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-medium block">
                RICH INN PALACE · CHENNAI
              </span>
              <h2 className="font-serif text-xl text-text-offwhite font-light tracking-wide mt-0.5">
                Stay Request Voucher
              </h2>
            </div>

            <div className="px-4 py-2 bg-bg-dark/80 border border-border-dark/60 rounded-xl text-right">
              <span className="text-[8px] uppercase tracking-[0.2em] text-text-gray/60 block font-sans">
                Request Ref
              </span>
              <span className="font-mono text-sm text-gold font-semibold tracking-wider">
                {bookingRef}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs font-sans border-b border-border-dark/40 pb-6">
            <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0">
              <span className="text-text-gray/70">Guest Name</span>
              <span className="text-text-offwhite font-medium">{displayGuestName}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0">
              <span className="text-text-gray/70">Property Location</span>
              <span className="text-text-offwhite font-medium font-serif">{branch.title}</span>
            </div>

            {reservationData?.guestPhone && (
              <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0">
                <span className="text-text-gray/70">Contact Phone</span>
                <span className="text-text-offwhite font-medium">{reservationData.guestPhone}</span>
              </div>
            )}

            {reservationData?.checkIn && (
              <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0">
                <span className="text-text-gray/70">Dates</span>
                <span className="font-mono text-text-offwhite font-medium">
                  {reservationData.checkIn} &rarr; {reservationData.checkOut}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0 sm:col-span-2">
              <span className="text-text-gray/70">Selected Chambers</span>
              <span className="text-text-offwhite font-medium text-right ml-4">
                {reservationData?.roomName || "Executive Stay"}
              </span>
            </div>

            {reservationData?.extraBeds && reservationData.extraBeds > 0 ? (
              <div className="flex justify-between py-1.5 border-b border-border-dark/30 sm:border-b-0 sm:col-span-2">
                <span className="text-text-gray/70">Extra Bed Option</span>
                <span className="text-gold font-medium">
                  {reservationData.extraBeds} Extra Bed (+₹{reservationData.extraBeds * EXTRA_BED_RATE}/night)
                </span>
              </div>
            ) : null}
          </div>

          {/* Complimentary Inclusions */}
          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 text-xs font-sans">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block mb-2">
              Complimentary Inclusions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-gray text-[11px]">
              <span className="flex items-center text-text-offwhite">✓ South Indian Buffet Breakfast</span>
              <span className="flex items-center text-text-offwhite">✓ High-Speed Wi-Fi</span>
              <span className="flex items-center text-text-offwhite">✓ 24/7 Room Service</span>
              <span className="flex items-center text-text-offwhite">✓ In-Room Mini Bar Setup</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-xs uppercase tracking-[0.15em] text-text-offwhite font-semibold">
              Estimated Total (incl. 18% GST)
            </span>
            <span className="font-serif text-3xl text-gold font-light">
              {reservationData?.estimatedTotal || estimatedTotal}
            </span>
          </div>

          {/* Instant WhatsApp Priority Button */}
          <div className="pt-4 space-y-3 border-t border-border-dark/40">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("booking_confirmation", branch.id)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer transform hover:scale-[1.01]"
            >
              <MessageSquare size={16} className="stroke-[2]" />
              <span>INSTANT WHATSAPP ENQUIRY</span>
              <ArrowRight size={14} />
            </a>

            <p className="text-[10px] text-text-gray/60 text-center font-light">
              Connects directly with desk concierge (+91 81899 99227) with your reservation details pre-filled.
            </p>
          </div>
        </div>

        {/* Secondary Link */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-surface-dark border border-border-dark/80 hover:border-gold text-gold text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-colors"
          >
            <span>Explore Other Properties</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
