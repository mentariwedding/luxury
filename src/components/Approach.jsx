"use client";

import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";
import GoldDivider from "./GoldDivider";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Compass,
  PenTool,
  Heart,
  Star,
  Sparkles,
  Eye,
  Layers,
  Feather,
  Sun,
  Moon,
} from "lucide-react";

const ICON_MAP = {
  Compass,
  PenTool,
  Heart,
  Star,
  Sparkles,
  Eye,
  Layers,
  Feather,
  Sun,
  Moon,
};

export default function Approach() {
  const [content, setContent] = useState({
    subtitle: "Metode Kami",
    title: "Cara Kami Bekerja.",
    description:
      "Kami percaya kemewahan sejati ada pada detail yang mencerminkan kejujuran perasaan Anda.",
    image_url: "/images/pendekatan.JPG",
  });

  const [steps, setSteps] = useState([
    {
      title: "Visi",
      icon_name: "Compass",
      description:
        "Kami mendengar cerita Anda untuk menciptakan konsep yang benar-benar pribadi.",
    },
    {
      title: "Detail",
      icon_name: "PenTool",
      description:
        "Semua elemen, dari warna hingga alur acara, kami susun dengan rapi dan teliti.",
    },
    {
      title: "Eksekusi",
      icon_name: "Heart",
      description:
        "Kami pastikan semua berjalan lancar agar Anda bisa menikmati momen tanpa beban.",
    },
  ]);

  useEffect(() => {
    const fetchContent = async () => {
      // Fetch Section Content
      const { data: sectionData } = await supabase
        .from("section_content")
        .select("*")
        .eq("section_name", "approach")
        .maybeSingle();

      if (sectionData) {
        setContent({
          subtitle: sectionData.subtitle || content.subtitle,
          title: sectionData.title || content.title,
          description: sectionData.description || content.description,
          image_url: sectionData.image_url || content.image_url,
        });
      }

      // Fetch Section Items (Steps)
      const { data: itemsData } = await supabase
        .from("section_items")
        .select("*")
        .eq("section_name", "approach")
        .order("display_order", { ascending: true });

      if (itemsData && itemsData.length > 0) {
        setSteps(itemsData);
      }
    };

    fetchContent();
  }, []);

  const titleParts = content.title.split(".");

  return (
    <section
      id="approach"
      className="luxury-section bg-[#050505] relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Left — text + steps */}
          <div>
            <Reveal>
              <p className="text-[#CEB175] text-[10px] uppercase tracking-[0.4em] mb-6 font-light">
                {content.subtitle}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <h2 className="font-serif text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
                {titleParts[0]} <br />
                {titleParts[1] && (
                  <span className="italic text-[#CEB175]">
                    {titleParts[1]}.
                  </span>
                )}
              </h2>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-[#A3A3A3] font-light leading-relaxed mb-10 max-w-lg text-sm md:text-base font-serif italic">
                &ldquo;{content.description}&rdquo;
              </p>
            </Reveal>
            <GoldDivider delay={0.3} width="w-14" className="mb-6" />

            {/* Editorial numbered steps */}
            <div className="divide-y divide-[#CEB175]/10 border-t border-[#CEB175]/10">
              {steps.map((step, index) => (
                <Reveal key={index} delay={400 + index * 150}>
                  <div className="group flex gap-6 py-8 md:py-10 items-start">
                    {/* Large italic number */}
                    <span
                      className="font-serif italic text-[#CEB175]/30 group-hover:text-[#CEB175]/60 transition-colors duration-700 flex-shrink-0 leading-none mt-1"
                      style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      {step.icon_name && ICON_MAP[step.icon_name] && (
                        <div className="mb-3">
                          {React.createElement(ICON_MAP[step.icon_name], {
                            className:
                              "w-4 h-4 text-[#CEB175]/40 group-hover:text-[#CEB175]/70 transition-colors duration-700",
                            strokeWidth: 1.5,
                          })}
                        </div>
                      )}
                      <h3 className="font-serif text-xl md:text-2xl text-white font-light mb-2 group-hover:text-[#CEB175] transition-colors duration-700">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#737373] group-hover:text-[#A3A3A3] font-light leading-relaxed transition-colors duration-700">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right — editorial image with floating stamp */}
          <Reveal delay={500} className="relative lg:sticky lg:top-32">
            <div className="relative">
              <div
                className="aspect-[4/5] overflow-hidden border border-[#CEB175]/10 relative"
                data-cursor-label="Lihat"
              >
                <img
                  src={content.image_url}
                  alt="Our Process"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-105 transition-all duration-1000"
                />
                {/* Cinematic vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                {/* Image wipe reveal — gold leading edge */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  whileInView={{ scaleX: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.15,
                  }}
                  className="absolute inset-0 bg-[#CEB175]/25 z-30 pointer-events-none"
                  style={{ transformOrigin: "right", originX: 1 }}
                />
                {/* Image wipe reveal — dark main cover */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  whileInView={{ scaleX: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.3,
                  }}
                  className="absolute inset-0 bg-[#050505] z-31 pointer-events-none"
                  style={{ transformOrigin: "right", originX: 1 }}
                />
              </div>
              {/* Corner frames */}
              <div className="absolute -bottom-5 -left-5 w-28 h-28 border-l border-b border-[#CEB175]/30 pointer-events-none" />
              <div className="absolute -top-5 -right-5 w-28 h-28 border-r border-t border-[#CEB175]/30 pointer-events-none" />
              {/* Floating editorial stamp */}
              <div className="absolute top-6 right-6 bg-[#050505]/90 backdrop-blur-sm border border-[#CEB175]/20 px-4 py-3">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#CEB175] font-light">
                  Our Process
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
