"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Reveal from "./Reveal";
import InquiryForm from "./InquiryForm";
import MagneticButton from "./MagneticButton";

/* Scramble count effect — dramatic luxury reveal */
function useScrambleCount(target, shouldStart = false) {
  const [display, setDisplay] = useState("—");

  useEffect(() => {
    if (!shouldStart) return;

    let frame = 0;
    const totalFrames = 35;
    const settleAt = 22;
    const targetStr = String(target);

    const tick = () => {
      frame++;
      if (frame < settleAt) {
        // Pure scramble — random number
        setDisplay(String(Math.floor(Math.random() * (target * 1.5 + 10))));
      } else if (frame < totalFrames) {
        // Progressive settle toward target
        const progress = (frame - settleAt) / (totalFrames - settleAt);
        if (Math.random() > progress) {
          setDisplay(String(Math.floor(Math.random() * (target + 5))));
        } else {
          setDisplay(targetStr);
        }
      } else {
        setDisplay(targetStr);
        return; // Done
      }

      if (frame < totalFrames) {
        setTimeout(tick, 40); // ~25fps scramble
      }
    };

    // Small delay before scramble starts
    setTimeout(tick, 200);
  }, [shouldStart, target]);

  return display;
}

/**
 * "By Inquiry Only" — Manifesto eksklusivitas brand.
 * Tidak ada harga, tidak ada paket. Hanya ajakan untuk memulai percakapan.
 */
export default function Manifesto() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const c0 = useScrambleCount(60, statsInView);
  const c1 = useScrambleCount(5, statsInView);
  const c2 = useScrambleCount(100, statsInView);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const [content, setContent] = useState({
    subtitle: "Selectively Curated",
    title: "By Inquiry Only.",
    description:
      "Kami memilih untuk merancang hanya sejumlah perayaan dalam setahun. Bukan karena terbatas, tetapi karena setiap cerita layak mendapatkan ruang yang utuh.",
    cta_text: "Begin the Conversation",
  });
  const [whatsapp, setWhatsapp] = useState("628123456789");
  const [slots, setSlots] = useState({
    remaining: 3,
    year: new Date().getFullYear(),
  });
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("section_content")
        .select("*")
        .eq("section_name", "manifesto")
        .maybeSingle();
      if (data) {
        setContent({
          subtitle: data.subtitle || content.subtitle,
          title: data.title || content.title,
          description: data.description || content.description,
          cta_text: data.cta_text || content.cta_text,
        });
      }

      const { data: wa } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp_number")
        .single();
      if (wa?.value) setWhatsapp(wa.value);

      const { data: slotsData } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["slots_remaining", "slots_year"]);
      if (slotsData && slotsData.length > 0) {
        const slotsMap = {};
        slotsData.forEach((d) => {
          slotsMap[d.key] = d.value;
        });
        setSlots({
          remaining: parseInt(slotsMap.slots_remaining) || 3,
          year: parseInt(slotsMap.slots_year) || new Date().getFullYear(),
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const diff = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  const trackClick = async () => {
    try {
      await supabase.from("inquiry_clicks").insert([
        {
          source: "manifesto",
          user_agent:
            typeof navigator !== "undefined" ? navigator.userAgent : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
        },
      ]);
    } catch (_) {
      // silent fail — tracking tidak boleh blokir CTA
    }
  };

  const titleParts = (content.title || "").split(".");
  const waMessage = encodeURIComponent(
    "Halo Mentari Wedding, saya tertarik untuk memulai percakapan tentang perayaan kami.",
  );

  return (
    <>
      <section
        id="manifesto"
        className="relative bg-[#0A0A0A] overflow-hidden border-y border-[#CEB175]/10"
        style={{
          paddingTop: "clamp(100px, 16vh, 200px)",
          paddingBottom: "clamp(100px, 16vh, 200px)",
        }}
      >
        {/* Decorative giant text background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif italic text-[28vw] md:text-[20vw] leading-none text-white/[0.018] whitespace-nowrap tracking-tighter">
            Inquiry
          </span>
        </div>

        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CEB175] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <div className="text-center">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-10 font-light">
                — {content.subtitle} —
              </p>
            </Reveal>

            <Reveal delay={200}>
              <h2
                className="font-serif font-light text-white leading-[0.95] tracking-tight mb-12 text-balance"
                style={{ fontSize: "clamp(48px, 9vw, 140px)" }}
              >
                {titleParts[0]}
                {titleParts[1] !== undefined && (
                  <span className="italic gold-gradient-text">.</span>
                )}
              </h2>
            </Reveal>

            <Reveal delay={400}>
              <div className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/30 to-transparent w-24 mx-auto mb-12" />
            </Reveal>

            <Reveal delay={500}>
              <p className="font-light text-base md:text-lg text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed mb-16 tracking-wide">
                {content.description}
              </p>
            </Reveal>

            {/* Stats strip — merged from SocialProof */}
            <Reveal delay={550}>
              <div
                ref={statsRef}
                className="flex justify-center gap-12 md:gap-20 mb-14 border-y border-[#CEB175]/8 py-8"
              >
                {[
                  { count: c0, suffix: "+", label: "Cerita Dirangkai" },
                  { count: c1, suffix: "+", label: "Tahun Pengalaman" },
                  { count: c2, suffix: "%", label: "Dedikasi Penuh Hati" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p
                      className="font-serif font-light text-white/90 leading-none mb-1.5"
                      style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
                    >
                      <span className="tabular-nums">{s.count}</span>
                      <span
                        className="text-[#CEB175] italic"
                        style={{ fontSize: "0.6em" }}
                      >
                        {s.suffix}
                      </span>
                    </p>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-light">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={600}>
              {/* Scarcity indicator — slot dots */}
              <div className="flex flex-col items-center gap-4 mb-12">
                <div className="flex items-center gap-1.5">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`transition-all duration-300 ${
                        i < 12 - slots.remaining
                          ? "w-2 h-2 bg-[#CEB175]/15"
                          : "w-2.5 h-2.5 bg-[#CEB175]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/50 font-light">
                  {slots.remaining} Celebration
                  {slots.remaining !== 1 ? "s" : ""} Remaining · {slots.year}
                </span>
              </div>
            </Reveal>

            {daysLeft > 0 && (
              <Reveal delay={650}>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="w-8 h-px bg-[#CEB175]/20" />
                  <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-light">
                    <span className="text-[#CEB175]/50 tabular-nums">
                      {daysLeft}
                    </span>{" "}
                    hari tersisa di {new Date().getFullYear()}
                  </p>
                  <span className="w-8 h-px bg-[#CEB175]/20" />
                </div>
              </Reveal>
            )}

            <Reveal delay={700}>
              <MagneticButton className="w-full sm:w-auto inline-flex justify-center">
                <button
                  onClick={() => {
                    setInquiryOpen(true);
                    trackClick();
                  }}
                  className="inline-flex items-center gap-5 group border border-[#CEB175]/40 px-10 sm:px-12 py-5 sm:py-6 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700 relative overflow-hidden mb-6"
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700 relative z-10">
                    {content.cta_text}
                  </span>
                  <span className="w-8 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700 relative z-10" />
                  <ArrowUpRight className="w-4 h-4 text-[#CEB175] group-hover:text-black group-hover:rotate-45 transition-all duration-700 relative z-10" />
                </button>
              </MagneticButton>
            </Reveal>

            <Reveal delay={900}>
              <p className="mt-12 text-[10px] uppercase tracking-[0.5em] text-white/20 italic font-serif">
                A limited number of celebrations each year.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      <InquiryForm isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
