"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { manifesto } from "@/lib/data";
import { Plus, Minus } from "lucide-react";

export default function ManifestoSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="manifesto" className="py-8 md:py-18 bg-bg-dark border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Left Column: Sticky Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-1/2 lg:-translate-y-1/2 lg:h-fit text-left flex flex-col items-start justify-center mb-6 lg:mb-0">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
              03 · OUR MANIFESTO & TARIFFS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-[1.15] mb-4 md:mb-6">
              Six things we <br />
              quietly promise.
            </h2>
            <p className="font-sans text-[11px] md:text-xs tracking-wide leading-relaxed text-text-gray/80 font-light max-w-xl">
              Transparent luxury tariffs, 24-hour check-in flexibility, complimentary South Indian breakfast buffets, and 24/7 room service across our prime T. Nagar properties.
            </p>
          </div>

          {/* Right Column: Promises List (Accordion) */}
          <div className="lg:col-span-8 lg:pl-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="divide-y divide-border-dark/60"
            >
              {manifesto.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="py-4 md:py-5 first:pt-0 last:pb-0 group"
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="w-full text-left flex items-baseline justify-between focus:outline-none py-2 cursor-pointer"
                  >
                    <div className="flex items-baseline space-x-3.5">
                      <span className="font-serif text-xs md:text-sm text-gold/75 group-hover:text-gold font-light tracking-wider select-none shrink-0 w-6">
                        {item.num}
                      </span>
                      <h3 className="font-serif text-base md:text-xl text-text-offwhite font-light group-hover:text-gold transition-colors duration-300 pr-4">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-text-gray group-hover:text-gold transition-colors duration-300 shrink-0">
                      {openIdx === idx ? (
                        <Minus size={14} className="stroke-[1.5]" />
                      ) : (
                        <Plus size={14} className="stroke-[1.5]" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIdx === idx
                        ? "max-h-[200px] opacity-100 mt-2 pb-2"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="font-sans text-[11px] md:text-xs text-text-gray/90 font-light leading-relaxed max-w-2xl pl-9 md:pl-10">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
