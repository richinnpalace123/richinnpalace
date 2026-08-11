"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { WhatsAppReservationData, buildWhatsAppUrl } from "@/lib/whatsapp";
import { Room } from "@/lib/data";

import { trackWhatsAppClick } from "@/lib/analytics";

interface ReservationConfirmationViewProps {
  reservationData: WhatsAppReservationData;
  bookingReference: string;
  selectedRoom: Room | undefined;
  basePriceFormatted: string;
  taxFormatted: string;
  onNewRequest?: () => void;
}

export default function ReservationConfirmationView({
  reservationData,
  bookingReference,
  selectedRoom,
  basePriceFormatted,
  taxFormatted,
}: ReservationConfirmationViewProps) {
  const whatsappUrl = buildWhatsAppUrl(reservationData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto py-4 space-y-8 text-center font-sans"
    >
      {/* Editorial Header */}
      <div className="space-y-3 max-w-xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-14 h-14 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-[0_0_20px_rgba(199,168,109,0.15)]"
        >
          <Check size={24} className="stroke-[2]" />
        </motion.div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium block">
          SANCTUARY INVITATION LOGGED
        </span>

        <h1 className="font-serif text-3xl md:text-4xl text-text-offwhite font-light tracking-wide leading-tight">
          Request Received
        </h1>

        <p className="text-xs text-text-gray font-light leading-relaxed">
          Thank you, <span className="text-text-offwhite font-medium">{reservationData.guestName}</span>. Our reservation desk has received your stay enquiry and will reach out shortly to confirm availability.
        </p>
      </div>

      {/* Main Luxury Pass Voucher Card */}
      <div className="relative bg-surface-dark border border-border-dark/80 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden text-left space-y-8">
        {/* Subtle Top Gold Foil Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Voucher Top Row: Hotel Name & Ref Code */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark/50 pb-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-medium block">
              RICH INN PALACE · CHENNAI
            </span>
            <h2 className="font-serif text-xl text-text-offwhite font-light tracking-wide">
              Reservation Summary
            </h2>
          </div>
          <div className="px-4 py-2 bg-bg-dark/60 border border-border-dark/60 rounded-xl text-right">
            <span className="text-[8px] uppercase tracking-[0.2em] text-text-gray/60 block font-sans">
              Request Ref
            </span>
            <span className="font-mono text-xs text-gold font-semibold tracking-wider">
              {bookingReference}
            </span>
          </div>
        </div>

        {/* Room Snapshot Header */}
        {selectedRoom && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-bg-dark/40 border border-border-dark/40">
            <div className="relative w-full sm:w-28 h-28 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-bg-dark">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
                  {selectedRoom.tag}
                </span>
                <span className="text-[10px] text-text-gray/70 font-sans font-light">
                  {selectedRoom.size}
                </span>
              </div>
              <h3 className="font-serif text-xl text-text-offwhite font-light">
                {reservationData.roomName || selectedRoom.name}
              </h3>
              {reservationData.propertyName && (
                <p className="text-[11px] text-gold/90 font-sans font-medium tracking-wide">
                  {reservationData.propertyName}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Key Reservation Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans border-b border-border-dark/50 pb-6">
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Guest Name</span>
            <span className="text-text-offwhite font-medium">{reservationData.guestName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Contact Phone</span>
            <span className="text-text-offwhite font-medium">{reservationData.guestPhone}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Check-in</span>
            <span className="text-text-offwhite font-medium">{reservationData.checkIn}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Check-out</span>
            <span className="text-text-offwhite font-medium">{reservationData.checkOut}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Occupancy Type</span>
            <span className="text-text-offwhite font-medium">{reservationData.occupancyType || "Standard"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0">
            <span className="text-text-gray/70">Party Size</span>
            <span className="text-text-offwhite font-medium">{reservationData.guests} Guest(s)</span>
          </div>
          {reservationData.extraBeds && reservationData.extraBeds > 0 ? (
            <div className="flex justify-between py-2 border-b border-border-dark/30 sm:border-b-0 sm:col-span-2">
              <span className="text-text-gray/70">Extra Bed Option</span>
              <span className="text-gold font-medium">{reservationData.extraBeds} Extra Bed (+₹{reservationData.extraBeds * 700}/night)</span>
            </div>
          ) : null}
        </div>

        {/* Complimentary Inclusions Box */}
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-xs font-sans">
          <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block mb-2">
            Included with Your Reservation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-gray text-[11px]">
            <span className="flex items-center text-text-offwhite">✓ Complimentary South Indian Buffet Breakfast</span>
            <span className="flex items-center text-text-offwhite">✓ High-Speed Wi-Fi</span>
            <span className="flex items-center text-text-offwhite">✓ 24/7 Dedicated Room Service</span>
            <span className="flex items-center text-text-offwhite">✓ In-Room Mini Bar Setup</span>
          </div>
        </div>

        {/* Special Requests if any */}
        {reservationData.specialRequests && reservationData.specialRequests !== "None" && (
          <div className="text-xs space-y-1.5 border-b border-border-dark/50 pb-6">
            <span className="text-[9px] uppercase tracking-[0.2em] text-text-gray/60 font-medium block">
              Special Requests
            </span>
            <p className="text-text-gray font-light italic leading-relaxed">
              &ldquo;{reservationData.specialRequests}&rdquo;
            </p>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="space-y-2.5 font-sans text-xs">
          <div className="flex justify-between text-text-gray/80 font-light">
            <span>Base Sanctuary Rate</span>
            <span className="text-text-offwhite">{basePriceFormatted}</span>
          </div>
          <div className="flex justify-between text-text-gray/80 font-light">
            <span>Luxury GST (18%)</span>
            <span className="text-text-offwhite">{taxFormatted}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-border-dark/50">
            <span className="text-xs uppercase tracking-[0.15em] text-text-offwhite font-semibold">
              Estimated Total
            </span>
            <span className="font-serif text-2xl text-gold font-light">
              {reservationData.estimatedTotal}
            </span>
          </div>
        </div>

        {/* Primary Action: Direct WhatsApp Priority Button */}
        <div className="pt-2 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("booking_confirmation", selectedRoom?.id)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer transform hover:scale-[1.01]"
          >
            <MessageSquare size={16} className="stroke-[2]" />
            <span>CONTINUE ON WHATSAPP FOR INSTANT CONFIRMATION</span>
            <ArrowRight size={14} />
          </a>

          <p className="text-[10px] text-text-gray/60 text-center font-light">
            Connects with your details pre-filled to our Chennai concierge desk (+91 98847 62222).
          </p>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/rooms"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-surface-dark border border-border-dark/60 hover:border-gold/40 text-gold text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-all duration-300 cursor-pointer"
        >
          <span>Explore Other Stays</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}
