"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { branches, Branch, RoomVariety, EXTRA_BED_RATE } from "@/lib/data";
import { formatPrice, sanitizePhoneInput, validateIndianPhoneNumber } from "@/lib/utils";
import { sendReservationEmail } from "@/lib/emailjs";
import { WhatsAppReservationData } from "@/lib/whatsapp";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { trackReservationSubmitted, trackReservationFailed } from "@/lib/analytics";

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "RIP-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getTomorrowString(daysAhead: number = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params
  const branchId = searchParams.get("branch") || branches[0].id;
  const checkIn = searchParams.get("checkin") || getTomorrowString(1);
  const checkOut = searchParams.get("checkout") || getTomorrowString(2);

  const extraBeds = useMemo(() => {
    const eb = searchParams.get("extrabeds");
    if (eb) {
      const parsed = parseInt(eb, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, [searchParams]);

  const roomsSelection = useMemo<Record<string, number>>(() => {
    const roomsParam = searchParams.get("rooms");
    if (roomsParam) {
      try {
        const parsed = JSON.parse(roomsParam);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse rooms param", e);
      }
    }
    return {};
  }, [searchParams]);

  const selectedBranch = useMemo(() => {
    return branches.find((b) => b.id === branchId || b.slug === branchId) || branches[0];
  }, [branchId]);

  const multiRoomItems = useMemo(() => {
    return selectedBranch.roomVarieties
      .filter((r) => (roomsSelection[r.id] || 0) > 0)
      .map((r) => ({
        room: r,
        count: roomsSelection[r.id],
        total: r.price * roomsSelection[r.id],
      }));
  }, [selectedBranch, roomsSelection]);

  const totalChambersCount = useMemo(() => {
    if (multiRoomItems.length > 0) {
      return multiRoomItems.reduce((acc, item) => acc + item.count, 0);
    }
    return 1;
  }, [multiRoomItems]);

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  }, [checkIn, checkOut]);

  const perNightBaseRate = useMemo(() => {
    if (multiRoomItems.length > 0) {
      return multiRoomItems.reduce((acc, item) => acc + item.total, 0);
    }
    return selectedBranch.roomVarieties[0]?.price || 3200;
  }, [multiRoomItems, selectedBranch]);

  const perNightExtraBedRate = extraBeds * EXTRA_BED_RATE;
  const perNightTotalRate = perNightBaseRate + perNightExtraBedRate;

  const roomTotal = perNightBaseRate * nights;
  const extraBedTotal = perNightExtraBedRate * nights;
  const baseTotal = roomTotal + extraBedTotal;
  const luxuryTax = Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + luxuryTax;

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");

  // Validation errors
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [phoneError, setPhoneError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const sanitized = sanitizePhoneInput(val);
    setPhone(sanitized);

    const err = validateIndianPhoneNumber(sanitized);
    if (err) {
      setPhoneError(err);
    } else {
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
    let phErr = validateIndianPhoneNumber(phone) || "";

    if (!fullName.trim()) nameErr = "Please enter your full name.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      mailErr = "Please enter a valid email address.";
    }

    setFullNameError(nameErr);
    setEmailError(mailErr);
    setPhoneError(phErr);

    if (nameErr || mailErr || phErr) {
      return phErr || "Please correct the highlighted contact fields before proceeding.";
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
    const propertyLabel = selectedBranch.name;
    const roomLabel = multiRoomItems.length > 0
      ? multiRoomItems.map((i) => `${i.count}x ${i.room.name}`).join(", ")
      : "Executive Suite";
    const occupancyLabel = `${totalChambersCount} Chamber(s) Selected`;
    const totalDisplay = formatPrice(grandTotal);

    const reservationPayload: WhatsAppReservationData = {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      roomName: roomLabel,
      roomTag: `${totalChambersCount} Rooms`,
      propertyName: propertyLabel,
      occupancyType: occupancyLabel,
      extraBeds: extraBeds,
      checkIn: checkIn,
      checkOut: checkOut,
      duration: durationLabel,
      guests: totalChambersCount * 2,
      specialRequests: requests.trim(),
      estimatedTotal: totalDisplay,
      branchPhone: selectedBranch.phone,
    };

    try {
      // Send reservation email via EmailJS
      await sendReservationEmail({
        guest_name: fullName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        property_name: propertyLabel,
        room_name: roomLabel,
        occupancy_type: occupancyLabel,
        extra_bed: extraBeds > 0 ? `${extraBeds} Extra Bed(s) (${formatPrice(extraBeds * EXTRA_BED_RATE)}/night)` : "None",
        check_in: checkIn,
        check_out: checkOut,
        duration: durationLabel,
        guests: totalChambersCount * 2,
        special_requests: requests.trim() || "None",
        base_rate: `${formatPrice(perNightTotalRate)} x ${nights} (${formatPrice(baseTotal)})`,
        gst: formatPrice(luxuryTax),
        estimated_total: totalDisplay,
        subject: `New Stay Reservation Request — ${selectedBranch.title}`,
      });

      trackReservationSubmitted({
        roomId: selectedBranch.id,
        roomName: roomLabel,
        nights: nights,
        guestCount: totalChambersCount * 2,
        estimatedTotal: grandTotal,
        branchName: selectedBranch.name,
      });

      // Save reservation payload to session storage for Thank You page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("rip_reservation_payload", JSON.stringify(reservationPayload));
        sessionStorage.setItem("rip_booking_ref", generatedRef);
      }

      // Navigate to dedicated /thank-you page
      const thankYouQuery = new URLSearchParams({
        ref: generatedRef,
        branch: selectedBranch.id,
        total: totalDisplay,
        guest: fullName.trim(),
      });

      router.push(`/thank-you?${thankYouQuery.toString()}`);
    } catch (error) {
      console.error("Failed to submit reservation email:", error);
      trackReservationFailed(selectedBranch.id, "emailjs_dispatch_error");
      setErrorMessage(
        "Unable to dispatch your reservation request via email at this moment. You can connect with our concierge directly on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-24 md:pt-32 pb-24 font-sans text-text-offwhite">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          href={`/branches/${selectedBranch.slug}`}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-text-gray hover:text-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-gold" />
          <span>Back to {selectedBranch.title}</span>
        </Link>

        {/* Title Header */}
        <div className="mb-10 border-b border-border-dark/40 pb-6 space-y-2">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-gold font-medium font-sans">
            <Sparkles size={12} className="text-gold" />
            <span>DIRECT CONCIERGE CHECKOUT</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide">
            Checkout &amp; Reserve Stay
          </h1>
          <p className="text-xs md:text-sm text-text-gray font-light max-w-2xl leading-relaxed">
            Please enter your contact details below. Our reservation team will review your enquiry and contact you immediately to finalize your stay.
          </p>
        </div>

        {/* Two Column Layout: Contact Form & Selected Stay Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT COLUMN: GUEST CONTACT DETAILS FORM */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-start space-x-3 text-red-300 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-surface-dark/40 border border-border-dark/60 rounded-2xl p-6 md:p-8 space-y-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gold font-medium border-b border-border-dark/40 pb-3 flex items-center">
                  <User size={13} className="mr-2 text-gold" />
                  Guest Contact Information
                </h2>

                {/* Full Name */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="checkoutFullName" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                    Full Name *
                  </label>
                  <input
                    id="checkoutFullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={handleFullNameChange}
                    placeholder="e.g. Dr. Rajesh Varma"
                    className={`bg-bg-dark border rounded-xl p-3.5 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                      fullNameError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                    }`}
                  />
                  {fullNameError && (
                    <span className="text-[10px] text-red-400 font-medium">{fullNameError}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="checkoutEmail" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                      <Mail size={11} className="mr-1 text-gold" /> Email Address *
                    </label>
                    <input
                      id="checkoutEmail"
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="rajesh@domain.com"
                      className={`bg-bg-dark border rounded-xl p-3.5 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                        emailError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                      }`}
                    />
                    {emailError && (
                      <span className="text-[10px] text-red-400 font-medium">{emailError}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="checkoutPhone" className="text-[10px] uppercase tracking-wider text-text-gray font-medium flex items-center">
                      <Phone size={11} className="mr-1 text-gold" /> Contact Phone Number *
                    </label>
                    <input
                      id="checkoutPhone"
                      type="tel"
                      required
                      maxLength={15}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 98847 62222"
                      className={`bg-bg-dark border rounded-xl p-3.5 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                        phoneError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                      }`}
                    />
                    {phoneError && (
                      <span className="text-[10px] text-red-400 font-medium">{phoneError}</span>
                    )}
                  </div>
                </div>

                {/* Special Arrangements */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="checkoutRequests" className="text-[10px] uppercase tracking-wider text-text-gray font-medium">
                    Special Arrangements or Arrival Notes (Optional)
                  </label>
                  <textarea
                    id="checkoutRequests"
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Estimated arrival time, airport transfer assistance, or dietary preferences..."
                    className="bg-bg-dark border border-border-dark rounded-xl p-3.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full placeholder-text-gray/30 resize-none"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting || !fullName || !email || !phone}
                className="w-full py-4 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover disabled:bg-gold/40 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
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

              <div className="flex items-center justify-center space-x-2 text-[10px] text-text-gray/60 font-light">
                <ShieldCheck size={13} className="text-gold" />
                <span>No upfront payment required today. Direct enquiry review by desk concierge.</span>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: SELECTED STAY SUMMARY */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border-dark/40 pb-4">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
                    Reservation Summary
                  </h3>
                  <span className="text-[10px] text-text-gray/70 font-mono">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>

                {/* Property & Chambers Breakdown */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-text-gray/60 block font-mono">
                      Property Location
                    </span>
                    <h4 className="font-serif text-xl text-text-offwhite font-light mt-0.5">
                      {selectedBranch.title}
                    </h4>
                    <p className="text-[10px] text-text-gray font-light mt-0.5">
                      {selectedBranch.address}
                    </p>
                  </div>

                  <div className="border-t border-border-dark/40 pt-4 space-y-2.5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium block">
                      Selected Chambers ({totalChambersCount})
                    </span>

                    {multiRoomItems.length > 0 ? (
                      multiRoomItems.map((item) => (
                        <div key={item.room.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border-dark/40 text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-bg-dark">
                              <Image src={item.room.image} alt={item.room.name} fill sizes="48px" className="object-cover" />
                            </div>
                            <div>
                              <p className="font-serif text-text-offwhite text-xs">{item.count} &times; {item.room.name}</p>
                              <p className="text-[10px] text-text-gray/60 font-mono">{formatPrice(item.room.price)} /nt</p>
                            </div>
                          </div>
                          <span className="font-mono text-gold text-xs font-medium">{formatPrice(item.total)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border-dark/40 text-xs">
                        <span className="text-text-offwhite font-serif">{selectedBranch.roomVarieties[0]?.name}</span>
                        <span className="font-mono text-gold">{formatPrice(selectedBranch.roomVarieties[0]?.price || 3200)}</span>
                      </div>
                    )}

                    {extraBeds > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border-dark/40 text-xs">
                        <span className="text-text-offwhite font-light">{extraBeds} &times; Extra Bed Option</span>
                        <span className="font-mono text-gold">{formatPrice(extraBeds * EXTRA_BED_RATE)}</span>
                      </div>
                    )}
                  </div>

                  {/* Dates & Tariff calculation */}
                  <div className="border-t border-border-dark/40 pt-4 space-y-3 font-sans text-xs">
                    <div className="flex justify-between text-text-gray">
                      <span>Check-in Date</span>
                      <span className="text-text-offwhite font-mono font-medium">{checkIn}</span>
                    </div>
                    <div className="flex justify-between text-text-gray">
                      <span>Check-out Date</span>
                      <span className="text-text-offwhite font-mono font-medium">{checkOut}</span>
                    </div>
                    <div className="flex justify-between text-text-gray">
                      <span>Stay Duration</span>
                      <span className="text-text-offwhite font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
                    </div>

                    <div className="h-px bg-border-dark/30 w-full my-2" />

                    <div className="flex justify-between text-text-gray">
                      <span>Chambers Subtotal</span>
                      <span className="text-text-offwhite font-mono">{formatPrice(perNightTotalRate)} &times; {nights} = {formatPrice(baseTotal)}</span>
                    </div>
                    <div className="flex justify-between text-text-gray">
                      <span>Luxury GST (18%)</span>
                      <span className="text-text-offwhite font-mono">{formatPrice(luxuryTax)}</span>
                    </div>

                    <div className="h-px bg-border-dark/40 w-full my-2" />

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs uppercase tracking-[0.15em] text-text-offwhite font-semibold">
                        Estimated Total
                      </span>
                      <span className="font-serif text-2xl text-gold font-light">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Helpline Box */}
                <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl text-[10px] text-text-gray flex items-center justify-between">
                  <span>Desk Concierge Helpline</span>
                  <a href={`tel:${selectedBranch.phone.replace(/\s+/g, "")}`} className="text-gold font-medium hover:underline">
                    {selectedBranch.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
