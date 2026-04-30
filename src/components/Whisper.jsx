'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';

/**
 * The Whisper Section
 * Section bernuansa "mystique" — kalimat puitis muncul satu per satu saat scroll.
 * Tidak menjual produk. Menjual rasa.
 */
export default function Whisper() {
    const containerRef = useRef(null);
    const [whispers, setWhispers] = useState([
        { quote: 'Ada momen yang tak bisa direncanakan. Ia datang sendiri.', accent_word: 'datang' },
        { quote: 'Di antara keheningan janji, kami merangkai kenangan yang paling berkesan.', accent_word: 'keheningan' },
        { quote: 'Kami tidak mengejar tren. Kami mengundang keabadian.', accent_word: 'keabadian' },
    ]);
    const [intro, setIntro] = useState({
        subtitle: 'Sebuah Bisikan',
        description:
            'Bukan sekadar pesta. Bukan sekadar dekorasi. Ada keheningan di balik setiap kemewahan—dan di sanalah kami bekerja.',
    });

    useEffect(() => {
        (async () => {
            const { data: w } = await supabase
                .from('whispers')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            if (w && w.length > 0) setWhispers(w);

            const { data: s } = await supabase
                .from('section_content')
                .select('subtitle, description')
                .eq('section_name', 'whisper')
                .single();
            if (s) setIntro({ subtitle: s.subtitle || intro.subtitle, description: s.description || intro.description });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Highlight bergeser dari kiri ke kanan
    const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%']);

    return (
        <section
            ref={containerRef}
            id="whisper"
            className="relative bg-[#050505] overflow-hidden"
            style={{ paddingTop: 'clamp(80px, 14vh, 180px)', paddingBottom: 'clamp(80px, 14vh, 180px)' }}
        >
            {/* Subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#CEB175] rounded-full blur-[180px] opacity-[0.025] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
                {/* Section intro */}
                <div className="mb-24 md:mb-32 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-8 font-light"
                    >
                        — {intro.subtitle} —
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        style={{ originX: 0.5 }}
                        className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/40 to-transparent w-32 mx-auto mb-12"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                        className="font-serif italic text-lg md:text-xl text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        {intro.description}
                    </motion.p>
                </div>

                {/* Quotes — staggered editorial layout */}
                <div className="space-y-24 md:space-y-32">
                    {whispers.map((w, i) => {
                        const isEven = i % 2 === 0;
                        // Render with accent word highlighted
                        const renderQuote = () => {
                            const text = w.quote || '';
                            const accent = (w.accent_word || '').trim();
                            if (!accent) return text;
                            const parts = text.split(new RegExp(`(${accent})`, 'i'));
                            return parts.map((p, idx) =>
                                p.toLowerCase() === accent.toLowerCase() ? (
                                    <span key={idx} className="italic gold-gradient-text">
                                        {p}
                                    </span>
                                ) : (
                                    <span key={idx}>{p}</span>
                                ),
                            );
                        };

                        return (
                            <motion.div
                                key={w.id || i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                                className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-3xl ${isEven ? 'text-left' : 'text-right'}`}>
                                    <span className="block text-[10px] uppercase tracking-[0.5em] text-[#CEB175]/40 mb-6 font-light">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <p className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-white leading-[1.15] tracking-tight text-balance">
                                        &ldquo;{renderQuote()}&rdquo;
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom horizontal whisper line */}
                <div className="mt-32 flex justify-center">
                    <motion.div
                        style={{ width: lineWidth }}
                        className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/30 to-transparent max-w-2xl"
                    />
                </div>
            </div>
        </section>
    );
}
