'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export default function AmbientMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-28 right-6 md:bottom-28 md:right-10 z-[9999] flex items-center gap-3">
            <audio 
                ref={audioRef}
                src="/music/yiruma.mp3" 
                loop
                preload="auto"
            />
            <button 
                onClick={toggleMusic}
                aria-label="Toggle Background Music"
                className="w-12 h-12 md:w-12 md:h-12 rounded-full border-2 border-[#CEB175] bg-[#050505] shadow-[0_0_20px_rgba(206,177,117,0.3)] flex items-center justify-center group transition-all duration-500 active:scale-90"
            >
                {isPlaying ? (
                    <Volume2 className="w-6 h-6 text-[#CEB175] animate-pulse" />
                ) : (
                    <VolumeX className="w-6 h-6 text-[#CEB175]" />
                )}
            </button>
            <div className={`hidden md:block text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-[#CEB175] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                    Suasana
                </div>
        </div>
    );
}
