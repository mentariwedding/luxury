'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';
import { TestimonialSkeleton } from './GoldSkeleton';

/**
 * "Whisper from Our Couples" — Testimonial carousel.
 * Format: full-width editorial pull quote, initials only (bukan nama lengkap),
 * auto-cycle setiap 6 detik. Navigasi manual via dots + arrows.
 */
const DEFAULTS = [
    {
        quote: 'Mentari memahami apa yang kami inginkan bahkan sebelum kami bisa menjelaskannya.',
        initials: 'R & D',
        year: '2024',
        venue_hint: 'Sebuah taman pribadi di Sukabumi',
    },
    {
        quote: 'Bukan sekadar event organizer. Mereka adalah penjaga momen yang paling berharga dalam hidup kami.',
        initials: 'A & F',
        year: '2024',
        venue_hint: 'Pavilion tepi danau, Bogor',
    },
    {
        quote: 'Setiap detail terasa seperti surat cinta yang tersembunyi—hanya untuk kami berdua.',
        initials: 'S & M',
        year: '2023',
        venue_hint: 'Kediaman keluarga, Sukabumi Selatan',
    },
];

export default function Testimonial() {
    const [items, setItems] = useState(DEFAULTS);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('testimonials')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });
                if (data && data.length > 0) setItems(data);
            } catch (_) {
                // fallback to defaults
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Auto-cycle
    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c + 1) % items.length);
        }, 6500);
        return () => clearInterval(timer);
    }, [items.length]);

    const navigate = (dir) => {
        setDirection(dir);
        setCurrent((c) => (c + dir + items.length) % items.length);
    };

    const item = items[current];

    // Split quote — first 5 words in gold italic, rest in white
    const words = (item.quote || '').split(' ');
    const accentWords = words.slice(0, 5).join(' ');
    const restWords = words.slice(5).join(' ');

    return (
        <section id="testimonial" className="relative bg-[#050505] border-t border-[#CEB175]/5 overflow-hidden"
            style={{ paddingTop: 'clamp(80px, 13vh, 160px)', paddingBottom: 'clamp(80px, 13vh, 160px)' }}>

            {/* Ambient gold glow — left side */}
            <div className="absolute top-1/2 -left-40 -translate-y-1/2 w-[500px] h-[500px] bg-[#CEB175] rounded-full blur-[180px] opacity-[0.025] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                {loading && <TestimonialSkeleton />}

                {/* Eyebrow label */}
                <Reveal>
                    <div className="flex items-center gap-5 mb-16 md:mb-20">
                        <span className="w-10 h-px bg-[#CEB175]/40" />
                        <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] font-light">
                            Whisper from Our Couples
                        </p>
                    </div>
                </Reveal>

                {/* Quote — animated */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        initial={{ opacity: 0, y: direction * 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -direction * 20 }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-14 md:mb-16"
                    >
                        <p className="font-serif font-light text-white leading-[1.2] text-balance"
                            style={{ fontSize: 'clamp(26px, 4.5vw, 58px)' }}>
                            &ldquo;<span className="italic gold-gradient-text">{accentWords}</span>
                            {restWords ? ` ${restWords}` : ''}&rdquo;
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Attribution + navigation */}
                <div className="flex items-end justify-between gap-6 flex-wrap">

                    {/* Attribution */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`attr-${current}`}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col gap-1.5"
                        >
                            <span className="font-serif italic text-[#CEB175] text-base tracking-wide">
                                {item.initials}
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">
                                {item.venue_hint} · {item.year}
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots + arrows */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Previous"
                            className="w-9 h-9 border border-[#CEB175]/20 rounded-full flex items-center justify-center text-[#CEB175]/50 hover:border-[#CEB175]/60 hover:text-[#CEB175] transition-all duration-500"
                        >
                            <span className="text-lg leading-none select-none">‹</span>
                        </button>

                        <div className="flex items-center gap-2">
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    className={`rounded-full transition-all duration-500 ${
                                        i === current
                                            ? 'w-6 h-[3px] bg-[#CEB175]'
                                            : 'w-[6px] h-[6px] bg-[#CEB175]/20 hover:bg-[#CEB175]/40'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => navigate(1)}
                            aria-label="Next"
                            className="w-9 h-9 border border-[#CEB175]/20 rounded-full flex items-center justify-center text-[#CEB175]/50 hover:border-[#CEB175]/60 hover:text-[#CEB175] transition-all duration-500"
                        >
                            <span className="text-lg leading-none select-none">›</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
