"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { testimonials } from "@/lib/data";
import { ShieldCheck, Star } from "lucide-react";

export default function TestimonialsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="reviews" className="py-8 md:py-18 bg-bg-dark border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
            02 · REVIEWS & STORIES
          </h2>
          <h4 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide">
            Our guests, in their own words.
          </h4>
        </div>

        {/* Testimonials Slider/Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-6 md:pb-0"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="w-[85vw] sm:w-[50vw] md:w-auto shrink-0 snap-start snap-always bg-surface-dark border border-border-dark/60 rounded-2xl p-8 md:p-10 flex flex-col justify-between space-y-8 hover:border-gold/30 transition-colors duration-500 group"
            >
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold stroke-[0]" />
                  ))}
                </div>
                {t.verified && (
                  <span className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-[0.15em] text-gold font-medium bg-gold/5 px-2.5 py-1 rounded-full border border-gold/10">
                    <ShieldCheck size={11} className="stroke-[1.75]" />
                    <span>Verified Stay</span>
                  </span>
                )}
              </div>

              {/* Quote Text */}
              <p className="font-serif text-lg md:text-xl text-text-offwhite font-light leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Guest Profile Row */}
              <div className="flex items-center space-x-4 pt-4 border-t border-border-dark/40">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border-dark">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base text-text-offwhite font-medium">
                    {t.author}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-text-gray font-light">
                    {t.role} · {t.stayDate}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
