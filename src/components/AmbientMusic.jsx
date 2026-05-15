"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 left-20 md:bottom-10 md:left-24 z-[60] flex items-center gap-3">
      <audio ref={audioRef} src="/music/yiruma.mp3" loop preload="auto" />
      <button
        onClick={toggleMusic}
        aria-label="Toggle Background Music"
        className="w-11 h-11 border border-[#CEB175]/30 bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center group transition-all duration-500 hover:border-[#CEB175]/60"
      >
        {isPlaying ? (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Volume2 className="w-6 h-6 text-[#CEB175]" />
          </motion.div>
        ) : (
          <VolumeX className="w-6 h-6 text-[#CEB175]" />
        )}
      </button>
      <div
        className={`hidden md:block text-[10px] font-sans font-light uppercase tracking-[0.3em] text-[#CEB175] transition-opacity duration-1000 ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        Suasana
      </div>
    </div>
  );
}
