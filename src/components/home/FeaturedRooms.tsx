"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { rooms } from "@/lib/data";
import { ArrowRight, Maximize2, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { trackRoomView, trackBookNowClick } from "@/lib/analytics";

function RoomCardMedia({ src, alt, video }: { src: string; alt: string; video?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 85vw, 30vw"
        className={`object-cover transition-opacity duration-500 ${isHovered && video ? "opacity-0" : "opacity-100"}`}
      />
      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default function FeaturedRooms() {
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: i * 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section id="featured-rooms" className="pt-8 pb-8 md:py-32 bg-bg-dark font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-6 md:mb-10 text-left"
        >
          <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
            02 · FEATURED STAYS
          </h2>
          <h4 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-tight max-w-xl">
            Rooms that keep <br className="hidden md:inline" />
            their own light.
          </h4>
        </motion.div>

        {/* Carousel on Mobile, Grid on Desktop */}
        <div className="relative">
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
            {rooms.slice(0, 3).map((room, index) => (
              <motion.div
                key={room.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="w-[85vw] sm:w-[50vw] md:w-auto shrink-0 snap-start snap-always flex flex-col group cursor-pointer"
              >
                <Link
                  href={`/rooms/${room.slug}`}
                  onClick={() => {
                    trackRoomView(room.id, room.tag, room.price);
                    trackBookNowClick("featured_rooms", room.id);
                  }}
                  className="flex-grow flex flex-col"
                >
                  {/* Image Container with Badges & Video Hover */}
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-surface-dark mb-5">

                    {/* Category floating badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3.5 py-1.5 glass border border-border-dark text-[9px] uppercase tracking-[0.2em] font-sans font-medium text-text-offwhite rounded-full">
                        {room.tag}
                      </span>
                    </div>

                    {/* Room main image / video hover */}
                    <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                      <RoomCardMedia src={room.image} alt={room.name} video={room.video} />
                    </div>

                    {/* Title overlay inside card */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-dark/85 via-bg-dark/10 to-transparent flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                      <h3 className="font-serif text-2xl md:text-3xl text-text-offwhite font-light mb-1.5 group-hover:text-gold transition-colors duration-300">
                        {room.name}
                      </h3>
                      <p className="font-sans text-xs text-text-gray/80 font-light italic">
                        {room.description}
                      </p>
                    </div>
                  </div>

                  {/* Specs & CTA Info row */}
                  <div className="flex items-center justify-between mt-1 px-1 text-text-gray">

                    {/* Price details */}
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-text-gray/60">
                        From
                      </span>
                      <span className="font-serif text-base text-text-offwhite font-light">
                        {formatPrice(room.price)}
                        <span className="font-sans text-[10px] text-text-gray/50 lowercase">
                          /night
                        </span>
                      </span>
                    </div>

                    {/* Dimensions & Guests */}
                    <div className="flex items-center space-x-4 text-[10px] tracking-[0.1em] font-sans font-light">
                      <span className="flex items-center">
                        <Maximize2 size={10} className="mr-1 text-gold/60" />
                        {room.size.replace(" ", "")}
                      </span>
                      <span className="flex items-center">
                        <Users size={10} className="mr-1 text-gold/60" />
                        {room.guests.split(" ")[0]}G
                      </span>
                    </div>

                    {/* Booking Arrow CTA */}
                    <div className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center group-hover:border-gold group-hover:bg-gold group-hover:text-bg-dark transition-all duration-300">
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Explore All Stays CTA */}
        <div className="text-center mt-10 md:mt-20">
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-3 text-xs uppercase tracking-[0.2em] text-gold hover:text-text-offwhite transition-colors duration-300 group"
          >
            <span>View All Chambers</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
