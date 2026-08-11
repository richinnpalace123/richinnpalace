"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-14 md:py-36 bg-bg-dark border-b border-border-dark relative overflow-hidden flex items-center justify-center">
      {/* Background radial highlight */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-6 text-center space-y-8 md:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold font-sans font-medium">
            RESERVATIONS
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-text-offwhite font-light tracking-wide leading-tight">
            Begin your story <br />
            in stillness.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-sans text-xs md:text-sm text-text-gray font-light max-w-md mx-auto leading-relaxed tracking-wide"
        >
          Experience Rajasthan as it was meant to be lived—unhurried, silent, and beautifully tailored to your touch. Limited to twenty-eight keys.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2"
        >
          <Link
            href="/booking"
            className="inline-block px-10 py-4 bg-gold text-bg-dark text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-hover transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-[0_0_25px_rgba(199,168,109,0.35)] cursor-pointer"
          >
            Reserve Your Sanctuary
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
