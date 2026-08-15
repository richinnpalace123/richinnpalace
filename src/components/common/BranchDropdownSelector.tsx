"use client";

import { useRouter } from "next/navigation";
import { Branch } from "@/lib/data";
import { MapPin, Check, Phone } from "lucide-react";

interface BranchDropdownSelectorProps {
  branches: Branch[];
  selectedBranchId: string;
  roomSlug: string;
}

export default function BranchDropdownSelector({
  branches,
  selectedBranchId,
  roomSlug,
}: BranchDropdownSelectorProps) {
  const router = useRouter();

  return (
    <div className="space-y-3.5 sm:space-y-4 border border-border-dark/65 rounded-2xl p-4 sm:p-6 bg-surface-dark/20">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium block">
          Available at 3 Chennai Branches
        </span>
        <span className="text-[10px] text-text-gray/60 font-sans">
          Click branch to view tariff
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {branches.map((branch) => {
          const isSelected = branch.id === selectedBranchId;
          return (
            <button
              key={branch.id}
              onClick={() => router.push(`/rooms/${roomSlug}?branch=${branch.id}`, { scroll: false })}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer w-full focus:outline-none ${
                isSelected
                  ? "border-gold bg-gold/[0.08] text-text-offwhite shadow-[0_0_15px_rgba(199,168,109,0.12)]"
                  : "border-border-dark/80 bg-bg-dark/20 text-text-gray hover:border-gold/45 hover:text-text-offwhite"
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded bg-gold/15 text-gold">
                    {branch.area}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-gold text-bg-dark flex items-center justify-center shrink-0">
                      <Check size={10} className="stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <h4 className={`font-serif text-sm font-light transition-colors ${isSelected ? "text-gold" : "text-text-offwhite group-hover:text-gold"}`}>
                  {branch.title}
                </h4>
              </div>

              <div className="w-full text-[9px] text-text-gray/50 border-t border-border-dark/30 pt-2 mt-2 space-y-1">
                <div className="flex items-start">
                  <MapPin size={10} className="mr-1 text-gold/60 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{branch.address}</span>
                </div>
                <div className="flex items-center text-gold/75">
                  <Phone size={9} className="mr-1 shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
