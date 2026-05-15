"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { supabase } from "@/lib/supabase";
import Reveal from "./Reveal";
import GoldDivider from "./GoldDivider";
import { VenuesSkeleton } from "./GoldSkeleton";

/**
 * Curated Venues — Showcase venue tanpa nama spesifik.
 * Setiap venue hanya ditampilkan dengan caption puitis & lokasi cryptic.
 */
export default function Venues() {
  const [content, setContent] = useState({
    subtitle: "Lokasi Pilihan",
    title: "Tempat yang Bercerita.",
    description:
      "Setiap pernikahan punya tempatnya sendiri—dan setiap tempat punya ceritanya. Berikut beberapa lokasi pilihan yang pernah kami rangkai.",
  });
  const [venues, setVenues] = useState([
    {
      name: "Pavilion Tebing",
      cryptic_caption: "Di mana laut menjadi saksi janji kalian.",
      location_hint: "Pesisir di ujung selatan.",
      image_url: "/images/pavilion.JPG",
    },
    {
      name: "Taman Abadi",
      cryptic_caption: "Di bawah pepohonan tua, waktu seolah berhenti.",
      location_hint: "Sebuah taman pribadi.",
      image_url: "/images/garden.jpg",
    },
    {
      name: "Balai Warisan",
      cryptic_caption: "Dinding yang sudah menyaksikan banyak cerita.",
      location_hint: "Sebuah kediaman megah.",
      image_url: "/images/heritage.jpg",
    },
    {
      name: "Atrium Langit",
      cryptic_caption: "Perayaan yang tertulis di langit kota.",
      location_hint: "Di atas ketinggian kota.",
      image_url: "/images/rooftop.jpg",
    },
  ]);
  const [venuesLoading, setVenuesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase
        .from("section_content")
        .select("*")
        .eq("section_name", "venues")
        .maybeSingle();
      if (s) {
        setContent({
          subtitle: s.subtitle || content.subtitle,
          title: s.title || content.title,
          description: s.description || content.description,
        });
      }

      const { data: v } = await supabase
        .from("venues")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (v && v.length > 0) setVenues(v);
      setVenuesLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleParts = (content.title || "").split(".");

  return (
    <section
      id="venues"
      className="luxury-section bg-[#050505] relative overflow-hidden section-ambient"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-[1500px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-6 font-light">
                — {content.subtitle} —
              </p>
            </Reveal>
            <Reveal delay={200}>
              <h2 className="font-serif text-4xl md:text-6xl font-light text-white leading-tight">
                {titleParts[0]}
                {titleParts[1] !== undefined && (
                  <span className="italic text-[#CEB175]">.</span>
                )}
              </h2>
            </Reveal>
            <GoldDivider delay={0.3} width="w-16" />
          </div>
          <Reveal delay={400}>
            <p className="text-[#A3A3A3] font-light text-sm leading-relaxed max-w-md italic border-l border-[#CEB175]/20 pl-6">
              {content.description}
            </p>
          </Reveal>
        </div>

        {/* Venues Grid — Editorial alternating layout */}
        <div className="space-y-32">
          {venuesLoading ? (
            <VenuesSkeleton />
          ) : (
            venues.map((v, i) => (
              <VenueCard key={v.id || i} venue={v} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function VenueCard({ venue, index }) {
  const ref = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const isReversed = index % 2 === 1;

  const handleMapToggle = () => setShowMap((p) => !p);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center"
    >
      {/* Image */}
      <div
        className={`relative lg:col-span-7 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
      >
        <div
          className="aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-[#111] border border-[#CEB175]/10 relative group"
          data-cursor-label="Maps"
        >
          <motion.img
            style={{ y, scale: 1.15 }}
            src={venue.image_url}
            alt={venue.name}
            loading="lazy"
            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.5em] text-white/60 font-light">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
        {!isReversed ? (
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-[#CEB175]/30 hidden md:block pointer-events-none" />
        ) : (
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l border-b border-[#CEB175]/30 hidden md:block pointer-events-none" />
        )}
      </div>

      {/* Caption */}
      <div
        className={`lg:col-span-5 ${isReversed ? "lg:order-1" : "lg:order-2"}`}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175]/70 mb-6 font-light">
          {venue.location_hint || "A private location"}
        </p>
        <h3 className="font-serif text-3xl md:text-5xl font-light text-white mb-8 leading-tight italic">
          {venue.name}
        </h3>
        <div className="h-px bg-[#CEB175]/20 w-12 mb-8" />
        <p className="font-serif italic text-lg md:text-xl text-[#A3A3A3] leading-relaxed font-light max-w-md">
          &ldquo;{venue.cryptic_caption}&rdquo;
        </p>

        {venue.map_coordinates && (
          <div className="mt-8 relative">
            <button
              onMouseEnter={() => setShowMap(true)}
              onMouseLeave={() => setShowMap(false)}
              onClick={handleMapToggle}
              className="group flex items-center gap-3"
            >
              <div className="w-5 h-5 border border-[#CEB175]/20 group-hover:border-[#CEB175]/50 flex items-center justify-center transition-colors duration-500">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#CEB175]/40 group-hover:text-[#CEB175]/70 transition-colors duration-500"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/30 group-hover:text-[#CEB175]/60 transition-colors duration-500 font-light">
                Lihat Lokasi
              </span>
            </button>

            {/* Coordinate tooltip */}
            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-8 z-20 bg-[#050505] border border-[#CEB175]/15 px-4 py-3 pointer-events-none whitespace-nowrap"
                >
                  <p className="text-[7px] uppercase tracking-[0.4em] text-[#CEB175]/40 mb-1 font-light">
                    Koordinat
                  </p>
                  <p className="font-mono text-[9px] text-white/30">
                    {venue.map_coordinates}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
