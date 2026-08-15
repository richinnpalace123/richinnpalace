import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Map, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { branches } from "@/lib/data";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Branch Locations | Rich Inn Palace Chennai",
  description:
    "Get in touch with Rich Inn Palace Chennai. Explore our 3 branches in T. Nagar (Rangan St & Pondy Bazaar) and Vadapalani (Saligramam). Call +91 98847 62222 for instant reservations.",
  keywords: [
    "Contact Rich Inn Palace Chennai",
    "Rich Inn Palace T. Nagar Address",
    "Rich Inn Palace Vadapalani",
    "Rich Inn Palace Phone Number 9884762222",
    "T.Nagar Hotel Contact",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/contact`,
  },
  openGraph: {
    title: "Contact & Branch Locations | Rich Inn Palace Chennai",
    description:
      "Get in touch with Rich Inn Palace Chennai. 3 prime branches in T. Nagar & Vadapalani.",
    url: `${SITE_CONFIG.domain}/contact`,
    siteName: "Rich Inn Palace Hotel",
    images: [
      {
        url: "/images/rangon_street/1.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact Rich Inn Palace Chennai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Locations | Rich Inn Palace Chennai",
    description:
      "Get in touch with Rich Inn Palace Chennai. Inquire about rooms, corporate stays, and reservations.",
    images: ["/images/rangon_street/1.jpeg"],
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Rich Inn Palace Chennai",
    "telephone": "+91 98847 62222",
    "email": SITE_CONFIG.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rangan Street & Rajabather Street (Pondy Bazaar), T. Nagar / Saligramam, Vadapalani",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600017",
      "addressCountry": "IN"
    },
    "url": `${SITE_CONFIG.domain}/contact`
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-28 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3 block">
            GET IN TOUCH &amp; LOCATIONS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-text-offwhite font-light tracking-wide mb-6">
            Our 3 Chennai Branches &amp; <br /> Concierge Care.
          </h1>
          <p className="font-sans text-sm md:text-base text-text-gray font-light leading-relaxed">
            Rich Inn Palace operates across three convenient locations in Chennai: Rangan Street (T. Nagar), Rajabather Street (Pondy Bazaar, T. Nagar), and Saligramam (Vadapalani). Contact our central reservations desk at <span className="text-gold font-medium">+91 98847 62222</span> for immediate availability and customized group bookings.
          </p>
        </div>

        {/* 3 Branches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 space-y-4 hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[8px] uppercase tracking-wider font-semibold rounded bg-gold/15 text-gold">
                    {branch.area}
                  </span>
                  <span className="text-[10px] text-text-gray/50 font-mono">24/7 Desk</span>
                </div>
                <h3 className="font-serif text-xl text-text-offwhite font-light">
                  {branch.title}
                </h3>
                <a
                  href={branch.googleMapsUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-gray hover:text-gold transition-colors leading-relaxed font-light block underline decoration-gold/30 underline-offset-4 hover:decoration-gold"
                >
                  {branch.address}
                </a>
              </div>

              <div className="pt-4 border-t border-border-dark/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-gray/70">Phone:</span>
                  <a
                    href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                    className="text-gold hover:underline font-medium"
                  >
                    {branch.phone}
                  </a>
                </div>
                {branch.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-[11px] text-text-offwhite hover:text-gold transition-colors pt-1"
                  >
                    <Map size={12} className="text-gold" />
                    <span>View on Google Maps &rarr;</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-8 space-y-6">
              <h2 className="font-serif text-2xl text-text-offwhite font-light border-b border-border-dark/40 pb-4">
                Central Reservations
              </h2>
              
              <div className="space-y-4 text-xs font-sans text-text-gray">
                <div className="flex items-center space-x-4 pt-2">
                  <Phone className="text-gold shrink-0" size={16} />
                  <div>
                    <span className="text-text-gray/60 block text-[9px] uppercase tracking-wider">Direct Booking Desk (Call)</span>
                    <a href="tel:+919884762222" className="text-text-offwhite hover:text-gold transition-colors font-medium text-sm">
                      +91 98847 62222
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <MessageSquare className="text-gold shrink-0" size={16} />
                  <div>
                    <span className="text-text-gray/60 block text-[9px] uppercase tracking-wider">WhatsApp Enquiry</span>
                    <a href="https://wa.me/918189999227" target="_blank" rel="noopener noreferrer" className="text-text-offwhite hover:text-gold transition-colors font-medium text-sm">
                      +91 81899 99227
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <Mail className="text-gold shrink-0" size={16} />
                  <div>
                    <span className="text-text-gray/60 block text-[9px] uppercase tracking-wider">Direct Concierge Email</span>
                    <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-text-offwhite hover:text-gold transition-colors font-medium">
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pt-2 border-t border-border-dark/40">
                  <Clock className="text-gold shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="text-text-offwhite font-medium block">Check-in Flexibility</span>
                    <p className="text-[11px] text-text-gray/80 mt-0.5">True 24-Hour Check-in &amp; Check-out Available</p>
                    <p className="text-[10px] text-text-gray/50 mt-0.5">Front Concierge &amp; Room Service operate 24 Hours daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Advice Card */}
            <div className="border border-border-dark/60 bg-surface-dark/30 rounded-2xl p-6 space-y-3 text-xs font-sans text-text-gray">
              <div className="flex items-center space-x-2 text-gold">
                <ShieldCheck size={16} />
                <span className="uppercase font-medium tracking-wider text-[10px]">Prime Connectivity</span>
              </div>
              <p className="leading-relaxed font-light text-[11px]">
                Both T. Nagar and Vadapalani locations offer rapid access to Chennai Central, Egmore, and Chennai International Airport (MAA).
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-dark border border-border-dark/60 rounded-2xl p-8 md:p-10 space-y-6">
            <h2 className="font-serif text-2xl text-text-offwhite font-light">
              Send a Concierge Inquiry
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
