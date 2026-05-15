"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Reveal from "./Reveal";

/**
 * "Whisper from Our Couples" — Testimonial carousel.
 * Format: full-width editorial pull quote, initials only (bukan nama lengkap),
 * auto-cycle setiap 6 detik. Navigasi manual via dots + arrows.
 */
const DEFAULTS = [
  {
    quote:
      "Mentari memahami apa yang kami inginkan bahkan sebelum kami bisa menjelaskannya.",
    initials: "R & D",
    year: "2024",
    venue_hint: "Sebuah taman pribadi di Sukabumi",
  },
  {
    quote:
      "Bukan sekadar event organizer. Mereka adalah penjaga momen yang paling berharga dalam hidup kami.",
    initials: "A & F",
    year: "2024",
    venue_hint: "Pavilion tepi danau, Bogor",
  },
  {
    quote:
      "Setiap detail terasa seperti surat cinta yang tersembunyi—hanya untuk kami berdua.",
    initials: "S & M",
    year: "2023",
    venue_hint: "Kediaman keluarga, Sukabumi Selatan",
  },
];

export default function Testimonial() {
  const [items, setItems] = useState(DEFAULTS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playingVideo, setPlayingVideo] = useState(null); // stores video_url that's playing

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("testimonials")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });
        if (data && data.length > 0) setItems(data);
      } catch (_) {
        // fallback to defaults
      }
    })();
  }, []);

  const navigate = useCallback(
    (dir) => {
      setDirection(dir);
      setPlayingVideo(null); // stop any playing video
      setCurrent((c) => (c + dir + items.length) % items.length);
    },
    [items.length],
  );

  // Auto-cycle every 6.5s
  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6500);
    return () => clearInterval(timer);
  }, [navigate]);

  // Keyboard navigation — ← / →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const item = items[current];

  // Split quote — first 5 words in gold italic, rest in white
  const words = (item.quote || "").split(" ");
  const accentWords = words.slice(0, 5).join(" ");
  const restWords = words.slice(5).join(" ");

  return (
    <section
      id="testimonial"
      className="relative bg-[#050505] border-t border-[#CEB175]/5 overflow-hidden"
      style={{
        paddingTop: "clamp(80px, 13vh, 160px)",
        paddingBottom: "clamp(80px, 13vh, 160px)",
      }}
    >
      {/* Ambient gold glow — left side */}
      <div className="absolute top-1/2 -left-40 -translate-y-1/2 w-[500px] h-[500px] bg-[#CEB175] rounded-full blur-[180px] opacity-[0.025] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        {/* Eyebrow label */}
        <Reveal>
          <div className="flex items-center gap-5 mb-12 md:mb-20">
            <span className="w-10 h-px bg-[#CEB175]/40" />
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] font-light">
              Whisper from Our Couples
            </p>
          </div>
        </Reveal>

        {/* Quote — animated */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, y: direction * 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -direction * 20 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 md:mb-16"
          >
            <p
              className="font-serif font-light text-white leading-[1.2] text-balance"
              style={{ fontSize: "clamp(26px, 4.5vw, 58px)" }}
            >
              &ldquo;
              <span className="italic gold-gradient-text">{accentWords}</span>
              {restWords ? ` ${restWords}` : ""}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Video player — if testimonial has video */}
        <AnimatePresence>
          {item.video_url && playingVideo === item.video_url && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-10"
            >
              <div className="relative aspect-video max-w-2xl border border-[#CEB175]/10 bg-[#0A0A0A]">
                <video
                  src={item.video_url}
                  poster={item.video_thumbnail || undefined}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attribution + navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Attribution */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`attr-${current}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-1.5"
              >
                <span className="font-serif italic text-[#CEB175] text-base tracking-wide">
                  {item.initials}
                </span>
                <span className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">
                  {item.venue_hint} · {item.year}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Video play button */}
            {item.video_url && (
              <motion.button
                key={`vid-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() =>
                  setPlayingVideo(
                    playingVideo === item.video_url ? null : item.video_url,
                  )
                }
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 border border-[#CEB175]/30 flex items-center justify-center group-hover:bg-[#CEB175] group-hover:border-[#CEB175] transition-all duration-500">
                  {playingVideo === item.video_url ? (
                    <span className="text-[#CEB175] group-hover:text-black text-[8px] transition-colors">
                      ■
                    </span>
                  ) : (
                    <span className="text-[#CEB175] group-hover:text-black text-[8px] ml-0.5 transition-colors">
                      ▶
                    </span>
                  )}
                </div>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/50 group-hover:text-[#CEB175] transition-colors duration-300 font-light">
                  {playingVideo === item.video_url ? "Tutup" : "Tonton"}
                </span>
              </motion.button>
            )}
          </div>

          {/* Dots + arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Previous"
              className="w-10 h-10 sm:w-9 sm:h-9 border border-[#CEB175]/20 flex items-center justify-center text-[#CEB175]/50 hover:border-[#CEB175]/60 hover:text-[#CEB175] transition-all duration-500"
            >
              <span className="text-lg leading-none select-none">‹</span>
            </button>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`transition-all duration-500 ${
                    i === current
                      ? "w-6 h-[3px] bg-[#CEB175]"
                      : "w-[6px] h-[6px] bg-[#CEB175]/20 hover:bg-[#CEB175]/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              aria-label="Next"
              className="w-10 h-10 sm:w-9 sm:h-9 border border-[#CEB175]/20 flex items-center justify-center text-[#CEB175]/50 hover:border-[#CEB175]/60 hover:text-[#CEB175] transition-all duration-500"
            >
              <span className="text-lg leading-none select-none">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
