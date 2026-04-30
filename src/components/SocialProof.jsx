'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';

/**
 * Social Proof Counter — credibility tanpa testimoni.
 * Angka yang count-up saat di-scroll, subtle dan elegan.
 */

function useCountUp(target, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;
        let start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [target, duration, shouldStart]);

    return count;
}

export default function SocialProof() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const [stats, setStats] = useState([
        { value: 60, suffix: '+', label: 'Cerita', desc: 'Dirangkai' },
        { value: 5, suffix: '+', label: 'Tahun', desc: 'Pengalaman' },
        { value: 100, suffix: '%', label: 'Dedikasi', desc: 'Penuh Hati' },
    ]);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('section_items')
                .select('*')
                .eq('section_name', 'social_proof')
                .order('display_order', { ascending: true });

            if (data && data.length > 0) {
                setStats(data.map(d => ({
                    value: parseInt(d.title) || 0,
                    suffix: d.tag || '+',
                    label: d.description?.split('\n')[0] || '',
                    desc: d.description?.split('\n')[1] || '',
                })));
            }
        })();
    }, []);

    const count0 = useCountUp(stats[0]?.value || 0, 2000, isInView);
    const count1 = useCountUp(stats[1]?.value || 0, 1500, isInView);
    const count2 = useCountUp(stats[2]?.value || 0, 2200, isInView);
    const counts = [count0, count1, count2];

    return (
        <section ref={ref} className="relative bg-[#0A0A0A] overflow-hidden border-y border-[#CEB175]/10">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CEB175] rounded-full blur-[200px] opacity-[0.02] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10"
                 style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>

                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {stats.slice(0, 3).map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center group"
                        >
                            <p className="font-serif font-light leading-none mb-3 md:mb-4 text-white/90"
                               style={{ fontSize: 'clamp(36px, 8vw, 80px)' }}>
                                <span className="tabular-nums">{counts[i]}</span>
                                <span className="text-[#CEB175] italic" style={{ fontSize: '0.6em' }}>{stat.suffix}</span>
                            </p>
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 font-light mb-1">
                                {stat.label}
                            </p>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#CEB175]/40 font-light">
                                {stat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
