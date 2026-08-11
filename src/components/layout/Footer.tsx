"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Plus, Minus } from "lucide-react";
import { hotelDetails, rooms } from "@/lib/data";
import { usePathname } from "next/navigation";
import { trackPhoneClick, trackEmailClick } from "@/lib/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    branches: false,
    sanctuary: false,
    enquiries: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (pathname?.startsWith("/rooms") || pathname === "/booking") {
    return null;
  }

  return (
    <footer className="bg-surface-dark border-t border-border-dark text-text-offwhite font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-32 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <h3 className="font-serif text-3xl tracking-[0.25em] text-gold">Rich Inn Palace</h3>
              <p className="text-xs tracking-[0.1em] text-text-gray font-light max-w-xs leading-relaxed">
                A quiet sanctuary where Chennai&apos;s heritage is slowly rewritten. Twenty-eight keys of unhurried luxury.
              </p>
            </div>

            {/* Instagram & Google Badges */}
            <div className="flex flex-col space-y-3 pt-2">
              {/* Instagram Badge */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 bg-bg-dark/40 border border-border-dark/65 rounded-xl p-2.5 hover:border-gold/40 hover:bg-gold/[0.02] transition-all duration-300 group max-w-[200px]"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg-dark transition-all duration-300 shrink-0">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-[0.05em] font-sans font-semibold text-text-offwhite group-hover:text-gold transition-colors">Instagram</span>
                  <span className="text-[9px] text-text-gray/65">@richinnpalace</span>
                </div>
              </a>

              {/* Google Reviews Badge */}
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 bg-bg-dark/40 border border-border-dark/65 rounded-xl p-2.5 hover:border-gold/40 hover:bg-gold/[0.02] transition-all duration-300 group max-w-[200px]"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg-dark transition-all duration-300 shrink-0 font-sans font-semibold text-sm">
                  G
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-[0.05em] font-sans font-semibold text-text-offwhite group-hover:text-gold transition-colors">Google Review</span>
                  <span className="text-[9px] text-gold font-medium tracking-wide">5.0 ★★★★★</span>
                </div>
              </a>
            </div>
          </div>

          {/* Branches List Column */}
          <div className="border-b border-border-dark/40 pb-5 md:border-b-0 md:pb-0 md:space-y-4">
            <button
              onClick={() => toggleSection("branches")}
              className="w-full flex items-center justify-between text-left focus:outline-none md:pointer-events-none md:cursor-default py-2 md:py-0"
            >
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Our Branches</h4>
              <span className="text-text-gray md:hidden">
                {openSections.branches ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <ul className={`space-y-3.5 mt-3 md:mt-4 transition-all duration-350 md:block ${openSections.branches ? "block" : "hidden"}`}>
              {rooms.flatMap(r => r.branches).map((branch) => {
                const associatedRoom = rooms.find(r => r.branches.some(b => b.id === branch.id));
                return (
                  <li key={branch.id}>
                    <Link
                      href={`/rooms/${associatedRoom?.slug}?branch=${branch.id}`}
                      className="text-[11px] tracking-[0.05em] text-text-gray hover:text-gold transition-colors duration-300 block"
                    >
                      <span className="block font-medium text-text-offwhite/90">{branch.name.split(" — ")[1] || branch.name}</span>
                      <span className="text-[9px] text-text-gray/50 block mt-0.5">{branch.address.split(",")[1]?.trim() || branch.address.split(",")[0]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="border-b border-border-dark/40 pb-5 md:border-b-0 md:pb-0 md:space-y-4">
            <button
              onClick={() => toggleSection("sanctuary")}
              className="w-full flex items-center justify-between text-left focus:outline-none md:pointer-events-none md:cursor-default py-2 md:py-0"
            >
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Sanctuary</h4>
              <span className="text-text-gray md:hidden">
                {openSections.sanctuary ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <ul className={`space-y-2.5 mt-3 md:mt-4 transition-all duration-350 md:block ${openSections.sanctuary ? "block" : "hidden"}`}>
              <li>
                <Link href="/" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Our Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  About & Manifesto
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Sanctuary Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Location & Contact
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Reserve a Stay
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-b border-border-dark/40 pb-5 md:border-b-0 md:pb-0 md:space-y-4">
            <button
              onClick={() => toggleSection("enquiries")}
              className="w-full flex items-center justify-between text-left focus:outline-none md:pointer-events-none md:cursor-default py-2 md:py-0"
            >
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Enquiries</h4>
              <span className="text-text-gray md:hidden">
                {openSections.enquiries ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <ul className={`space-y-3 text-xs tracking-[0.1em] text-text-gray font-light mt-3 md:mt-4 transition-all duration-350 md:block ${openSections.enquiries ? "block" : "hidden"}`}>
              <li className="flex items-center space-x-3">
                <Phone size={13} className="text-gold shrink-0" />
                <a
                  href={`tel:${hotelDetails.phone.replace(/\s+/g, "")}`}
                  onClick={() => trackPhoneClick("footer")}
                  className="hover:text-gold transition-colors duration-300"
                >
                  {hotelDetails.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={13} className="text-gold shrink-0" />
                <a
                  href={`mailto:${hotelDetails.email}`}
                  onClick={() => trackEmailClick("footer")}
                  className="hover:text-gold transition-colors duration-300"
                >
                  {hotelDetails.email}
                </a>
              </li>
              <li className="flex items-start space-x-3 leading-relaxed">
                <MapPin size={13} className="text-gold shrink-0 mt-0.5" />
                <span>{hotelDetails.address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Booking Invitation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Newsletter</h4>
            <p className="text-xs tracking-[0.1em] text-text-gray font-light leading-relaxed">
              Subscribe to receive private invitations, seasonal offers, and notes on still living.
            </p>
            <form className="flex flex-col space-y-2 pt-1" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full px-4 py-2.5 bg-bg-dark border border-border-dark rounded-md text-xs tracking-[0.15em] placeholder-text-gray/50 focus:outline-none focus:border-gold transition-colors duration-300"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-md hover:bg-gold-hover transition-colors duration-300 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-dark mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.15em] text-text-gray font-light">
            &copy; {currentYear} RICH INN PALACE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6 text-[10px] tracking-[0.15em] text-text-gray font-light">
            <Link href="/privacy" className="hover:text-gold transition-colors duration-300">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors duration-300">
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
