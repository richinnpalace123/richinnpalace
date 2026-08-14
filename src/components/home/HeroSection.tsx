"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { trackBookNowClick } from "@/lib/analytics";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Luxury cubic-bezier easing
      },
    },
  };

  const bgVariants: Variants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.45,
      transition: {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video with Zoom-in Animation */}
      <motion.div
        variants={bgVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/rangon_street/1.jpeg"
          className="w-full h-full object-cover object-center drag-none select-none"
        >
          <source src="https://res.cloudinary.com/u4u9xqwy/video/upload/v1786731982/t_nagar_outro.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-bg-dark/20" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          {/* Chapter Subtitle */}
          <motion.span
            variants={itemVariants}
            className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold font-sans font-medium mb-6 block"
          >
            CHAPTER I · A NEW ARRIVAL
          </motion.span>

          {/* Large Title */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-8xl text-text-offwhite font-light tracking-wide leading-[1.1] mb-6 md:mb-8"
          >
            Luxury, <br className="md:hidden" />
            <span className="italic font-normal">redefined.</span>
          </motion.h1>

          {/* Subheading Paragraph */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-sm md:text-base text-text-gray font-light max-w-xl mx-auto leading-relaxed tracking-wide mb-10 md:mb-12"
          >
            A quiet retreat where old craft, still hands, and slow evenings become
            the story you take home.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                trackBookNowClick("hero");
                document.getElementById("featured-rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
              href="#featured-rooms"
              className="px-8 py-3.5 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_rgba(199,168,109,0.3)] cursor-pointer"
            >
              Book Your Stay
            </a>
            <Link
              href="/rooms"
              className="px-8 py-3.5 border border-border-dark hover:border-gold/40 text-text-offwhite text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all duration-300 hover:text-gold cursor-pointer"
            >
              Explore Stays
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
        onClick={() => {
          document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[9px] tracking-[0.25em] text-text-gray font-sans font-light uppercase mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-gold stroke-[1.25]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
