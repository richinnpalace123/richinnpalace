"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { galleryImages } from "@/lib/data";

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up scroll linked parallax zoom for a premium look
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="py-8 md:py-16 bg-bg-dark border-b border-border-dark overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
          04 · GALLERY
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide">
          Spaces carved from silence.
        </h2>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative w-full">
        <div className="flex space-x-6 md:space-x-8 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-6 md:px-12">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="w-[70vw] sm:w-[45vw] md:w-[32vw] aspect-[16/10] shrink-0 snap-start rounded-2xl overflow-hidden relative group"
            >
              {/* Inner Parallax Wrap */}
              <motion.div style={{ scale }} className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 32vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>

              {/* Subtle overlay with details on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold mb-1 font-sans">
                  Detail {idx + 1}
                </span>
                <h4 className="font-serif text-lg text-text-offwhite font-light">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Drag / Swipe Helper Message */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6 flex justify-end">
          <span className="text-[10px] tracking-[0.15em] text-text-gray/50 uppercase font-sans font-light">
            ← Swipe to view →
          </span>
        </div>
      </div>
    </section>
  );
}
