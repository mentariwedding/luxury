"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  // null = belum diputuskan; true = tampilkan; false = jangan
  const [show, setShow] = useState(null);
  const [phase, setPhase] = useState("enter"); // enter -> hold -> exit -> done

  useEffect(() => {
    // Hanya tampil sekali per sesi browser tab
    if (typeof window === "undefined") return;

    const seen = sessionStorage.getItem("mw_preloader_seen");
    if (seen) {
      setShow(false);
      return;
    }

    setShow(true);
    sessionStorage.setItem("mw_preloader_seen", "1");

    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 1900);
    const t3 = setTimeout(() => setPhase("done"), 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11)
      return {
        greeting: "Selamat Pagi",
        tagline: "semoga harimu seindah cerita yang kita rajut",
      };
    if (hour >= 11 && hour < 15)
      return {
        greeting: "Selamat Siang",
        tagline: "setiap siang adalah jeda yang bermakna",
      };
    if (hour >= 15 && hour < 19)
      return {
        greeting: "Selamat Sore",
        tagline: "ketika cahaya sore jatuh, cerita terbaik dimulai",
      };
    return {
      greeting: "Selamat Malam",
      tagline: "di bawah bintang, cerita abadi dirajut",
    };
  };
  const { greeting, tagline } = getTimeGreeting();

  if (show === null || show === false || phase === "done") return null;

  const isExiting = phase === "exit";

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Curtain top — slides up on exit */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isExiting ? "-100%" : 0 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#050505]"
      />
      {/* Curtain bottom — slides down on exit */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isExiting ? "100%" : 0 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#050505]"
      />

      {/* Center content */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              {/* Sun icon — breathing scale, not pulse */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  scale: [0.95, 1.02, 0.95],
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut" },
                  scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="mb-8"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#CEB175]"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="22"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="12"
                    x2="5"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="12"
                    x2="22"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4.93"
                    y1="4.93"
                    x2="7.05"
                    y2="7.05"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16.95"
                    y1="16.95"
                    x2="19.07"
                    y2="19.07"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19.07"
                    y1="4.93"
                    x2="16.95"
                    y2="7.05"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="7.05"
                    y1="16.95"
                    x2="4.93"
                    y2="19.07"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="6.5"
                    x2="12"
                    y2="7.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    x1="12"
                    y1="16.5"
                    x2="12"
                    y2="17.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    x1="6.5"
                    y1="12"
                    x2="7.5"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    x1="16.5"
                    y1="12"
                    x2="17.5"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </motion.div>

              {/* Brand name — per-letter stagger reveal */}
              <div className="overflow-hidden flex items-center gap-0">
                {"MENTARI".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="font-serif text-xl md:text-2xl tracking-[0.5em] text-white/90 uppercase font-light inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Gold line — draws from center outward */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: 1.0,
                  delay: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-px w-32 bg-gradient-to-r from-transparent via-[#CEB175] to-transparent mt-6 origin-center"
              />

              {/* Time greeting */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/40 font-light mt-5"
              >
                {greeting}
              </motion.p>
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 1.1 }}
                className="font-serif italic text-[10px] tracking-[0.3em] text-[#CEB175]/50 mt-2 text-center max-w-[200px]"
              >
                {tagline}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
