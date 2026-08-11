"use client";

import { useRouter } from "next/navigation";
import { Branch } from "@/lib/data";
import { MapPin, Check } from "lucide-react";

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
      <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-medium block">
        Select Property Branch
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {branches.map((branch) => {
          const isSelected = branch.id === selectedBranchId;
          return (
            <button
              key={branch.id}
              onClick={() => router.push(`/rooms/${roomSlug}?branch=${branch.id}`)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer w-full focus:outline-none ${
                isSelected
                  ? "border-gold bg-gold/[0.03] text-text-offwhite shadow-lg"
                  : "border-border-dark/80 bg-bg-dark/20 text-text-gray hover:border-gold/45 hover:text-text-offwhite"
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-serif text-base font-light transition-colors ${isSelected ? "text-gold" : "text-text-offwhite group-hover:text-gold"}`}>
                    {branch.name.split(" — ")[1] || branch.name}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-gold text-bg-dark flex items-center justify-center shrink-0">
                      <Check size={10} className="stroke-[2.5]" />
                    </span>
                  )}
                </div>

              </div>
              <div className="w-full flex items-start text-[9px] text-text-gray/50 border-t border-border-dark/30 pt-2.5 mt-auto">
                <MapPin size={10} className="mr-1 text-gold/60 shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
