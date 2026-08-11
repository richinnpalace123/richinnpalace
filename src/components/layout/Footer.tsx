"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Plus, Minus } from "lucide-react";
import { hotelDetails, branches } from "@/lib/data";
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

  if (
    pathname?.startsWith("/rooms") ||
    pathname?.startsWith("/branches") ||
    pathname === "/booking" ||
    pathname === "/checkout" ||
    pathname === "/thank-you"
  ) {
    return null;
  }

  return (
    <footer className="bg-surface-dark border-t border-border-dark text-text-offwhite font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-32 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl tracking-[0.15em] text-gold">Rich Inn Palace</h3>
              <p className="text-xs tracking-[0.05em] text-text-gray font-light max-w-xs leading-relaxed">
                Executive & Suite accommodations across 3 prime Chennai locations. Complimentary South Indian buffet breakfast and 24/7 room service included.
              </p>
            </div>

            {/* Google Review Badge */}
            <div className="pt-1">
              <a
                href={hotelDetails.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
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
              {branches.map((branch) => (
                <li key={branch.id}>
                  <Link
                    href={`/branches/${branch.slug}`}
                    className="text-[11px] tracking-[0.05em] text-text-gray hover:text-gold transition-colors duration-300 block"
                  >
                    <span className="block font-medium text-text-offwhite/90">{branch.name}</span>
                    <span className="text-[9px] text-text-gray/50 block mt-0.5">{branch.address}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="border-b border-border-dark/40 pb-5 md:border-b-0 md:pb-0 md:space-y-4">
            <button
              onClick={() => toggleSection("sanctuary")}
              className="w-full flex items-center justify-between text-left focus:outline-none md:pointer-events-none md:cursor-default py-2 md:py-0"
            >
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Quick Links</h4>
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
                  Rooms & Tariffs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs tracking-[0.1em] text-text-gray hover:text-gold transition-colors duration-300">
                  Branches & Contact
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
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Reservations Desk</h4>
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
                  className="hover:text-gold transition-colors duration-300 font-medium"
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
                <span>Chennai: T. Nagar & Vadapalani</span>
              </li>
            </ul>
          </div>

          {/* Direct Help / Booking Invitation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Direct Booking</h4>
            <p className="text-xs tracking-[0.05em] text-text-gray font-light leading-relaxed">
              Book directly on our website or contact our helpline for best available tariffs with zero commission fees.
            </p>
            <div className="pt-2">
              <Link
                href="/booking"
                className="w-full py-2.5 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-md hover:bg-gold-hover transition-colors duration-300 cursor-pointer block text-center"
              >
                Reserve Now
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-dark mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.15em] text-text-gray font-light">
            &copy; {currentYear} RICH INN PALACE CHENNAI. ALL RIGHTS RESERVED.
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
