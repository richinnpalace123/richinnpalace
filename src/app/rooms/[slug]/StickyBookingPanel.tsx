"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Calendar, Users, Info, BedDouble, Check } from "lucide-react";
import { rooms, branches, getRoomPrice, EXTRA_BED_RATE } from "@/lib/data";
import { trackBookNowClick } from "@/lib/analytics";

interface StickyBookingPanelProps {
  roomPrice: number;
  roomId: string;
  selectedBranchId?: string;
}

export default function StickyBookingPanel({ roomId, selectedBranchId = "tnagar-rangan" }: StickyBookingPanelProps) {
  const router = useRouter();

  const getTomorrowString = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTomorrowString(1));
  const [checkOut, setCheckOut] = useState(getTomorrowString(2));
  const [occupancy, setOccupancy] = useState<"single" | "double">("double");
  const [hasExtraBed, setHasExtraBed] = useState(false);
  const [guests, setGuests] = useState(2);

  const activeRoom = rooms.find((r) => r.id === roomId || r.slug === roomId) || rooms[0];
  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Dynamic tariff based on branch & occupancy
  const perNightRoomRate = useMemo(() => {
    return getRoomPrice(activeRoom.id, activeBranch.id, occupancy);
  }, [activeRoom.id, activeBranch.id, occupancy]);

  const perNightExtraBedRate = hasExtraBed ? EXTRA_BED_RATE : 0;
  const perNightTotalRate = perNightRoomRate + perNightExtraBedRate;

  // Calculate nights
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  }, [checkIn, checkOut]);

  // Calculations
  const roomTotal = perNightRoomRate * nights;
  const extraBedTotal = perNightExtraBedRate * nights;
  const baseTotal = roomTotal + extraBedTotal;
  const luxuryTax = Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + luxuryTax;

  const handleBookNow = () => {
    trackBookNowClick("room_detail", activeRoom.id);
    const branchQuery = selectedBranchId ? `&branch=${selectedBranchId}` : "";
    const extraBedQuery = hasExtraBed ? `&extrabed=1` : "";
    router.push(
      `/booking?room=${activeRoom.id}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}&occupancy=${occupancy}${branchQuery}${extraBedQuery}`
    );
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Branch & Tariff Indicator */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-text-gray/70 block">
          Tariff for {activeBranch.title}
        </span>
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-2xl md:text-3xl text-gold font-light">
            {formatPrice(perNightTotalRate)}
          </span>
          <span className="text-[10px] font-sans text-text-gray/50 font-light">
            /night (excl. 18% GST)
          </span>
        </div>
      </div>

      <div className="h-px bg-border-dark/60 w-full" />

      {/* Occupancy Selector */}
      <div className="space-y-2">
        <label className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium block">
          Occupancy
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setOccupancy("single");
              setGuests(1);
            }}
            className={`py-2 px-3 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
              occupancy === "single"
                ? "bg-gold/15 border-gold text-gold font-medium"
                : "bg-bg-dark border-border-dark text-text-gray hover:border-gold/40"
            }`}
          >
            Single ({formatPrice(getRoomPrice(activeRoom.id, activeBranch.id, "single"))})
          </button>
          <button
            type="button"
            onClick={() => {
              setOccupancy("double");
              setGuests(2);
            }}
            className={`py-2 px-3 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
              occupancy === "double"
                ? "bg-gold/15 border-gold text-gold font-medium"
                : "bg-bg-dark border-border-dark text-text-gray hover:border-gold/40"
            }`}
          >
            Double ({formatPrice(getRoomPrice(activeRoom.id, activeBranch.id, "double"))})
          </button>
        </div>
      </div>

      {/* Extra Bed Toggle */}
      <div className="pt-1">
        <label
          onClick={() => setHasExtraBed(!hasExtraBed)}
          className="flex items-center justify-between p-2.5 rounded-lg bg-bg-dark border border-border-dark/70 hover:border-gold/40 transition-colors cursor-pointer text-xs"
        >
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasExtraBed}
              onChange={(e) => setHasExtraBed(e.target.checked)}
              className="accent-gold cursor-pointer"
            />
            <span className="text-text-offwhite text-[11px]">Extra Bed (+₹700/nt)</span>
          </div>
          <span className="text-[10px] text-gold font-mono">₹700</span>
        </label>
      </div>

      {/* Date controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {/* Check In */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium flex items-center">
              <Calendar size={10} className="mr-1 text-gold" />
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
              className="bg-bg-dark border border-border-dark rounded-lg p-2 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full [color-scheme:dark]"
            />
          </div>

          {/* Check Out */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-text-gray font-medium flex items-center">
              <Calendar size={10} className="mr-1 text-gold" />
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-bg-dark border border-border-dark rounded-lg p-2 text-xs text-text-offwhite font-sans focus:outline-none focus:border-gold transition-colors w-full [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Inclusions summary */}
      <div className="p-3 rounded-lg bg-gold/5 border border-gold/15 text-[10px] text-text-gray space-y-1">
        <div className="text-gold font-medium uppercase tracking-wider text-[9px]">Included With Stay:</div>
        <div className="flex items-center text-text-offwhite">✓ Complimentary South Indian Buffet Breakfast</div>
        <div className="flex items-center text-text-offwhite">✓ High-Speed Wi-Fi & 24/7 Room Service</div>
      </div>

      {/* Calculations Breakdown */}
      <div className="space-y-2.5 pt-1 text-xs">
        <div className="flex justify-between text-text-gray font-light">
          <span>
            {formatPrice(perNightRoomRate)} &times; {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span className="text-text-offwhite font-medium">{formatPrice(roomTotal)}</span>
        </div>

        {hasExtraBed && (
          <div className="flex justify-between text-text-gray font-light">
            <span>Extra Bed ({formatPrice(EXTRA_BED_RATE)} &times; {nights})</span>
            <span className="text-text-offwhite font-medium">{formatPrice(extraBedTotal)}</span>
          </div>
        )}

        <div className="flex justify-between text-text-gray font-light">
          <span className="flex items-center">
            Luxury GST (18%)
            <span className="ml-1 text-text-gray/40 cursor-help" title="Standard GST for luxury hotel tariffs">
              <Info size={11} />
            </span>
          </span>
          <span className="text-text-offwhite font-medium">{formatPrice(luxuryTax)}</span>
        </div>

        <div className="h-px bg-border-dark/40 w-full my-1.5" />

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
        onClick={handleBookNow}
        className="w-full py-3.5 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.3)] cursor-pointer"
      >
        Continue to Reserve
      </button>

      <div className="text-[10px] text-text-gray/60 text-center font-light leading-relaxed">
        Direct helpline: <a href="tel:+919884762222" className="text-gold hover:underline font-medium">+91 98847 62222</a>
      </div>
    </div>
  );
}
