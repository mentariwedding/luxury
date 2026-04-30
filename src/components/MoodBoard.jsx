'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import GoldDivider from './GoldDivider';
import { supabase } from '@/lib/supabase';

/**
 * MoodBoard — Inspirasi Palette Section.
 * Menampilkan 3 gaya estetika dengan color swatches + kata kunci.
 * Membantu calon klien "melihat diri mereka" dalam brand Mentari.
 */
const DEFAULTS = [
    {
        name: 'Dusty Rose & Ivory',
        keywords: ['Romantic', 'Soft', 'Garden'],
        colors: ['#E8D0C0', '#F5EDE6', '#C9A9A6', '#8B6B5D'],
        mood: 'Untuk cerita yang berbisik lembut di antara kelopak bunga.',
        image_url: '/images/sentuhan.JPG',
    },
    {
        name: 'Midnight & Gold',
        keywords: ['Bold', 'Timeless', 'Formal'],
        colors: ['#1A1A2E', '#2D2B55', '#CEB175', '#E8D399'],
        mood: 'Untuk perayaan yang memanggil bintang turun ke bumi.',
        image_url: '/images/ruang.JPG',
    },
    {
        name: 'Sage & Cream',
        keywords: ['Natural', 'Earthy', 'Serene'],
        colors: ['#87A878', '#C8CDA0', '#F0EAD6', '#D4C5A9'],
        mood: 'Untuk momen yang terasa seperti napas panjang di pagi hari.',
        image_url: '/images/suasana.JPG',
    },
];

export default function MoodBoard() {
    const [palettes, setPalettes] = useState(DEFAULTS);
    const [active, setActive] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('mood_palettes')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });
                if (data && data.length > 0) setPalettes(data);
            } catch (_) {}
        })();
    }, []);

    const current = palettes[active];

    return (
        <section className="relative luxury-section bg-[#080808] overflow-hidden">
            {/* Ambient glow — matches active palette */}
            <div
                className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] pointer-events-none transition-all duration-1000"
                style={{ background: current?.colors?.[2] || '#CEB175' }}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <div className="mb-16 md:mb-20">
                    <Reveal>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-6 font-light">
                            — Inspirasi Estetika —
                        </p>
                    </Reveal>
                    <Reveal delay={200}>
                        <h2 className="font-serif text-4xl md:text-6xl font-light text-white leading-tight">
                            Temukan{' '}
                            <span className="italic gold-gradient-text">Gaya Anda</span>
                        </h2>
                    </Reveal>
                    <GoldDivider delay={0.4} width="w-20" />
                    <Reveal delay={500}>
                        <p className="text-[#A3A3A3] font-light text-sm md:text-base leading-relaxed max-w-lg font-serif italic">
                            &ldquo;Setiap pasangan membawa warna mereka sendiri. Kami membantu menemukan mana yang paling berbicara untuk hari Anda.&rdquo;
                        </p>
                    </Reveal>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Palette tabs — left */}
                    <div className="lg:col-span-4 space-y-0 divide-y divide-[#CEB175]/8 border-y border-[#CEB175]/8">
                        {palettes.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-full text-left py-6 px-2 group transition-all duration-500 ${
                                    active === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`font-serif text-lg font-light transition-colors duration-500 ${
                                        active === i ? 'text-white' : 'text-[#A3A3A3]'
                                    }`}>
                                        {p.name}
                                    </span>
                                    {active === i && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="w-1.5 h-1.5 rounded-full bg-[#CEB175]"
                                        />
                                    )}
                                </div>
                                {/* Color swatches */}
                                <div className="flex gap-1.5">
                                    {(p.colors || []).map((color, ci) => (
                                        <div
                                            key={ci}
                                            className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                                            style={{ background: color }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Active palette detail — right */}
                    <div className="lg:col-span-8">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                        >
                            {/* Image */}
                            <div className="aspect-[3/4] overflow-hidden border border-[#CEB175]/10 relative group">
                                <img
                                    src={current?.image_url}
                                    alt={current?.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000 grayscale group-hover:grayscale-0 scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Large color accent */}
                                <div className="absolute inset-0 mix-blend-color opacity-20 transition-opacity duration-1000"
                                    style={{ background: current?.colors?.[2] }} />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col justify-center gap-6 py-4">
                                {/* Keywords */}
                                <div className="flex flex-wrap gap-2">
                                    {(current?.keywords || []).map((kw, ki) => (
                                        <span
                                            key={ki}
                                            className="text-[9px] uppercase tracking-[0.4em] border border-[#CEB175]/25 px-3 py-1.5 text-[#CEB175]/70 font-light rounded-full"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>

                                {/* Large color swatches */}
                                <div className="flex gap-3">
                                    {(current?.colors || []).map((color, ci) => (
                                        <div key={ci} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-10 h-10 rounded-full border border-white/10 shadow-lg"
                                                style={{ background: color }}
                                            />
                                            <span className="text-[7px] uppercase tracking-wider text-white/30 font-mono">
                                                {color}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Mood quote */}
                                <div className="border-l border-[#CEB175]/20 pl-4">
                                    <p className="font-serif italic text-[#A3A3A3] leading-relaxed text-base">
                                        &ldquo;{current?.mood}&rdquo;
                                    </p>
                                </div>

                                {/* CTA */}
                                <a
                                    href="/#manifesto"
                                    className="group inline-flex items-center gap-3 w-fit"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#CEB175] border-b border-[#CEB175]/30 pb-0.5 group-hover:text-white group-hover:border-white transition-all duration-500">
                                        Mulai Cerita
                                    </span>
                                    <span className="text-[#CEB175] group-hover:translate-x-1 transition-transform duration-500 text-xs">→</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
