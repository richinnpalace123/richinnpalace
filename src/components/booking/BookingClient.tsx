"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { rooms, branches, Room, Branch, EXTRA_BED_RATE, getRoomPrice } from "@/lib/data";
import { formatPrice, sanitizePhoneInput, validateIndianPhoneNumber } from "@/lib/utils";
import {
  Mail,
  Phone,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MessageSquare,
  MapPin,
  CheckCircle2,
  BedDouble,
  Coffee,
  Wifi,
  Clock,
  Wine,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { sendReservationEmail } from "@/lib/emailjs";
import { WhatsAppReservationData, buildWhatsAppUrl } from "@/lib/whatsapp";
import ReservationConfirmationView from "./ReservationConfirmationView";
import {
  trackBookingStarted,
  trackRoomSelected,
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

  // Initialize selected room and branch from query params or fallback
  const initialRoomsMap = useMemo<Record<string, number>>(() => {
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

  const initialExtraBeds = useMemo<number>(() => {
    const eb = searchParams.get("extrabeds");
    if (eb) {
      const parsed = parseInt(eb, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    const extraParam = searchParams.get("extrabed");
    return extraParam === "1" || extraParam === "true" ? 1 : 0;
  }, [searchParams]);

  const initialRoomId = useMemo(() => {
    const roomParam = searchParams.get("room");
    if (roomParam && rooms.some((r) => r.id === roomParam || r.slug === roomParam)) {
      return roomParam;
    }
    return rooms[0]?.id || "executive-room";
  }, [searchParams]);

  const initialBranchId = useMemo(() => {
    const branchParam = searchParams.get("branch");
    if (branchParam && branches.some((b) => b.id === branchParam || b.slug === branchParam)) {
      const matched = branches.find((b) => b.id === branchParam || b.slug === branchParam);
      return matched?.id || branches[0]?.id || "tnagar-rangan";
    }
    return branches[0]?.id || "tnagar-rangan";
  }, [searchParams]);

  const initialOccupancy = useMemo(() => {
    const occParam = searchParams.get("occupancy");
    return occParam === "single" ? "single" : "double";
  }, [searchParams]);

  const initialExtraBed = useMemo(() => {
    return initialExtraBeds > 0;
  }, [initialExtraBeds]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId);
  const [occupancy, setOccupancy] = useState<"single" | "double">(initialOccupancy);
  const [hasExtraBed, setHasExtraBed] = useState<boolean>(initialExtraBed);
  const [extraBedsCount, setExtraBedsCount] = useState<number>(initialExtraBeds);
  const [roomsSelection, setRoomsSelection] = useState<Record<string, number>>(initialRoomsMap);

  const [checkIn, setCheckIn] = useState<string>(() => searchParams.get("checkin") || getTomorrowString(1));
  const [checkOut, setCheckOut] = useState<string>(() => searchParams.get("checkout") || getTomorrowString(2));
  const [guests, setGuests] = useState<number>(() => {
    const g = parseInt(searchParams.get("guests") || "2", 10);
    return isNaN(g) || g < 1 ? 2 : g;
  });

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
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
    trackRoomSelected(roomId, roomId, selectedBranchId);
  };

  // Derived entities
  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId || r.slug === selectedRoomId) || rooms[0];

  const hasMultiRoomSelection = useMemo(() => {
    return Object.values(roomsSelection).some((count) => count > 0);
  }, [roomsSelection]);

  const multiRoomItems = useMemo(() => {
    if (!hasMultiRoomSelection) return [];
    return selectedBranch.roomVarieties
      .filter((r) => (roomsSelection[r.id] || 0) > 0)
      .map((r) => ({
        room: r,
        count: roomsSelection[r.id],
        total: r.price * roomsSelection[r.id],
      }));
  }, [selectedBranch, roomsSelection, hasMultiRoomSelection]);

  const totalChambersCount = useMemo(() => {
    if (hasMultiRoomSelection) {
      return multiRoomItems.reduce((acc, item) => acc + item.count, 0);
    }
    return 1;
  }, [hasMultiRoomSelection, multiRoomItems]);

  // Derive nights from dates
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  }, [checkIn, checkOut]);

  // Pricing calculations
  const perNightBaseRate = useMemo(() => {
    if (hasMultiRoomSelection && multiRoomItems.length > 0) {
      return multiRoomItems.reduce((acc, item) => acc + item.total, 0);
    }
    return getRoomPrice(selectedRoom.id, selectedBranch.id, occupancy);
  }, [hasMultiRoomSelection, multiRoomItems, selectedRoom.id, selectedBranch.id, occupancy]);

  const effectiveExtraBeds = hasMultiRoomSelection ? extraBedsCount : (hasExtraBed ? 1 : 0);
  const perNightExtraBedRate = effectiveExtraBeds * EXTRA_BED_RATE;
  const perNightTotalRate = perNightBaseRate + perNightExtraBedRate;

  const roomTotal = perNightBaseRate * nights;
  const extraBedTotal = perNightExtraBedRate * nights;
  const baseTotal = roomTotal + extraBedTotal;
  const luxuryTax = Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + luxuryTax;

  const validateForm = () => {
    let nameErr = "";
    let mailErr = "";

    if (!fullName.trim()) {
      nameErr = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      mailErr = "Please enter a valid email address.";
    }

    let phErr = validateIndianPhoneNumber(phone) || "";

    setFullNameError(nameErr);
    setEmailError(mailErr);
    setPhoneError(phErr);

    if (nameErr || mailErr || phErr) {
      if (nameErr) document.getElementById("fullNameInput")?.focus();
      else if (mailErr) document.getElementById("emailInput")?.focus();
      else if (phErr) document.getElementById("phoneInput")?.focus();
      return "Please correct the highlighted fields below before submitting.";
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Please select valid check-in and check-out dates.";
    if (end <= start) return "Check-out date must be after check-in date.";

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
    const propertyLabel = selectedBranch.name;
    const roomLabel = hasMultiRoomSelection
      ? multiRoomItems.map((item) => `${item.count}x ${item.room.name}`).join(", ")
      : selectedRoom.name;
    const occupancyLabel = hasMultiRoomSelection
      ? `${totalChambersCount} Chamber(s) Selected`
      : (occupancy === "single" ? "Single Occupancy (1 Guest)" : "Double Occupancy (2 Guests)");
    const totalDisplay = formatPrice(grandTotal);

    const reservationPayload: WhatsAppReservationData = {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      roomName: roomLabel,
      roomTag: hasMultiRoomSelection ? `${totalChambersCount} Rooms` : selectedRoom.tag,
      propertyName: propertyLabel,
      occupancyType: occupancyLabel,
      extraBeds: effectiveExtraBeds,
      checkIn: checkIn,
      checkOut: checkOut,
      duration: durationLabel,
      guests: guests,
      specialRequests: requests.trim(),
      estimatedTotal: totalDisplay,
      branchPhone: selectedBranch.phone,
    };

    try {
      // Send reservation request to hotel desk via EmailJS
      await sendReservationEmail({
        guest_name: fullName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        property_name: propertyLabel,
        room_name: roomLabel,
        occupancy_type: occupancyLabel,
        extra_bed: effectiveExtraBeds > 0 ? `${effectiveExtraBeds} Extra Bed(s) (${formatPrice(effectiveExtraBeds * EXTRA_BED_RATE)}/night)` : "None",
        check_in: checkIn,
        check_out: checkOut,
        duration: durationLabel,
        guests: guests,
        special_requests: requests.trim() || "None",
        base_rate: `${formatPrice(perNightTotalRate)} x ${nights} (${formatPrice(baseTotal)})`,
        gst: formatPrice(luxuryTax),
        estimated_total: totalDisplay,
        subject: `New Reservation Request — ${roomLabel} (${occupancyLabel}) — ${selectedBranch.title}`,
      });

      // Switch to full-page confirmation view seamlessly
      setBookingReference(generatedRef);
      setSubmittedData(reservationPayload);
      setIsSubmitted(true);
      trackReservationSubmitted({
        roomId: selectedRoom.id,
        roomName: roomLabel,
        nights: nights,
        guestCount: guests,
        estimatedTotal: grandTotal,
        branchName: selectedBranch.name,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Failed to send reservation request:", err);
      trackReservationFailed(selectedRoom.id, "emailjs_dispatch_error");
      setErrorMessage(
        "Unable to submit your reservation request via email at this moment. You can connect with our concierge directly on WhatsApp."
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
        basePriceFormatted={`${formatPrice(perNightTotalRate)} x ${nights}`}
        taxFormatted={formatPrice(luxuryTax)}
        onNewRequest={() => setIsSubmitted(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left Column: Form & Room Selection Entry */}
      <div className="lg:col-span-7 space-y-8">
        {/* Title Header */}
        <div className="space-y-4 border-b border-border-dark/45 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium block">
                DIRECT RESERVATION
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-text-offwhite font-light tracking-wide">
                Custom Stay Reservation
              </h1>
            </div>
            <div className="flex items-center space-x-2 bg-gold/10 border border-gold/25 px-3.5 py-1.5 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-gold font-medium">
                Helpline: 9884762222
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-gray font-light leading-relaxed">
            Select your preferred Chennai branch, choose your room type & occupancy, and configure optional extra beds. Complimentary South Indian buffet breakfast, high-speed Wi-Fi, and 24/7 room service are included with every booking.
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
                    propertyName: selectedBranch.name,
                    occupancyType: occupancy === "single" ? "Single Occupancy" : "Double Occupancy",
                    extraBeds: hasExtraBed ? 1 : 0,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    duration: `${nights} nights`,
                    guests: guests,
                    specialRequests: requests,
                    estimatedTotal: formatPrice(grandTotal),
                    branchPhone: selectedBranch.phone,
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {hasMultiRoomSelection ? (
            /* CONCISE SUMMARY HEADER FOR PRE-SELECTED STAY */
            <div className="bg-surface-dark/60 border border-gold/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border-dark/40 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium font-sans flex items-center">
                  <Sparkles size={12} className="mr-1.5" />
                  Your Selected Sanctuary Stay
                </span>
                <span className="text-[10px] text-text-gray/70 font-mono">
                  {nights} {nights === 1 ? "Night" : "Nights"} ({checkIn} &rarr; {checkOut})
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-text-gray">Property Location:</span>
                  <span className="text-text-offwhite font-serif font-light text-sm">
                    {selectedBranch.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-gray">Selected Chambers:</span>
                  <span className="text-text-offwhite font-medium">
                    {multiRoomItems.map((i) => `${i.count} × ${i.room.name}`).join(", ")}
                  </span>
                </div>
                {effectiveExtraBeds > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-gray">Extra Beds:</span>
                    <span className="text-gold font-medium">{effectiveExtraBeds} Extra Bed Option</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-border-dark/30">
                  <span className="text-text-gray font-medium">Estimated Total (incl. 18% GST):</span>
                  <span className="text-gold font-serif text-lg font-light">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              {/* STEP 1: CHOOSE BRANCH */}
              <div className="bg-surface-dark/40 border border-border-dark/60 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                    <MapPin size={13} className="mr-2 text-gold" />
                    1. Select Preferred Branch
                  </h3>
                  <span className="text-[10px] text-text-gray/60 font-sans">3 Prime Locations</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {branches.map((branch) => {
                    const isSelected = selectedBranchId === branch.id;
                    return (
                      <button
                        type="button"
                        key={branch.id}
                        onClick={() => setSelectedBranchId(branch.id)}
                        className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(199,168,109,0.15)]"
                            : "bg-bg-dark/60 border-border-dark/60 hover:border-gold/40 text-text-gray"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded bg-gold/15 text-gold">
                              {branch.area}
                            </span>
                            {isSelected && <CheckCircle2 size={13} className="text-gold" />}
                          </div>
                          <h4 className={`font-serif text-sm font-light ${isSelected ? "text-text-offwhite" : "text-text-gray"}`}>
                            {branch.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-text-gray/60 mt-2 line-clamp-2">
                          {branch.address}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: CHOOSE ROOM TYPE */}
              <div className="bg-surface-dark/40 border border-border-dark/60 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                    <BedDouble size={13} className="mr-2 text-gold" />
                    2. Choose Room Type
                  </h3>
                  <span className="text-[10px] text-text-gray/60 font-sans">Executive vs Suite</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id || selectedRoomId === room.slug;
                    const roomTariffSingle = getRoomPrice(room.id, selectedBranch.id, "single");
                    const roomTariffDouble = getRoomPrice(room.id, selectedBranch.id, "double");

                    return (
                      <div
                        key={room.id}
                        onClick={() => handleRoomChange(room.id)}
                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(199,168,109,0.15)]"
                            : "bg-bg-dark/60 border-border-dark/60 hover:border-gold/40"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-bg-dark">
                            <Image
                              src={room.image}
                              alt={room.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 300px"
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded bg-bg-dark/80 text-gold border border-gold/30">
                                {room.tag}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <h4 className={`font-serif text-lg ${isSelected ? "text-text-offwhite" : "text-text-gray"}`}>
                              {room.name}
                            </h4>
                            <span className="text-[11px] font-sans text-gold font-medium">
                              {formatPrice(roomTariffSingle)} / {formatPrice(roomTariffDouble)}
                            </span>
                          </div>

                          <p className="text-[11px] text-text-gray font-light leading-relaxed">
                            {room.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border-dark/40 flex items-center justify-between text-[10px] text-text-gray/70">
                          <span>{room.size}</span>
                          <span className="text-gold font-medium">
                            {isSelected ? "Selected ✓" : "Click to select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: OCCUPANCY & EXTRA BED CONFIGURATION */}
              <div className="bg-surface-dark/40 border border-border-dark/60 rounded-2xl p-6 space-y-5">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
                  3. Occupancy &amp; Extra Bed Details
                </h3>

                {/* Single vs Double Occupancy Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium block">
                    Occupancy Selection
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOccupancy("single");
                        if (guests > 1 && !hasExtraBed) setGuests(1);
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        occupancy === "single"
                          ? "bg-gold/15 border-gold text-text-offwhite"
                          : "bg-bg-dark/50 border-border-dark/60 text-text-gray hover:border-gold/40"
                      }`}
                    >
                      <div>
                        <span className="font-sans font-medium text-xs block text-text-offwhite">
                          Single Occupancy (1 Guest)
                        </span>
                        <span className="text-[10px] text-text-gray/60">
                          Tariff: {formatPrice(getRoomPrice(selectedRoom.id, selectedBranch.id, "single"))} / night
                        </span>
                      </div>
                      <span className="font-serif text-sm text-gold font-light">
                        {formatPrice(getRoomPrice(selectedRoom.id, selectedBranch.id, "single"))}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOccupancy("double");
                        if (guests < 2) setGuests(2);
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        occupancy === "double"
                          ? "bg-gold/15 border-gold text-text-offwhite"
                          : "bg-bg-dark/50 border-border-dark/60 text-text-gray hover:border-gold/40"
                      }`}
                    >
                      <div>
                        <span className="font-sans font-medium text-xs block text-text-offwhite">
                          Double Occupancy (2 Guests)
                        </span>
                        <span className="text-[10px] text-text-gray/60">
                          Tariff: {formatPrice(getRoomPrice(selectedRoom.id, selectedBranch.id, "double"))} / night
                        </span>
                      </div>
                      <span className="font-serif text-sm text-gold font-light">
                        {formatPrice(getRoomPrice(selectedRoom.id, selectedBranch.id, "double"))}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Extra Bed Toggle */}
                <div className="pt-2 border-t border-border-dark/40">
                  <label
                    onClick={() => setHasExtraBed(!hasExtraBed)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-bg-dark/50 border border-border-dark/60 hover:border-gold/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={hasExtraBed}
                        onChange={(e) => setHasExtraBed(e.target.checked)}
                        className="w-4 h-4 accent-gold cursor-pointer rounded"
                      />
                      <div>
                        <span className="text-xs text-text-offwhite font-medium block">
                          Include Extra Bed (+₹700 / night)
                        </span>
                        <span className="text-[10px] text-text-gray/60">
                          Suitable for an additional adult or child
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gold font-medium font-mono">
                      +₹700/nt
                    </span>
                  </label>
                </div>
              </div>

            {/* Dates & Guest Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium">
                  Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={getTomorrowString(0)}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    const nextDay = new Date(e.target.value);
                    nextDay.setDate(nextDay.getDate() + 1);
                    if (checkOut <= e.target.value) {
                      setCheckOut(nextDay.toISOString().split("T")[0]);
                    }
                  }}
                  className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium">
                  Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium">
                  Guests Count
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors cursor-pointer"
                >
                  <option value={1}>1 Guest (Single)</option>
                  <option value={2}>2 Guests (Double)</option>
                  <option value={3}>3 Guests (with Extra Bed)</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            {/* Inclusions highlights */}
            <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider text-gold font-medium block mb-2">
                All Bookings Include:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-text-gray">
                <span className="flex items-center text-text-offwhite">
                  <Coffee size={11} className="mr-1 text-gold" /> South Indian Buffet
                </span>
                <span className="flex items-center text-text-offwhite">
                  <Wifi size={11} className="mr-1 text-gold" /> High-Speed Wi-Fi
                </span>
                <span className="flex items-center text-text-offwhite">
                  <Clock size={11} className="mr-1 text-gold" /> 24/7 Room Service
                </span>
                <span className="flex items-center text-text-offwhite">
                  <Wine size={11} className="mr-1 text-gold" /> In-Room Mini Bar
                </span>
              </div>
            </div>
          </React.Fragment>
        )}

          {/* STEP 4: GUEST CONTACT DETAILS */}
          <div className="bg-surface-dark/40 border border-border-dark/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-2">
              4. Guest Contact Information
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
                onFocus={() => trackGuestDetailsStarted(selectedRoom.id, nights, guests)}
                onChange={handleFullNameChange}
                placeholder="Dr. Rajesh Varma"
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
                  placeholder="rajesh@domain.com"
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
                  Contact Phone Number
                </label>
                <input
                  id="phoneInput"
                  type="tel"
                  required
                  maxLength={15}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+91 98847 62222"
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
                Special Arrangements or Arrival Notes
              </label>
              <textarea
                id="requestsInput"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                maxLength={1000}
                placeholder="Estimated late arrival time, airport transfer assistance, or dietary requirements..."
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
                <span>SUBMITTING RESERVATION...</span>
              </>
            ) : (
              <span>REQUEST RESERVATION ({formatPrice(grandTotal)})</span>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Dynamic Reservation Summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
                Reservation Summary
              </h3>
              <span className="text-[9px] uppercase tracking-wider text-text-gray/60 font-mono">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>

            {/* Room Snapshot / Multi-room Selection */}
            {hasMultiRoomSelection ? (
              <div className="space-y-3 border-b border-border-dark/40 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium">
                    Selected Chambers ({totalChambersCount})
                  </span>
                  <span className="text-[10px] text-text-gray/70 font-mono">
                    {selectedBranch.title}
                  </span>
                </div>
                <div className="space-y-2">
                  {multiRoomItems.map((item) => (
                    <div
                      key={item.room.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-bg-dark/40 border border-border-dark/40 text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-bg-dark">
                          <Image
                            src={item.room.image}
                            alt={item.room.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-text-offwhite font-light text-xs">
                            {item.count} &times; {item.room.name}
                          </p>
                          <p className="text-[10px] text-text-gray/60 font-sans">
                            {formatPrice(item.room.price)} /night
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-gold text-xs font-medium">
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}
                  {effectiveExtraBeds > 0 && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-dark/40 border border-border-dark/40 text-xs">
                      <span className="text-text-offwhite font-light">
                        {effectiveExtraBeds} &times; Extra Bed Option
                      </span>
                      <span className="font-mono text-gold text-xs font-medium">
                        {formatPrice(effectiveExtraBeds * EXTRA_BED_RATE)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
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
                  <p className="text-[11px] text-gold font-sans font-medium">
                    {selectedBranch.title}
                  </p>
                  <p className="text-[10px] text-text-gray font-sans font-light">
                    {occupancy === "single" ? "Single Occupancy" : "Double Occupancy"}
                    {hasExtraBed ? " + Extra Bed" : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Tariff Breakdown Table */}
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-text-gray font-light">
                <span>Branch Location</span>
                <span className="text-text-offwhite font-medium text-right max-w-[220px] truncate">
                  {selectedBranch.title}
                </span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Check-in Date</span>
                <span className="text-text-offwhite font-medium">{checkIn}</span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Check-out Date</span>
                <span className="text-text-offwhite font-medium">{checkOut}</span>
              </div>
              <div className="flex justify-between text-text-gray font-light">
                <span>Stay Duration</span>
                <span className="text-text-offwhite font-medium">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
              </div>

              <div className="h-px bg-border-dark/30 w-full my-2" />

              {hasMultiRoomSelection ? (
                <div className="flex justify-between text-text-gray font-light">
                  <span>Chambers Subtotal</span>
                  <span className="text-text-offwhite">
                    {formatPrice(perNightTotalRate)} &times; {nights} = {formatPrice(baseTotal)}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-text-gray font-light">
                    <span>
                      {selectedRoom.name} ({occupancy === "single" ? "Single" : "Double"})
                    </span>
                    <span className="text-text-offwhite">
                      {formatPrice(perNightBaseRate)} &times; {nights} = {formatPrice(roomTotal)}
                    </span>
                  </div>

                  {hasExtraBed && (
                    <div className="flex justify-between text-text-gray font-light">
                      <span>Extra Bed</span>
                      <span className="text-text-offwhite">
                        {formatPrice(EXTRA_BED_RATE)} &times; {nights} = {formatPrice(extraBedTotal)}
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between text-text-gray font-light">
                <span>Luxury GST (18%)</span>
                <span className="text-text-offwhite">{formatPrice(luxuryTax)}</span>
              </div>

              <div className="h-px bg-border-dark/40 w-full my-2" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs uppercase tracking-[0.1em] text-text-offwhite font-semibold">
                  Estimated Total
                </span>
                <span className="font-serif text-2xl text-gold font-light">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="pt-2 border-t border-border-dark/40">
              <a
                href={buildWhatsAppUrl({
                  guestName: fullName || "Guest",
                  roomName: hasMultiRoomSelection
                    ? multiRoomItems.map((item) => `${item.count}x ${item.room.name}`).join(", ")
                    : selectedRoom.name,
                  propertyName: selectedBranch.name,
                  occupancyType: hasMultiRoomSelection
                    ? `${totalChambersCount} Chamber(s)`
                    : (occupancy === "single" ? "Single Occupancy" : "Double Occupancy"),
                  extraBeds: effectiveExtraBeds,
                  checkIn: checkIn,
                  checkOut: checkOut,
                  duration: `${nights} nights`,
                  guests: guests,
                  specialRequests: requests,
                  estimatedTotal: formatPrice(grandTotal),
                  branchPhone: selectedBranch.phone,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 rounded-xl text-xs uppercase tracking-wider font-medium transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare size={14} />
                <span>Instant WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          {/* Privileges card */}
          <div className="bg-surface-dark/45 border border-border-dark/60 rounded-2xl p-6 space-y-3 shadow-lg text-xs font-sans">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
              Guest Stay Privileges
            </h4>
            <ul className="space-y-2.5 text-text-gray font-light text-[11px]">
              <li className="flex items-center space-x-2">
                <span className="text-gold">✓</span>
                <span>South Indian Veg Buffet Breakfast Included</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gold">✓</span>
                <span>High-Speed Wi-Fi & In-Room Mini Bar</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gold">✓</span>
                <span>24/7 Room Service & Round-the-clock Desk</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gold">✓</span>
                <span>Direct Helpline: +91 98847 62222</span>
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
          <span>Back to Rooms</span>
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
