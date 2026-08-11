"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { rooms, hotelDetails } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import {
  Mail,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { sendReservationEmail } from "@/lib/emailjs";
import { WhatsAppReservationData, buildWhatsAppUrl } from "@/lib/whatsapp";
import ReservationConfirmationView from "./ReservationConfirmationView";
import {
  trackBookingStarted,
  trackRoomSelected,
  trackDateSelected,
  trackGuestDetailsStarted,
  trackReservationSubmitted,
  trackReservationFailed,
} from "@/lib/analytics";

function getTomorrowString(offsetDays = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function generateRefCode(): string {
  return `RQ${Math.floor(100000 + Math.random() * 900000)}`;
}

function BookingContent() {
  const searchParams = useSearchParams();

  // Initialize state directly from search params or defaults
  const initialRoomId = useMemo(() => {
    const roomParam = searchParams.get("room");
    if (roomParam && rooms.some((r) => r.id === roomParam)) {
      return roomParam;
    }
    return rooms[0]?.id || "";
  }, [searchParams]);

  const initialBranchId = useMemo(() => {
    const branchParam = searchParams.get("branch");
    const room = rooms.find((r) => r.id === initialRoomId) || rooms[0];
    if (room && room.branches && room.branches.length > 0) {
      const isValid = room.branches.some((b) => b.id === branchParam);
      return isValid ? (branchParam as string) : room.branches[0].id;
    }
    return "";
  }, [searchParams, initialRoomId]);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);
  const [checkIn, setCheckIn] = useState<string>(() => searchParams.get("checkin") || getTomorrowString(1));
  const [checkOut, setCheckOut] = useState<string>(() => searchParams.get("checkout") || getTomorrowString(2));
  const [guests, setGuests] = useState<number>(() => parseInt(searchParams.get("guests") || "2", 10) || 2);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");

  // Field errors state
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [submittedData, setSubmittedData] = useState<WhatsAppReservationData | null>(null);

  useEffect(() => {
    trackBookingStarted("booking_page", initialRoomId, initialBranchId);
  }, [initialRoomId, initialBranchId]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strictly filter out non-phone characters (letters, symbols like ; or ,)
    const val = e.target.value;
    const sanitized = val.replace(/[^0-9+\-\s()]/g, "");
    setPhone(sanitized);

    // Provide immediate feedback if user attempted to type letters
    if (val !== sanitized) {
      setPhoneError("Phone number can only contain digits and valid phone symbols (+, -, ()).");
    } else if (sanitized.replace(/[^0-9]/g, "").length >= 6) {
      setPhoneError("");
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setFullNameError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e.target.value.trim())) {
      setEmailError("");
    }
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    const newRoom = rooms.find((r) => r.id === roomId);
    if (newRoom && newRoom.branches && newRoom.branches.length > 0) {
      setSelectedBranchId(newRoom.branches[0].id);
    } else {
      setSelectedBranchId("");
    }
    trackRoomSelected(roomId, newRoom?.name, newRoom?.branches?.[0]?.id);
  };

  // Derive nights from dates directly
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  }, [checkIn, checkOut]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const selectedBranch =
    selectedRoom?.branches?.find((b) => b.id === selectedBranchId) || selectedRoom?.branches?.[0];

  // Pricing calculations
  const basePrice = selectedRoom ? selectedRoom.price : 0;
  const baseTotal = basePrice * nights;
  const luxuryTax = Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + luxuryTax;

  const validateForm = () => {
    let nameErr = "";
    let mailErr = "";
    let phErr = "";

    if (!fullName.trim()) {
      nameErr = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      mailErr = "Please enter a valid email address.";
    }

    const phoneDigitsOnly = phone.replace(/[^0-9]/g, "");
    const phoneRegex = /^\+?[0-9\s\-\(\)]{6,20}$/;
    if (!phone.trim()) {
      phErr = "Please enter your phone number.";
    } else if (phoneDigitsOnly.length < 6 || !phoneRegex.test(phone.trim())) {
      phErr = "Please enter a valid contact phone number (digits only, at least 6 numbers).";
    }

    setFullNameError(nameErr);
    setEmailError(mailErr);
    setPhoneError(phErr);

    if (nameErr || mailErr || phErr) {
      // Focus first error input field
      if (nameErr) document.getElementById("fullNameInput")?.focus();
      else if (mailErr) document.getElementById("emailInput")?.focus();
      else if (phErr) document.getElementById("phoneInput")?.focus();
      return "Please correct the highlighted fields below before submitting.";
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Please select valid check-in and check-out dates.";
    if (end <= start) return "Check-out date must be after check-in date.";
    if (!selectedRoom) return "Please select a chamber or suite.";
    const maxCapacity = selectedRoom ? parseInt(selectedRoom.guests, 10) || 2 : 4;
    if (guests > maxCapacity) {
      return `The selected chamber (${selectedRoom.name}) accommodates a maximum of ${maxCapacity} guests. Please adjust your guest selection.`;
    }
    if (requests.length > 1000) {
      return "Special arrangements text cannot exceed 1000 characters.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    const generatedRef = generateRefCode();
    const durationLabel = `${nights} night${nights > 1 ? "s" : ""}`;
    const propertyLabel = selectedBranch?.name || hotelDetails.name;
    const roomLabel = selectedRoom ? selectedRoom.name : "Sanctuary";
    const totalDisplay = formatPrice(grandTotal);

    const reservationPayload: WhatsAppReservationData = {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      roomName: roomLabel,
      roomTag: selectedRoom?.tag,
      propertyName: propertyLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      duration: durationLabel,
      guests: guests,
      specialRequests: requests.trim(),
      estimatedTotal: totalDisplay,
    };

    try {
      // Send reservation request to hotel owner via EmailJS
      await sendReservationEmail({
        guest_name: fullName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        property_name: propertyLabel,
        room_name: roomLabel,
        check_in: checkIn,
        check_out: checkOut,
        duration: durationLabel,
        guests: guests,
        special_requests: requests.trim() || "None",
        base_rate: `${formatPrice(basePrice)} x ${nights} (${formatPrice(baseTotal)})`,
        gst: formatPrice(luxuryTax),
        estimated_total: totalDisplay,
        subject: `New Reservation Request — ${roomLabel} — ${checkIn}`,
      });

      // Switch to full-page confirmation view seamlessly
      setBookingReference(generatedRef);
      setSubmittedData(reservationPayload);
      setIsSubmitted(true);
      trackReservationSubmitted({
        roomId: selectedRoomId,
        roomName: roomLabel,
        nights: nights,
        guestCount: guests,
        estimatedTotal: grandTotal,
        branchName: selectedBranch?.name,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Failed to send reservation request:", err);
      trackReservationFailed(selectedRoomId, "emailjs_dispatch_error");
      setErrorMessage(
        "Unable to submit your reservation request via email at this moment. You can also reach out to our concierge directly on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If request has been successfully submitted, render full-page luxury confirmation view
  if (isSubmitted && submittedData) {
    return (
      <ReservationConfirmationView
        reservationData={submittedData}
        bookingReference={bookingReference}
        selectedRoom={selectedRoom}
        basePriceFormatted={`${formatPrice(basePrice)} x ${nights}`}
        taxFormatted={formatPrice(luxuryTax)}
        onNewRequest={() => setIsSubmitted(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left Column: Form entry */}
      <div className="lg:col-span-7 space-y-8">
        {/* Title */}
        <div className="space-y-4 border-b border-border-dark/45 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium block">
                Bespoke Reservation
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-text-offwhite font-light tracking-wide">
                Reserve Your Stay
              </h1>
            </div>
            <div className="flex items-center space-x-2 bg-gold/5 border border-gold/15 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.15em] text-gold font-medium">Direct Concierge Connection</span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-gray font-light leading-relaxed">
            Submit your dates and preferences. Our reservation team will review availability and contact you promptly to finalize your stay.
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start space-x-3 text-red-300 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-2">
              <p>{errorMessage}</p>
              {selectedRoom && (
                <a
                  href={buildWhatsAppUrl({
                    guestName: fullName || "Guest",
                    roomName: selectedRoom.name,
                    propertyName: selectedBranch?.name,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    duration: `${nights} nights`,
                    guests: guests,
                    specialRequests: requests,
                    estimatedTotal: formatPrice(grandTotal),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-gold hover:underline font-medium text-[11px]"
                >
                  <MessageSquare size={12} />
                  <span>Inquire via WhatsApp instead &rarr;</span>
                </a>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Contact Information */}
          <div className="bg-surface-dark/30 border border-border-dark/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-2">
              Guest Contact Details
            </h3>

            {/* Full Name */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="fullNameInput" className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium flex items-center">
                <User size={11} className="mr-1.5" />
                Full Name
              </label>
              <input
                id="fullNameInput"
                type="text"
                required
                value={fullName}
                onFocus={() => trackGuestDetailsStarted(selectedRoomId, nights, guests)}
                onChange={handleFullNameChange}
                placeholder="Elena Rostova"
                className={`bg-bg-dark border rounded-lg p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                  fullNameError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                }`}
              />
              {fullNameError && (
                <span className="text-[10px] text-red-400 font-sans font-medium flex items-center mt-1">
                  <AlertCircle size={10} className="mr-1 inline shrink-0" />
                  {fullNameError}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Address */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="emailInput" className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium flex items-center">
                  <Mail size={11} className="mr-1.5" />
                  Email Address
                </label>
                <input
                  id="emailInput"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="elena@writer.com"
                  className={`bg-bg-dark border rounded-lg p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                    emailError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                  }`}
                />
                {emailError && (
                  <span className="text-[10px] text-red-400 font-sans font-medium flex items-center mt-1">
                    <AlertCircle size={10} className="mr-1 inline shrink-0" />
                    {emailError}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="phoneInput" className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium flex items-center">
                  <Phone size={11} className="mr-1.5" />
                  Phone Number
                </label>
                <input
                  id="phoneInput"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+91 99999 55555"
                  className={`bg-bg-dark border rounded-lg p-3 text-xs text-text-offwhite font-sans focus:outline-none transition-colors w-full placeholder-text-gray/30 ${
                    phoneError ? "border-red-500/80 bg-red-500/5 focus:border-red-500" : "border-border-dark focus:border-gold"
                  }`}
                />
                {phoneError && (
                  <span className="text-[10px] text-red-400 font-sans font-medium flex items-center mt-1">
                    <AlertCircle size={10} className="mr-1 inline shrink-0" />
                    {phoneError}
                  </span>
                )}
              </div>
            </div>

            {/* Special requests */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="requestsInput" className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium">
                Special Arrangements or Dietary Needs
              </label>
              <textarea
                id="requestsInput"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                maxLength={1000}
                placeholder="Prefer lavender scent in turndown, or airport greeting transfers details..."
                rows={3}
                className="bg-bg-dark border border-border-dark rounded-lg p-3 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full placeholder-text-gray/30 resize-none"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || !fullName || !email || !phone}
            className="w-full py-4 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover disabled:bg-gold/40 disabled:text-bg-dark/60 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>SUBMITTING REQUEST...</span>
              </>
            ) : (
              <span>REQUEST RESERVATION</span>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Checkout Summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
              Reservation Summary
            </h3>

            {/* Room Snapshot */}
            {selectedRoom && (
              <div className="flex items-center space-x-4 border-b border-border-dark/40 pb-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-dark shrink-0">
                  <Image
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-gold font-medium font-sans">
                    {selectedRoom.tag}
                  </span>
                  <h4 className="font-serif text-lg text-text-offwhite font-light">
                    {selectedRoom.name}
                  </h4>
                  {selectedBranch && (
                    <p className="text-[10px] text-gold font-sans font-medium tracking-wide uppercase">
                      {selectedBranch.name.split(" — ")[1] || selectedBranch.name}
                    </p>
                  )}
                  <p className="text-[10px] text-text-gray font-sans font-light">
                    {selectedRoom.size} · Max occupancy {selectedRoom.guests}
                  </p>
                </div>
              </div>
            )}

            {/* Booking calculations */}
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-text-gray font-light">
                <span>Check-in Date</span>
                <span className="text-text-offwhite font-medium">{checkIn}</span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Check-out Date</span>
                <span className="text-text-offwhite font-medium">{checkOut}</span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Duration</span>
                <span className="text-text-offwhite font-medium">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Guests</span>
                <span className="text-text-offwhite font-medium">{guests} Adults</span>
              </div>

              <div className="h-px bg-border-dark/30 w-full my-2" />

              <div className="flex justify-between text-text-gray font-light">
                <span>Base Sanctuary Rate</span>
                <span className="text-text-offwhite">
                  {formatPrice(basePrice)} x {nights}
                </span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Luxury GST (18%)</span>
                <span className="text-text-offwhite">{formatPrice(luxuryTax)}</span>
              </div>

              <div className="h-px bg-border-dark/40 w-full my-2" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs uppercase tracking-[0.1em] text-text-offwhite font-semibold">
                  Estimated Total
                </span>
                <span className="font-serif text-xl md:text-2xl text-gold font-light">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Banner / Booking Direct Benefits */}
          <div className="bg-surface-dark/45 border border-border-dark/60 rounded-2xl p-6 space-y-4 shadow-lg">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
              Direct Reservation Privileges
            </h4>
            <ul className="space-y-3.5 text-xs text-text-gray font-light">
              <li className="flex items-start space-x-2.5">
                <span className="text-gold mt-0.5 font-sans font-medium text-sm">✓</span>
                <div>
                  <span className="font-medium text-text-offwhite block text-[11px] uppercase tracking-wider">Best Rate Guarantee</span>
                  <span className="text-[10.5px] text-text-gray/70 leading-relaxed block mt-0.5">No hidden booking fees, commission markups, or service charges.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-gold mt-0.5 font-sans font-medium text-sm">✓</span>
                <div>
                  <span className="font-medium text-text-offwhite block text-[11px] uppercase tracking-wider">Flexible 24-Hour Stay</span>
                  <span className="text-[10.5px] text-text-gray/70 leading-relaxed block mt-0.5">Check in and check out at any hour. A full 24-hour stay starting from arrival.</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-gold mt-0.5 font-sans font-medium text-sm">✓</span>
                <div>
                  <span className="font-medium text-text-offwhite block text-[11px] uppercase tracking-wider">Direct Concierge Communication</span>
                  <span className="text-[10.5px] text-text-gray/70 leading-relaxed block mt-0.5">Direct chat review with desk management to customize your luxury arrangements.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingClient() {
  return (
    <div className="bg-bg-dark min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Link
          href="/rooms"
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-text-gray hover:text-gold transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Stays</span>
        </Link>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gold" size={24} />
            </div>
          }
        >
          <BookingContent />
        </Suspense>
      </div>
    </div>
  );
}
