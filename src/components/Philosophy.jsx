"use client";

import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import GoldDivider from "./GoldDivider";
import { supabase } from "@/lib/supabase";

/**
 * Philosophy — Luxury editorial numbered manifesto.
 * Format: horizontal rule dividers with numbered principles.
 * Jauh dari "3 feature boxes" yang terasa template/korporat.
 */
export default function Philosophy() {
  const [content, setContent] = useState({
    subtitle: "Filosofi Mentari Wedding",
    title: "Dedikasi untuk Hari Anda",
  });

  const [features, setFeatures] = useState([
    {
      title: "Eksklusif",
      description:
        "Kami hanya melayani sedikit klien untuk memastikan setiap pernikahan mendapatkan perhatian penuh.",
    },
    {
      title: "Personal",
      description:
        "Setiap dekorasi dan alur acara kami buat khusus sesuai dengan karakter unik Anda.",
    },
    {
      title: "Tenang",
      description:
        "Kami menjaga semua detail teknis agar Anda bisa menikmati hari bahagia dengan tenang.",
    },
  ]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data: sectionData } = await supabase
        .from("section_content")
        .select("*")
        .eq("section_name", "philosophy")
        .maybeSingle();

      if (sectionData) {
        setContent({
          subtitle: sectionData.subtitle || content.subtitle,
          title: sectionData.title || content.title,
        });
      }

      const { data: itemsData } = await supabase
        .from("section_items")
        .select("*")
        .eq("section_name", "philosophy")
        .order("display_order", { ascending: true });

      if (itemsData && itemsData.length > 0) {
        setFeatures(itemsData);
      }
    };
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleParts = content.title.includes("|")
    ? content.title.split("|").map((s) => s.trim())
    : content.title.includes("untuk")
      ? content.title
          .split("untuk")
          .map((s, i) => (i === 1 ? "untuk " + s.trim() : s.trim()))
      : [content.title, ""];

  return (
    <section
      id="philosophy"
      className="luxury-section relative bg-[#0A0A0A] section-ambient"
    >
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CEB175] rounded-full blur-[180px] opacity-[0.025] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
        <div className="mb-20 md:mb-28">
          <Reveal>
            <SplitText
              text={content.subtitle}
              className="text-[#CEB175] text-[10px] uppercase tracking-[0.5em] mb-6 block font-light"
            />
          </Reveal>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-white leading-tight">
            <SplitText text={titleParts[0]} delay={200} />
            {titleParts[1] && (
              <span className="italic text-[#CEB175]">
                <SplitText text={titleParts[1]} delay={600} />
              </span>
            )}
          </h2>
          <GoldDivider delay={0.5} width="w-16" />
        </div>

        {/* Editorial numbered list — luxury manifesto format */}
        <div className="divide-y divide-[#CEB175]/10 border-t border-[#CEB175]/10">
          {features.map((feature, i) => (
            <Reveal key={i} delay={200 + i * 150}>
              <div className="group grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 items-start cursor-default">
                {/* Number */}
                <div className="col-span-2 md:col-span-1">
                  <span
                    className="font-serif italic text-[#CEB175]/35 group-hover:text-[#CEB175]/70 transition-colors duration-700"
                    style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                  <h3
                    className="font-serif font-light text-white group-hover:text-[#CEB175] transition-colors duration-700 leading-tight"
                    style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
                  >
                    {feature.title}
                  </h3>
                </div>

                {/* Divider line — hidden on mobile, visible md+ */}
                <div className="hidden md:flex col-span-1 items-center justify-center pt-3">
                  <span className="w-full h-px bg-[#CEB175]/15 group-hover:bg-[#CEB175]/35 transition-colors duration-700" />
                </div>

                {/* Description */}
                <div className="col-span-12 md:col-span-6 lg:col-span-7 md:pt-1 pl-8 md:pl-0">
                  <p className="text-[#737373] group-hover:text-[#A3A3A3] transition-colors duration-700 font-light leading-relaxed tracking-wide text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom signature quote */}
        <Reveal delay={600}>
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center gap-6 pt-10 border-t border-[#CEB175]/10">
            <span className="flex-shrink-0 text-[9px] uppercase tracking-[0.5em] text-[#525252] font-light">
              Prinsip kami
            </span>
            <p className="font-serif italic text-[#CEB175]/60 text-lg md:text-xl font-light">
              &ldquo;Kemewahan sejati adalah ketika Anda tidak perlu memikirkan
              apa pun kecuali menikmati momen.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
