'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Cinematic Video Strip — thin fullwidth video divider.
 * Autoplay, muted, looping. Parallax scroll effect.
 * Bukan section baru — visual breather antara section.
 */
export default function VideoReel({ src = '/images/hero.mp4', poster = '/images/hero.JPG' }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 0.8, 0.8, 0.4]);

    return (
        <section ref={ref} className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-black">
            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[#050505]/30 z-10 pointer-events-none" />

            {/* Letterbox bars for cinematic feel */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#CEB175]/10 z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CEB175]/10 z-20" />

            {/* Video with parallax */}
            <motion.div style={{ y }} className="absolute inset-0 scale-[1.3]">
                <motion.video
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

            {/* Center text overlay — minimal */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.8em] text-[#CEB175]/60 font-light mb-4">
                        Highlight Reel
                    </p>
                    <div className="w-12 h-px bg-[#CEB175]/30 mx-auto" />
                </motion.div>
            </div>
        </section>
    );
}
