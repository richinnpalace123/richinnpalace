"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { branches, Branch, RoomVariety, EXTRA_BED_RATE } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Users,
  Info,
  Check,
  Plus,
  Minus,
  MessageSquare,
  Coffee,
  Wifi,
  Clock,
  Wine,
  Phone,
  BedDouble,
  Maximize2,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import LuxuryImageSlider from "@/components/common/LuxuryImageSlider";
import GuestBookingModal from "@/components/booking/GuestBookingModal";

function RoomVarietyMedia({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 200px"
        className="object-cover"
      />
    </div>
  );
}

export default function RoomsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialBranchId = useMemo(() => {
    const branchParam = searchParams.get("branch");
    if (branchParam && branches.some((b) => b.id === branchParam || b.slug === branchParam)) {
      return branchParam;
    }
    return branches[0].id;
  }, [searchParams]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);

  const selectedBranch = useMemo(() => {
    return branches.find((b) => b.id === selectedBranchId || b.slug === selectedBranchId) || branches[0];
  }, [selectedBranchId]);

  const getTomorrowString = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTomorrowString(1));
  const [checkOut, setCheckOut] = useState(getTomorrowString(2));

  // Multi-room selection counts: Map from roomVariety.id to quantity
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(() => {
    const firstRoom = selectedBranch.roomVarieties[0];
    return firstRoom ? { [firstRoom.id]: 1 } : {};
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Extra bed count
  const [extraBeds, setExtraBeds] = useState<number>(0);
  const [guests, setGuests] = useState<number>(2);

  const handleRoomCountChange = (roomId: string, delta: number) => {
    setSelectedRooms((prev) => {
      const current = prev[roomId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [roomId]: next };
      if (next === 0) {
        delete updated[roomId];
      }
      return updated;
    });
  };

  const totalSelectedRoomsCount = useMemo(() => {
    return Object.values(selectedRooms).reduce((sum, count) => sum + count, 0);
  }, [selectedRooms]);

  // Derived nights
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
  const perNightRoomsTotal = useMemo(() => {
    return selectedBranch.roomVarieties.reduce((sum, room) => {
      const count = selectedRooms[room.id] || 0;
      return sum + room.price * count;
    }, 0);
  }, [selectedBranch.roomVarieties, selectedRooms]);

  const perNightExtraBedTotal = extraBeds * EXTRA_BED_RATE;
  const perNightGrandRate = perNightRoomsTotal + perNightExtraBedTotal;

  const baseTotal = perNightGrandRate * nights;
  const luxuryTax = Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + luxuryTax;

  const selectedRoomsSummaryList = useMemo(() => {
    return selectedBranch.roomVarieties
      .filter((r) => (selectedRooms[r.id] || 0) > 0)
      .map((r) => ({
        room: r,
        count: selectedRooms[r.id],
        total: r.price * selectedRooms[r.id],
      }));
  }, [selectedBranch.roomVarieties, selectedRooms]);

  const handleBookSanctuary = () => {
    const query = new URLSearchParams({
      branch: selectedBranch.id,
      checkin: checkIn,
      checkout: checkOut,
      extrabeds: String(extraBeds),
      rooms: JSON.stringify(selectedRooms),
      guests: String(guests),
    });
    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-20 md:pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Top Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT COLUMN: Main Details & Room Selection */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">

            {/* Title & Core Description */}
            <div className="space-y-2">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium block">
                {selectedBranch.area.toUpperCase()} · CHENNAI SANCTUARY
              </span>
              <div className="flex items-center justify-between gap-3 w-full">
                <h1 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-tight">
                  {selectedBranch.title}
                </h1>
                {selectedBranch.googleMapsUrl && (
                  <a
                    href={selectedBranch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex sm:inline-flex items-center justify-center sm:space-x-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 border border-border-dark hover:border-gold/40 text-text-offwhite text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-all duration-300 hover:text-gold cursor-pointer shrink-0"
                  >
                    <MapPin size={14} className="text-gold" />
                    <span className="hidden sm:inline">Google Maps</span>
                  </a>
                )}
              </div>
            </div>


            {/* Top Professional Luxury Image Slider */}
            <div className="w-full">
              <LuxuryImageSlider
                images={selectedBranch.gallery}
                title={selectedBranch.title}
                badge={`${selectedBranch.area} SANCTUARY`}
              />
            </div>

            {/* LIST OF ROOMS WITH MULTI-SELECTION & EXTRA BED */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-dark/40 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium block">
                  Select Room Options &amp; Quantities
                </span>
                <span className="text-xs text-text-gray/60 font-mono">
                  Select as many as you need
                </span>
              </div>

              <div className="space-y-4">
                {selectedBranch.roomVarieties.map((room, index) => {
                  const qty = selectedRooms[room.id] || 0;
                  const isSelected = qty > 0;

                  return (
                    <div
                      key={room.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-surface-dark border-gold/60 shadow-[0_0_20px_rgba(199,168,109,0.1)]"
                          : "bg-surface-dark/30 border-border-dark/60 hover:border-gold/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        {/* Room Info */}
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded bg-gold/15 text-gold inline-block">
                            {room.roomType} · {room.occupancy}
                          </span>
                          <h3 className="font-serif text-base sm:text-lg text-text-offwhite font-light">
                            {index + 1}) {room.name}
                          </h3>
                          <div className="flex items-center space-x-3 text-[10px] text-text-gray/70 font-sans">
                            <span>{room.size}</span>
                            <span>·</span>
                            <span>{room.bed}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Quantity Selector */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-dark/40">
                        <div className="text-left sm:text-right">
                          <span className="font-serif text-lg sm:text-xl text-gold font-light block">
                            {room.priceDisplay}
                          </span>
                          <span className="text-[9px] text-text-gray/50 font-sans block">
                            per night
                          </span>
                        </div>

                        {/* Counter Controls */}
                        <div className="flex items-center space-x-2.5 bg-bg-dark border border-border-dark rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => handleRoomCountChange(room.id, -1)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-lg border border-border-dark/60 flex items-center justify-center text-text-gray hover:text-gold hover:border-gold disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-mono text-sm text-text-offwhite font-semibold w-6 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRoomCountChange(room.id, 1)}
                            className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-bg-dark transition-all cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EXTRA BED SELECTOR OPTION */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-dark/40 border border-border-dark/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-offwhite font-medium block">
                    Extra Bed Option (₹{selectedBranch.extraBedRate} / night)
                  </span>
                  <span className="text-[10px] text-text-gray/70 font-sans">
                    Add extra rollaway beds for additional guests or family
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 bg-bg-dark border border-border-dark rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setExtraBeds((prev) => Math.max(0, prev - 1))}
                    disabled={extraBeds === 0}
                    className="w-8 h-8 rounded-lg border border-border-dark/60 flex items-center justify-center text-text-gray hover:text-gold hover:border-gold disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-mono text-sm text-text-offwhite font-semibold w-6 text-center">
                    {extraBeds}
                  </span>
                  <button
                    type="button"
                    onClick={() => setExtraBeds((prev) => prev + 1)}
                    className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-bg-dark transition-all cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chamber Specifications */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                Chamber Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-y-4 gap-x-8 border border-border-dark/65 rounded-2xl p-4 sm:p-6 bg-surface-dark/30">
                <div className="flex justify-between items-center py-2 border-b border-border-dark/30 sm:border-r sm:pr-8">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-text-gray/70 font-sans">
                    Bed Configuration
                  </span>
                  <span className="text-[11px] sm:text-xs text-text-offwhite font-sans font-light text-right pl-4">
                    Plush Queen / Imperial King
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-dark/30 sm:pl-8">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-text-gray/70 font-sans">
                    Room Size
                  </span>
                  <span className="text-[11px] sm:text-xs text-text-offwhite font-sans font-light text-right pl-4">
                    360 SF - 540 SF
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b sm:border-b-0 border-border-dark/30 sm:border-r sm:pr-8">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-text-gray/70 font-sans">
                    Breakfast
                  </span>
                  <span className="text-[11px] sm:text-xs text-text-offwhite font-sans font-light text-right pl-4">
                    South Indian Buffet Included
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:pl-8">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-text-gray/70 font-sans">
                    Room Service
                  </span>
                  <span className="text-[11px] sm:text-xs text-text-offwhite font-sans font-light text-right pl-4">
                    Available 24/7 Daily
                  </span>
                </div>
              </div>
            </div>

            {/* Bespoke Amenities */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                Bespoke Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {selectedBranch.inclusions.map((inclusion, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-text-gray/90 text-xs sm:text-sm font-sans font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span className="capitalize">{inclusion}</span>
                  </div>
                ))}
                <div className="flex items-center space-x-3 text-text-gray/90 text-xs sm:text-sm font-sans font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>24-Hour Flexible Check-in &amp; Check-out</span>
                </div>
                <div className="flex items-center space-x-3 text-text-gray/90 text-xs sm:text-sm font-sans font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>Extra Bed Available (₹{selectedBranch.extraBedRate}/night)</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY CHECKOUT PANEL */}
          <div className="lg:col-span-4 lg:relative">
            <div className="lg:sticky lg:top-28">
              <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                {/* Price Heading */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-gray/70">
                    Sanctuary Rate
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-2xl md:text-3xl text-gold font-light">
                      {formatPrice(perNightGrandRate > 0 ? perNightGrandRate : selectedBranch.startingPrice)}
                    </span>
                    <span className="text-[10px] font-sans text-text-gray/50 block font-light">
                      per night (excl. tax)
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border-dark/60 w-full" />

                {/* Dates Selector */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Check In */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                        <Calendar size={11} className="mr-1.5" />
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
                        className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full [color-scheme:dark]"
                      />
                    </div>

                    {/* Check Out */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                        <Calendar size={11} className="mr-1.5" />
                        Check Out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Guests Selector */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                      <Users size={11} className="mr-1.5" />
                      Guests Count
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                      className="bg-bg-dark border border-border-dark rounded-lg p-2.5 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors cursor-pointer w-full"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6 Guests</option>
                      <option value={7}>7 Guests</option>
                      <option value={8}>8 Guests</option>
                      <option value={9}>9 Guests</option>
                      <option value={10}>10+ Guests</option>
                    </select>
                  </div>

                  {/* Selected Rooms List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium flex items-center">
                      <Users size={11} className="mr-1.5" />
                      Selected Chambers ({totalSelectedRoomsCount})
                    </span>

                    {selectedRoomsSummaryList.length > 0 ? (
                      <div className="space-y-1.5 bg-bg-dark/60 rounded-xl p-3 border border-border-dark/50 text-xs">
                        {selectedRoomsSummaryList.map((item) => (
                          <div key={item.room.id} className="flex justify-between text-text-gray font-light">
                            <span>
                              {item.count} &times; {item.room.name}
                            </span>
                            <span className="text-text-offwhite font-medium">
                              {formatPrice(item.total)}
                            </span>
                          </div>
                        ))}
                        {extraBeds > 0 && (
                          <div className="flex justify-between text-text-gray font-light pt-1 border-t border-border-dark/30">
                            <span>{extraBeds} &times; Extra Bed</span>
                            <span className="text-text-offwhite font-medium">
                              {formatPrice(extraBeds * EXTRA_BED_RATE)}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-text-gray/50 italic bg-bg-dark/40 p-2.5 rounded-lg border border-border-dark/30">
                        Please select at least 1 room option on the left.
                      </p>
                    )}
                  </div>
                </div>

                {/* Calculations Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs text-text-gray font-light">
                    <span>
                      {formatPrice(perNightGrandRate)} &times; {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="text-text-offwhite font-medium">{formatPrice(baseTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-gray font-light">
                    <span className="flex items-center">
                      Luxury GST (18%)
                      <span className="ml-1 text-text-gray/40 cursor-help" title="Standard GST for luxury hotel tariffs">
                        <Info size={11} />
                      </span>
                    </span>
                    <span className="text-text-offwhite font-medium">{formatPrice(luxuryTax)}</span>
                  </div>

                  <div className="h-px bg-border-dark/40 w-full my-2" />

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs uppercase tracking-[0.15em] text-text-offwhite font-medium">
                      Total Estimate
                    </span>
                    <span className="font-serif text-2xl text-gold font-light">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleBookSanctuary}
                  disabled={totalSelectedRoomsCount === 0}
                  className="w-full py-4 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.3)] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Book Your Stay
                </button>

                {/* Micro Copy */}
                <div className="text-[10px] text-text-gray/60 text-center font-light leading-relaxed">
                  No upfront payment required today. Direct enquiry review by desk concierge.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
