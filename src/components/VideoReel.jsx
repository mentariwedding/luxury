'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Cinematic Video Strip — visual breather antar section.
 * Letterbox cinematic ratio, parallax scroll, mute/unmute toggle luxury.
 */
export default function VideoReel({ src = '/images/hero.mp4', poster = '/images/hero.JPG' }) {
    const ref = useRef(null);
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
    const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 0.85, 0.85, 0.3]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted((m) => !m);
        }
    };

    return (
        <section ref={ref} className="relative h-[45vh] md:h-[55vh] overflow-hidden bg-black">

            {/* Cinematic letterbox gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[#050505]/20 z-10 pointer-events-none" />

            {/* Gold filmstrip borders — upgraded */}
            <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                <div className="h-[3px] bg-gradient-to-r from-transparent via-[#CEB175]/25 to-transparent" />
                <div className="h-px bg-[#CEB175]/5 mt-[2px]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                <div className="h-px bg-[#CEB175]/5 mb-[2px]" />
                <div className="h-[3px] bg-gradient-to-r from-transparent via-[#CEB175]/25 to-transparent" />
            </div>

            {/* Video with parallax */}
            <motion.div style={{ y }} className="absolute inset-0 scale-[1.3]">
                <motion.video
                    ref={videoRef}
                    style={{ opacity }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={poster}
                    className="w-full h-full object-cover"
                >
                    <source src={src} type="video/mp4" />
                </motion.video>
            </motion.div>

            {/* Center overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.8em] text-[#CEB175]/50 font-light mb-4">
                        Highlight Reel
                    </p>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#CEB175]/40 to-transparent mx-auto" />
                </motion.div>
            </div>

            {/* Mute / Unmute button — bottom right, luxury pill */}
            <div className="absolute bottom-6 right-6 z-30">
                <button
                    onClick={toggleMute}
                    aria-label={muted ? 'Aktifkan suara' : 'Bisukan'}
                    className="group flex items-center gap-2.5 px-4 py-2 border border-[#CEB175]/20 bg-[#050505]/80 backdrop-blur-sm rounded-full hover:border-[#CEB175]/50 transition-all duration-500"
                >
                    {/* Wave icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`text-[#CEB175]/60 group-hover:text-[#CEB175] transition-colors duration-500`}>
                        {muted ? (
                            <>
                                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </>
                        ) : (
                            <>
                                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </>
                        )}
                    </svg>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/50 group-hover:text-[#CEB175] transition-colors duration-500 font-light">
                        {muted ? 'Sound' : 'Mute'}
                    </span>
                </button>
            </div>
        </section>
    );
}
