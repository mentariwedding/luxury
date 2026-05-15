"use client";

import React, { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Reveal from "./Reveal";

/**
 * Behind the Moment — horizontal scrollable strip of behind-the-scenes photos.
 * Caption setiap foto: satu kata emosional.
 * Memberikan transparansi yang tetap misterius dan editorial.
 */
const DEFAULTS = [
  { caption: "Quiet", image_url: "/images/sentuhan.JPG" },
  { caption: "Detail", image_url: "/images/ruang.JPG" },
  { caption: "Intentional", image_url: "/images/suasana.JPG" },
  { caption: "Light", image_url: "/images/hangat.JPG" },
  { caption: "Bloom", image_url: "/images/estetik.JPG" },
];

export default function BehindTheMoment() {
  const [items, setItems] = useState(DEFAULTS);
  const [subtitle, setSubtitle] = useState("Behind the Moment");
  const [subtext, setSubtext] = useState("Fragmen di balik setiap perayaan");
  const containerRef = useRef(null);
  const stripRef = useRef(null);
  const scrollRef = useRef(null); // ref untuk overflow-x-auto div
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [showDrag, setShowDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0, active: false });

  // Drag-to-scroll handlers
  const handleDragStart = (e) => {
    if (!scrollRef.current) return;
    dragStart.current = {
      x: e.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
      active: true,
    };
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    // Update cursor pos
    const rect = stripRef.current?.getBoundingClientRect();
    if (rect) setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    // Actual scroll
    if (!dragStart.current.active || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const handleDragEnd = () => {
    dragStart.current.active = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("section_items")
          .select("title, image_url, description")
          .eq("section_name", "behind_the_moment")
          .eq("is_active", true)
          .order("display_order", { ascending: true });
        if (data && data.length > 0) {
          setItems(
            data.map((d) => ({
              caption: d.title || d.description || "Moment",
              image_url: d.image_url || "/images/sentuhan.JPG",
            })),
          );
        }
      } catch (_) {}

      try {
        const { data: sec } = await supabase
          .from("section_content")
          .select("subtitle, description")
          .eq("section_name", "behind_the_moment")
          .maybeSingle();
        if (sec?.subtitle) setSubtitle(sec.subtitle);
        if (sec?.description) setSubtext(sec.description);
      } catch (_) {}
    })();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  // Gentle horizontal drift on scroll for cinematic feel
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#050505] overflow-hidden"
      style={{
        paddingTop: "clamp(70px, 12vh, 140px)",
        paddingBottom: "clamp(70px, 12vh, 140px)",
      }}
    >
      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <Reveal>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="w-8 h-px bg-[#CEB175]/40" />
              <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] font-light">
                {subtitle}
              </p>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-light hidden md:block">
              {subtext}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Horizontal scroll strip — drag to scroll */}
      <div
        ref={stripRef}
        className="relative"
        onMouseEnter={() => setShowDrag(true)}
        onMouseLeave={() => {
          setShowDrag(false);
          handleDragEnd();
        }}
        onMouseMove={handleDragMove}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
      >
        {/* Drag cursor — desktop only */}
        <AnimatePresence>
          {showDrag && (
            <motion.div
              className="absolute z-20 pointer-events-none hidden md:flex items-center justify-center rounded-full backdrop-blur-sm"
              style={{
                left: dragPos.x - 32,
                top: dragPos.y - 32,
                width: isDragging ? 56 : 64,
                height: isDragging ? 56 : 64,
                background: isDragging
                  ? "rgba(206,177,117,0.15)"
                  : "rgba(5,5,5,0.8)",
                border: isDragging
                  ? "1px solid rgba(206,177,117,0.7)"
                  : "1px solid rgba(206,177,117,0.3)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="font-light uppercase transition-colors duration-200"
                style={
                  isDragging
                    ? {
                        fontSize: "7px",
                        letterSpacing: "0.2em",
                        color: "rgba(206,177,117,1)",
                      }
                    : {
                        fontSize: "7px",
                        letterSpacing: "0.3em",
                        color: "rgba(206,177,117,0.8)",
                      }
                }
              >
                {isDragging ? "←  →" : "Drag"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none select-none"
          style={{
            scrollbarWidth: "none",
            cursor: isDragging ? "none" : showDrag ? "none" : "auto",
          }}
          onDragStart={(e) => e.preventDefault()}
        >
          <motion.div
            style={{ x }}
            className="flex gap-3 md:gap-4 px-6 md:px-12 w-max"
          >
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.08,
                }}
                className="group relative flex-shrink-0 overflow-hidden"
                style={{
                  width: "clamp(200px, 28vw, 360px)",
                  aspectRatio: "3/4",
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.caption}
                  loading="lazy"
                  draggable="false"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-[1200ms] ease-out"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Single word caption */}
                <div className="absolute bottom-5 left-5 z-10">
                  <p
                    className="font-serif italic text-white/70 group-hover:text-white transition-colors duration-700"
                    style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
                  >
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
