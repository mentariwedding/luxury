'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';

/**
 * Behind the Moment — horizontal scrollable strip of behind-the-scenes photos.
 * Caption setiap foto: satu kata emosional.
 * Memberikan transparansi yang tetap misterius dan editorial.
 */
const DEFAULTS = [
    { caption: 'Quiet',       image_url: '/images/sentuhan.JPG' },
    { caption: 'Detail',      image_url: '/images/ruang.JPG' },
    { caption: 'Intentional', image_url: '/images/suasana.JPG' },
    { caption: 'Light',       image_url: '/images/hangat.JPG' },
    { caption: 'Bloom',       image_url: '/images/estetik.JPG' },
];

export default function BehindTheMoment() {
    const [items, setItems] = useState(DEFAULTS);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });
    // Gentle horizontal drift on scroll for cinematic feel
    const x = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('behind_the_moment')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });
                if (data && data.length > 0) setItems(data);
            } catch (_) {}
        })();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative bg-[#050505] overflow-hidden"
            style={{ paddingTop: 'clamp(70px, 12vh, 140px)', paddingBottom: 'clamp(70px, 12vh, 140px)' }}
        >
            {/* Header */}
            <div className="container mx-auto px-6 md:px-12 mb-12 md:mb-16">
                <Reveal>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <span className="w-8 h-px bg-[#CEB175]/40" />
                            <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] font-light">
                                Behind the Moment
                            </p>
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-light hidden md:block">
                            Fragmen di balik setiap perayaan
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* Horizontal scroll strip — motion drift on scroll */}
            <div className="overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                <motion.div
                    style={{ x }}
                    className="flex gap-3 md:gap-4 px-6 md:px-12 w-max"
                >
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                            className="group relative flex-shrink-0 overflow-hidden"
                            style={{ width: 'clamp(200px, 28vw, 360px)', aspectRatio: '3/4' }}
                        >
                            <img
                                src={item.image_url}
                                alt={item.caption}
                                loading="lazy"
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-[1200ms] ease-out"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Single word caption */}
                            <div className="absolute bottom-5 left-5 z-10">
                                <p className="font-serif italic text-white/70 group-hover:text-white transition-colors duration-700"
                                    style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}>
                                    {item.caption}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
