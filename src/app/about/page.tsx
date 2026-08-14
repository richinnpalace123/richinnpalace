import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Sparkles, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Heritage & Philosophy | Rich Inn Palace Chennai",
  description:
    "Discover the story of Rich Inn Palace Chennai. Est. 2001, twenty-eight residential chambers offer unhurried sanctuary luxury in T.Nagar.",
  keywords: [
    "About Rich Inn Palace Chennai",
    "Tamil Nadu Heritage Hotel Story",
    "T.Nagar Architecture Resort",
    "Chennai Luxury Sanctuary Philosophy",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about`,
  },
  openGraph: {
    title: "Heritage & Philosophy | Rich Inn Palace Chennai",
    description:
      "Discover the story of Rich Inn Palace Chennai. Established in 2001.",
    url: `${SITE_CONFIG.domain}/about`,
    siteName: "Rich Inn Palace Hotel",
    images: [
      {
        url: "/images/rangon_street/1.jpeg",
        width: 1200,
        height: 630,
        alt: "Rich Inn Palace Heritage & Story",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage & Philosophy | Rich Inn Palace Chennai",
    description:
      "Discover the story of Rich Inn Palace Chennai. Established in 2001.",
    images: ["/images/rangon_street/1.jpeg"],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-bg-dark min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="mb-20 max-w-3xl">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3 block">
            OUR MANIFESTO & ORIGINS · ESTD. 2001
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-text-offwhite font-light tracking-wide mb-8 leading-tight">
            A sanctuary where time <br />
            slowly yields to light.
          </h1>
          <p className="font-sans text-base md:text-lg text-text-gray font-light leading-relaxed">
            Established in 2001, Rich Inn Palace was conceived not as a traditional hotel, but as a silent sanctuary of twenty-eight keys. Set in central T.Nagar, our retreat offers an unhurried haven for the creative traveler.
          </p>
        </div>

        {/* Feature Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-dark border border-border-dark/50">
            <Image
              src="/images/rangon_street/1.jpeg"
              alt="Courtyard at Rich Inn Palace Chennai"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-dark border border-border-dark/50">
            <Image
              src="/images/pondy_bazaar/1.jpeg"
              alt="Private Suite Architecture Rich Inn Palace Chennai"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Story Content Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="lg:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium block mb-2">
              01 · ARCHITECTURE
            </span>
            <h2 className="font-serif text-3xl text-text-offwhite font-light">
              Crafted Wood & Natural Plaster
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-sm text-text-gray font-light leading-relaxed">
            <p>
              Crafted by master artisans using teak wood and lime plaster walls, every corner at Rich Inn Palace is designed for serene ventilation. This architectural technique allows indoor spaces to remain naturally cool and comfortable.
            </p>
            <p>
              Hand-carved wooden screens filter afternoon sunlight into soft geometric shadows, creating calm, meditative spaces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="lg:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium block mb-2">
              02 · PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl text-text-offwhite font-light">
              Unhurried Butler Care & Intimacy
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-sm text-text-gray font-light leading-relaxed">
            <p>
              By restricting our footprint strictly to twenty-eight residential chambers, we guarantee an atmosphere free from noise or rush. Each guest receives dedicated butler care overseeing dining preferences, customized room scents, and private excursions across Chennai.
            </p>
            <p>
              Whether enjoying morning coffee in your private courtyard or unwinding in a plunge pool, your stay is tailored with absolute discretion and warmth.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 space-y-3">
            <ShieldCheck className="text-gold" size={24} />
            <h3 className="font-serif text-xl text-text-offwhite font-light">Private Haven</h3>
            <p className="text-xs text-text-gray font-light leading-relaxed">
              Gated security, private entrances, and exclusive access reserved solely for resident keyholders.
            </p>
          </div>
          <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 space-y-3">
            <HeartHandshake className="text-gold" size={24} />
            <h3 className="font-serif text-xl text-text-offwhite font-light">Butler Care</h3>
            <p className="text-xs text-text-gray font-light leading-relaxed">
              Dedicated butler support for itinerary curation, dining, and personalized turndown service.
            </p>
          </div>
          <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 space-y-3">
            <Sparkles className="text-gold" size={24} />
            <h3 className="font-serif text-xl text-text-offwhite font-light">Local Heritage</h3>
            <p className="text-xs text-text-gray font-light leading-relaxed">
              Handcrafted teak furniture, cotton linens, and authentic culinary traditions.
            </p>
          </div>
          <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 space-y-3">
            <Compass className="text-gold" size={24} />
            <h3 className="font-serif text-xl text-text-offwhite font-light">Urban Retreat</h3>
            <p className="text-xs text-text-gray font-light leading-relaxed">
              Convenient central T.Nagar location with peaceful courtyard gardens.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-10 text-center space-y-6">
          <h2 className="font-serif text-3xl text-text-offwhite font-light">
            Plan Your Journey to Rich Inn Palace
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              href="/rooms"
              className="px-6 py-3 border border-border-dark text-xs uppercase tracking-[0.2em] text-text-offwhite hover:border-gold hover:text-gold transition-colors rounded-full"
            >
              View Chambers
            </Link>
            <Link
              href="/booking"
              className="px-6 py-3 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover transition-colors"
            >
              Reserve Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
