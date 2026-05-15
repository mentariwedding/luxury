"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import GoldDivider from "./GoldDivider";
import InquiryForm from "./InquiryForm";
import { supabase } from "@/lib/supabase";

const DEFAULTS = [
  {
    tier: "Intimate",
    subtitle: "Perayaan yang Berbisik",
    tag: "Di bawah 150 tamu",
    description:
      "Untuk mereka yang percaya bahwa kedalaman lebih bermakna dari keramaian. Setiap detail mendapat perhatian penuh dari kami.",
    features: [
      "Perhatian eksklusif tim Mentari",
      "Dekorasi custom setiap sudut",
      "Timeline yang sangat personal",
      "Koordinasi vendor terpilih",
    ],
    mood: "Garden · Intimate Dining · Quiet Grandeur",
    symbol: "◇",
  },
  {
    tier: "Grand Soiree",
    subtitle: "Perayaan yang Berbicara",
    tag: "Di atas 150 tamu",
    description:
      "Untuk perayaan yang ingin meninggalkan kesan tak terlupakan. Produksi penuh, statement yang abadi, dan momen yang terasa seperti mimpi.",
    features: [
      "Tim Mentari lengkap on-site",
      "Statement décor yang memukau",
      "Full production management",
      "Multi-vendor coordination",
    ],
    mood: "Ballroom · Statement Pieces · Timeless Grandeur",
    symbol: "◆",
  },
];

export default function PackageTiers() {
  const [tiers, setTiers] = useState(DEFAULTS);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [content, setContent] = useState({
    subtitle: "The Experience",
    title: "Dua Cara Merayakan Cinta.",
  });

  useEffect(() => {
    (async () => {
      // Fetch section header — maybeSingle() agar tidak 406 saat row belum ada
      const { data: sec } = await supabase
        .from("section_content")
        .select("subtitle, title")
        .eq("section_name", "packages")
        .maybeSingle();
      if (sec)
        setContent({
          subtitle: sec.subtitle || content.subtitle,
          title: sec.title || content.title,
        });

      // Fetch tiers from section_items
      const { data: items } = await supabase
        .from("section_items")
        .select("*")
        .eq("section_name", "packages")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (items && items.length > 0) {
        setTiers(
          items.map((item) => ({
            tier: item.title,
            subtitle: item.subtitle || "",
            tag: item.tag || "",
            description:
              item.description?.split("\n\n")[0] || item.description || "",
            features:
              item.description
                ?.split("\n")
                .filter((l) => l.startsWith("- "))
                .map((l) => l.slice(2)) ||
              item.description?.split("\n").filter(Boolean).slice(1) ||
              [],
            mood: item.cta_text || "",
            symbol: item.icon_name || "◇",
          })),
        );
      }
    })();
  }, []);

  // Title split
  const titleParts = content.title.includes("|")
    ? content.title.split("|").map((s) => s.trim())
    : content.title.includes(".")
      ? [content.title.replace(/\.$/, ""), "."]
      : [content.title, ""];

  return (
    <>
      <section
        id="packages"
        className="luxury-section bg-[#080808] section-ambient relative overflow-hidden"
      >
        {/* Subtle texture lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-[#CEB175]"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Header */}
          <div className="max-w-2xl mb-16 md:mb-24">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-6 font-light">
                — {content.subtitle} —
              </p>
            </Reveal>
            <Reveal delay={200}>
              <h2 className="font-serif text-3xl md:text-6xl font-light text-white leading-tight">
                {titleParts[0]}
                {titleParts[1] && titleParts[1] !== "." && (
                  <>
                    <br />
                    <span className="italic text-[#CEB175]">
                      {titleParts[1]}
                    </span>
                  </>
                )}
                {titleParts[1] === "." && (
                  <span className="italic text-[#CEB175]">.</span>
                )}
              </h2>
            </Reveal>
            <GoldDivider delay={0.3} width="w-16" />
            <Reveal delay={400}>
              <p className="font-serif italic text-[#A3A3A3] text-sm md:text-base leading-relaxed max-w-lg">
                &ldquo;Setiap perayaan adalah sebuah pernyataan. Kami membantu
                Anda menemukan suara yang paling berbicara untuk cerita
                Anda.&rdquo;
              </p>
            </Reveal>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#CEB175]/8">
            {tiers.map((tier, i) => (
              <Reveal key={i} delay={200 + i * 200}>
                <motion.div
                  whileHover={{ backgroundColor: "rgba(206,177,117,0.02)" }}
                  transition={{ duration: 0.5 }}
                  className="group relative p-6 md:p-10 lg:p-14 bg-[#080808] flex flex-col gap-5 md:gap-8 h-full"
                >
                  {/* Tier symbol + name */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[#CEB175]/30 group-hover:text-[#CEB175]/60 transition-colors duration-700 text-xl">
                        {tier.symbol}
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/50 font-light border border-[#CEB175]/15 px-3 py-1">
                        {tier.tag}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-white group-hover:text-[#CEB175] transition-colors duration-700 leading-tight mb-2">
                      {tier.tier}
                    </h3>
                    {tier.subtitle && (
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-light">
                        {tier.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="font-serif italic text-[#A3A3A3] text-sm md:text-base leading-relaxed font-light border-l border-[#CEB175]/15 pl-5">
                    {tier.description}
                  </p>

                  {/* Features list */}
                  {tier.features && tier.features.length > 0 && (
                    <ul className="space-y-3">
                      {tier.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <span className="text-[#CEB175]/30 text-xs mt-0.5 flex-shrink-0">
                            —
                          </span>
                          <span className="text-[11px] text-[#737373] group-hover:text-[#A3A3A3] transition-colors duration-500 font-light tracking-wide leading-relaxed">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Mood tag */}
                  {tier.mood && (
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#CEB175]/20 font-light mt-auto pt-4 border-t border-[#CEB175]/8">
                      {tier.mood}
                    </p>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={600}>
            <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#CEB175]/8 pt-10">
              <p className="font-serif italic text-[#A3A3A3] text-sm font-light max-w-md">
                Tidak yakin mana yang cocok? Mulai percakapan — kami akan
                membantu menemukan yang paling sesuai untuk cerita Anda.
              </p>
              <button
                onClick={() => setInquiryOpen(true)}
                className="group flex items-center gap-4 flex-shrink-0 w-full md:w-auto"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] border-b border-[#CEB175]/30 pb-1 group-hover:text-white group-hover:border-white transition-all duration-500">
                  Mulai Percakapan
                </span>
                <div className="w-8 h-8 border border-[#CEB175]/30 flex items-center justify-center group-hover:bg-[#CEB175] group-hover:border-[#CEB175] transition-all duration-500">
                  <span className="text-[#CEB175] group-hover:text-black text-xs transition-colors duration-500">
                    ↗
                  </span>
                </div>
              </button>
            </div>
          </Reveal>
        </div>
      </section>
      <InquiryForm isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
