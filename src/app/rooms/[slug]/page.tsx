import Link from "next/link";
import { notFound } from "next/navigation";
import { rooms } from "@/lib/data";
import { Landmark, MapPin } from "lucide-react";
import AccordionFAQ from "./AccordionFAQ"; // Client component for FAQ interactivity
import StickyBookingPanel from "./StickyBookingPanel"; // Client component for sticky calculations
import RoomGallery from "./RoomGallery"; // Client component for gallery interactivity
import BranchDropdownSelector from "@/components/common/BranchDropdownSelector";
import { SITE_CONFIG } from "@/lib/config";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ branch?: string }>;
}

// Enable Next.js Static Generation
export async function generateStaticParams() {
  return rooms.map((room) => ({
    slug: room.slug,
  }));
}

// Dynamic page metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  
  if (!room) return {};

  const roomUrl = `${SITE_CONFIG.domain}/rooms/${slug}`;

  return {
    title: `${room.name} | Rich Inn Palace Chennai`,
    description: room.longDescription.slice(0, 155) + "...",
    keywords: [room.name, "Rich Inn Palace Chennai", "Luxury Suite Chennai", room.tag, "Tamil Nadu Boutique Hotel"],
    alternates: {
      canonical: roomUrl,
    },
    openGraph: {
      title: `${room.name} | Rich Inn Palace Chennai`,
      description: room.longDescription.slice(0, 155) + "...",
      url: roomUrl,
      siteName: "Rich Inn Palace Hotel",
      images: [
        {
          url: room.image,
          width: 1200,
          height: 630,
          alt: `${room.name} at Rich Inn Palace Chennai`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${room.name} | Rich Inn Palace Chennai`,
      description: room.longDescription.slice(0, 155) + "...",
      images: [room.image],
    },
  };
}

export default async function RoomDetailsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { branch: selectedBranchId } = await searchParams;
  const room = rooms.find((r) => r.slug === slug);

  if (!room) {
    notFound();
  }

  // Determine active branch, default to the first branch if none is explicitly selected
  const activeBranch = room.branches?.find((b) => b.id === selectedBranchId) || room.branches?.[0];

  // Structured Data for HotelRoom & BreadcrumbList
  const roomJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HotelRoom",
        "@id": `${SITE_CONFIG.domain}/rooms/${slug}#room`,
        "name": room.name,
        "description": room.longDescription,
        "image": room.image,
        "occupancy": {
          "@type": "QuantitativeValue",
          "maxValue": parseInt(room.guests) || 2
        },
        "offers": {
          "@type": "Offer",
          "price": room.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `${SITE_CONFIG.domain}/booking?room=${room.id}`
        },
        "containedInPlace": {
          "@type": "Hotel",
          "name": "Rich Inn Palace Chennai",
          "url": SITE_CONFIG.domain
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_CONFIG.domain}/rooms/${slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_CONFIG.domain
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Rooms",
            "item": `${SITE_CONFIG.domain}/rooms`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": room.name,
            "item": `${SITE_CONFIG.domain}/rooms/${slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-20 md:pt-28 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        

        {/* Gallery Grid */}
        <RoomGallery 
          roomName={room.name} 
          initialImages={room.gallery.length >= 3 ? room.gallery.slice(0, 3) : [room.image, ...room.gallery.slice(1, 3)]} 
        />

        {/* Two Column Layout: Description & Sticky Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-6 md:space-y-16">
            
            {/* Title & Core Description */}
            <div className="space-y-2">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium block">
                {room.tag}
              </span>
              <div className="flex items-center justify-between gap-3 w-full">
                <h1 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-tight">
                  {room.name}
                </h1>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBranch?.address || room.name + " Rich Inn Palace Chennai")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:inline-flex items-center justify-center sm:space-x-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 border border-border-dark hover:border-gold/40 text-text-offwhite text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-all duration-300 hover:text-gold cursor-pointer shrink-0"
                >
                  <MapPin size={14} className="text-gold" />
                  <span className="hidden sm:inline">Google Maps</span>
                </a>
              </div>
            </div>

            {room.branches && room.branches.length > 0 && (
              <BranchDropdownSelector
                branches={room.branches}
                selectedBranchId={activeBranch?.id || ""}
                roomSlug={room.slug}
              />
            )}

            {/* Room Specs Grid */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                Chamber Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-y-4 gap-x-8 border border-border-dark/65 rounded-2xl p-4 sm:p-6 bg-surface-dark/30">
                {room.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border-dark/30 last:border-b-0 sm:last:border-b-0 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-text-gray/70 font-sans">
                      {spec.label}
                    </span>
                    <span className="text-[11px] sm:text-xs text-text-offwhite font-sans font-light text-right pl-4">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                Bespoke Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-text-gray/90 text-xs sm:text-sm font-sans font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Attractions */}
            {room.attractions && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                  Environs & Excursions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {room.attractions.map((attraction, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 sm:p-4 border border-border-dark/50 rounded-xl bg-surface-dark/30 hover:border-gold/20 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <Landmark size={14} className="text-gold stroke-[1.25] shrink-0" />
                        <span className="text-xs text-text-offwhite font-sans font-light">{attraction.name}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-text-gray/60 font-sans">{attraction.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-2xl text-text-offwhite font-light tracking-wide">
                Frequently Asked
              </h3>
              <AccordionFAQ faqs={room.faqs} />
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4 lg:relative">
            <div className="lg:sticky lg:top-28">
              <StickyBookingPanel roomPrice={room.price} roomId={room.id} selectedBranchId={activeBranch?.id} />
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}
