"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Loader2,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Branch, RoomVariety, EXTRA_BED_RATE } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { sendReservationEmail } from "@/lib/emailjs";
import { WhatsAppReservationData, buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackReservationSubmitted, trackReservationFailed, trackWhatsAppClick } from "@/lib/analytics";

interface SelectedRoomItem {
  room: RoomVariety;
  count: number;
  total: number;
}

interface GuestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
  selectedRoomsSummaryList: SelectedRoomItem[];
  totalSelectedRoomsCount: number;
  extraBeds: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  grandTotal: number;
  baseTotal: number;
  luxuryTax: number;
  perNightTotalRate: number;
}

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "RIP-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function GuestBookingModal({
  isOpen,
  onClose,
  branch,
  selectedRoomsSummaryList,
  totalSelectedRoomsCount,
  extraBeds,
  checkIn,
  checkOut,
  nights,
  grandTotal,
  baseTotal,
  luxuryTax,
  perNightTotalRate,
}: GuestBookingModalProps) {
  // Contact details form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");

  // Validation error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [submittedData, setSubmittedData] = useState<WhatsAppReservationData | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const sanitized = val.replace(/[^0-9+\-\s()]/g, "");
    setPhone(sanitized);
    if (val !== sanitized) {
      setPhoneError("Phone number can only contain digits and phone symbols.");
    } else if (sanitized.replace(/[^0-9]/g, "").length >= 6) {
      setPhoneError("");
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (e.target.value.trim().length >= 2) setFullNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e.target.value.trim())) setEmailError("");
  };

  const validateForm = () => {
    let nameErr = "";
    let mailErr = "";
    let phErr = "";

    if (!fullName.trim()) nameErr = "Please enter your full name.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      mailErr = "Please enter a valid email address.";
    }

    const phoneDigitsOnly = phone.replace(/[^0-9]/g, "");
    if (!phone.trim()) phErr = "Please enter your contact phone number.";
    else if (phoneDigitsOnly.length < 6) {
      phErr = "Please enter a valid phone number (at least 6 digits).";
    }

    setFullNameError(nameErr);
    setEmailError(mailErr);
    setPhoneError(phErr);

    if (nameErr || mailErr || phErr) {
      return "Please complete all required contact fields before confirming.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage("");
    const err = validateForm();
    if (err) {
      setErrorMessage(err);
      return;
    }

    setIsSubmitting(true);

    const generatedRef = generateRefCode();
    const durationLabel = `${nights} night${nights > 1 ? "s" : ""}`;
    const propertyLabel = branch.name;
    const roomLabel = selectedRoomsSummaryList
      .map((item) => `${item.count}x ${item.room.name}`)
      .join(", ");
    const occupancyLabel = `${totalSelectedRoomsCount} Chamber(s) Selected`;
    const totalDisplay = formatPrice(grandTotal);

    const reservationPayload: WhatsAppReservationData = {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      roomName: roomLabel || "Executive Suite",
      roomTag: `${totalSelectedRoomsCount} Chambers`,
      propertyName: propertyLabel,
      occupancyType: occupancyLabel,
      extraBeds: extraBeds,
      checkIn: checkIn,
      checkOut: checkOut,
      duration: durationLabel,
      guests: totalSelectedRoomsCount * 2,
      specialRequests: requests.trim(),
      estimatedTotal: totalDisplay,
      branchPhone: branch.phone,
    };

    try {
      await sendReservationEmail({
        guest_name: fullName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        property_name: propertyLabel,
        room_name: roomLabel || "Executive Suite",
        occupancy_type: occupancyLabel,
        extra_bed: extraBeds > 0 ? `${extraBeds} Extra Bed(s) (${formatPrice(extraBeds * EXTRA_BED_RATE)}/night)` : "None",
        check_in: checkIn,
        check_out: checkOut,
        duration: durationLabel,
        guests: totalSelectedRoomsCount * 2,
        special_requests: requests.trim() || "None",
        base_rate: `${formatPrice(perNightTotalRate)} x ${nights} (${formatPrice(baseTotal)})`,
        gst: formatPrice(luxuryTax),
        estimated_total: totalDisplay,
        subject: `New Stay Reservation Request — ${branch.title}`,
      });

      setBookingReference(generatedRef);
      setSubmittedData(reservationPayload);
      setIsSubmitted(true);
      trackReservationSubmitted({
        roomId: branch.id,
        roomName: roomLabel,
        nights: nights,
        guestCount: totalSelectedRoomsCount * 2,
        estimatedTotal: grandTotal,
        branchName: branch.name,
      });
    } catch (error) {
      console.error("Failed to send reservation email:", error);
      trackReservationFailed(branch.id, "emailjs_dispatch_error");
      setErrorMessage(
        "Unable to send your request via email right now. You can connect directly with our desk on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setRequests("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-bg-dark/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-surface-dark border border-border-dark/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden my-8"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={resetAndClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-bg-dark/60 border border-border-dark hover:border-gold text-text-gray hover:text-gold flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <X size={16} />
          </button>

          {!isSubmitted ? (
            /* FORM STATE: GUEST CONTACT DETAILS & SUMMARY */
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-1.5 border-b border-border-dark/40 pb-5">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-gold font-medium font-sans">
                  <Sparkles size={12} className="text-gold" />
                  <span>DIRECT CONCIERGE RESERVATION</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-text-offwhite font-light tracking-wide">
                  Complete Your Stay Request
                </h2>
                <p className="text-xs text-text-gray font-light">
                  Please provide your contact details. Our team will review your enquiry and contact you immediately to confirm your stay.
                </p>
              </div>

              {/* Selected Stay Summary Card */}
              <div className="bg-bg-dark/60 border border-border-dark/60 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
                    Selected Sanctuary Summary
                  </span>
                  <span className="text-[10px] text-text-gray/70 font-mono">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between text-xs">
                    <span className="text-text-gray/70 flex items-center">
                      <MapPin size={12} className="mr-1 text-gold shrink-0" />
                      Property:
                    </span>
                    <span className="font-medium text-text-offwhite font-serif text-right ml-2">
                      {branch.title}
                    </span>
                  </div>

                  <div className="flex items-start justify-between text-xs">
                    <span className="text-text-gray/70 flex items-center">
                      <Calendar size={12} className="mr-1 text-gold shrink-0" />
                      Dates:
                    </span>
                    <span className="font-mono text-text-offwhite text-right ml-2">
                      {checkIn} &rarr; {checkOut}
                    </span>
                  </div>

                  <div className="border-t border-border-dark/40 pt-2 space-y-1.5">
                    {selectedRoomsSummaryList.map((item) => (
                      <div key={item.room.id} className="flex justify-between text-xs">
                        <span className="text-text-offwhite font-light">
                          {item.count} &times; {item.room.name}
                        </span>
                        <span className="font-mono text-gold">{formatPrice(item.total)}</span>
                      </div>
                    ))}
                    {extraBeds > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-text-offwhite font-light">
                          {extraBeds} &times; Extra Bed Option
                        </span>
                        <span className="font-mono text-gold">{formatPrice(extraBeds * EXTRA_BED_RATE)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border-dark/40 pt-2.5 flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-text-gray/80 font-medium">
                      Estimated Total (incl. 18% GST)
                    </span>
                    <span className="font-serif text-2xl text-gold font-light">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
                    Guest Contact Details
                  </h3>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="modalFullName" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                    <User size={11} className="mr-1 text-gold" /> Full Name *
                  </label>
                  <input
                    id="modalFullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={handleFullNameChange}
                    placeholder="e.g. Dr. Rajesh Varma"
                    className={`bg-bg-dark border rounded-xl p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                      fullNameError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                    }`}
                  />
                  {fullNameError && (
                    <span className="text-[10px] text-red-400 font-medium mt-0.5">{fullNameError}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="modalEmail" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                      <Mail size={11} className="mr-1 text-gold" /> Email Address *
                    </label>
                    <input
                      id="modalEmail"
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="rajesh@domain.com"
                      className={`bg-bg-dark border rounded-xl p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                        emailError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                      }`}
                    />
                    {emailError && (
                      <span className="text-[10px] text-red-400 font-medium mt-0.5">{emailError}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="modalPhone" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                      <Phone size={11} className="mr-1 text-gold" /> Contact Phone Number *
                    </label>
                    <input
                      id="modalPhone"
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 98847 62222"
                      className={`bg-bg-dark border rounded-xl p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                        phoneError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                      }`}
                    />
                    {phoneError && (
                      <span className="text-[10px] text-red-400 font-medium mt-0.5">{phoneError}</span>
                    )}
                  </div>
                </div>

                {/* Special Arrangements */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="modalRequests" className="text-[10px] uppercase tracking-wider text-text-gray font-medium">
                    Special Arrangements / Arrival Notes (Optional)
                  </label>
                  <textarea
                    id="modalRequests"
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    rows={2}
                    maxLength={500}
                    placeholder="Estimated arrival time, extra pillows, or dietary preferences..."
                    className="bg-bg-dark border border-border-dark rounded-xl p-3 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full placeholder-text-gray/30 resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !fullName || !email || !phone}
                  className="w-full py-4 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover disabled:bg-gold/40 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.25)] flex items-center justify-center space-x-2 cursor-pointer mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>SUBMITTING RESERVATION REQUEST...</span>
                    </>
                  ) : (
                    <span>CONFIRM &amp; REQUEST RESERVATION ({formatPrice(grandTotal)})</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* SUCCESS CONFIRMATION STATE */
            <div className="space-y-6 text-center py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-[0_0_25px_rgba(199,168,109,0.2)]"
              >
                <Check size={28} className="stroke-[2.5]" />
              </motion.div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium block font-sans">
                  RESERVATION REQUEST RECEIVED
                </span>
                <h2 className="font-serif text-3xl text-text-offwhite font-light">
                  Thank You, {fullName.split(" ")[0] || "Guest"}!
                </h2>
                <p className="text-xs text-text-gray font-light max-w-md mx-auto leading-relaxed">
                  Your stay request has been submitted to our desk concierge. Our team will review availability and contact you shortly to confirm your reservation.
                </p>
              </div>

              {/* Reference Voucher Card */}
              <div className="bg-bg-dark/80 border border-border-dark/80 rounded-2xl p-5 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-border-dark/40 pb-3">
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-text-gray/60 block font-sans">
                      Request Reference
                    </span>
                    <span className="font-mono text-sm text-gold font-semibold">
                      {bookingReference}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-text-gray/60 block font-sans">
                      Estimated Total
                    </span>
                    <span className="font-serif text-lg text-text-offwhite">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between text-text-gray">
                    <span>Property:</span>
                    <span className="text-text-offwhite font-serif">{branch.title}</span>
                  </div>
                  <div className="flex justify-between text-text-gray">
                    <span>Selected Chambers:</span>
                    <span className="text-text-offwhite font-medium">
                      {selectedRoomsSummaryList.map((i) => `${i.count}x ${i.room.name}`).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-gray">
                    <span>Dates:</span>
                    <span className="font-mono text-text-offwhite">{checkIn} &rarr; {checkOut} ({nights} nights)</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Priority Button */}
              {submittedData && (
                <div className="space-y-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(submittedData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("modal_confirmation", branch.id)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer transform hover:scale-[1.01]"
                  >
                    <MessageSquare size={16} className="stroke-[2]" />
                    <span>INSTANT WHATSAPP ENQUIRY</span>
                    <ArrowRight size={14} />
                  </a>

                  <p className="text-[10px] text-text-gray/60 text-center font-light">
                    Direct connection to desk concierge (+91 98847 62222) with your reservation details pre-filled.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
