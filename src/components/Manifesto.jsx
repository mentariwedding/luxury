'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';
import InquiryForm from './InquiryForm';

/* Inline count-up hook — no extra dependency */
function useCountUp(target, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        const startTime = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [target, duration, shouldStart]);
    return count;
}

/**
 * "By Inquiry Only" — Manifesto eksklusivitas brand.
 * Tidak ada harga, tidak ada paket. Hanya ajakan untuk memulai percakapan.
 */
export default function Manifesto() {
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-80px' });
    const c0 = useCountUp(60, 2000, statsInView);
    const c1 = useCountUp(5, 1500, statsInView);
    const c2 = useCountUp(100, 2200, statsInView);
    const [inquiryOpen, setInquiryOpen] = useState(false);

    const [content, setContent] = useState({
        subtitle: 'Selectively Curated',
        title: 'By Inquiry Only.',
        description:
            'Kami memilih untuk merancang hanya sejumlah perayaan dalam setahun. Bukan karena terbatas, tetapi karena setiap cerita layak mendapatkan ruang yang utuh.',
        cta_text: 'Begin the Conversation',
    });
    const [whatsapp, setWhatsapp] = useState('628123456789');

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'manifesto')
                .single();
            if (data) {
                setContent({
                    subtitle: data.subtitle || content.subtitle,
                    title: data.title || content.title,
                    description: data.description || content.description,
                    cta_text: data.cta_text || content.cta_text,
                });
            }

            const { data: wa } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'whatsapp_number')
                .single();
            if (wa?.value) setWhatsapp(wa.value);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const trackClick = async () => {
        try {
            await supabase.from('inquiry_clicks').insert([
                {
                    source: 'manifesto',
                    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                    referrer: typeof document !== 'undefined' ? document.referrer : null,
                },
            ]);
        } catch (_) {
            // silent fail — tracking tidak boleh blokir CTA
        }
    };

    const titleParts = (content.title || '').split('.');
    const waMessage = encodeURIComponent('Halo Mentari Wedding, saya tertarik untuk memulai percakapan tentang perayaan kami.');

    return (
        <>
        <section
            id="manifesto"
            className="relative bg-[#0A0A0A] overflow-hidden border-y border-[#CEB175]/10"
            style={{ paddingTop: 'clamp(100px, 16vh, 200px)', paddingBottom: 'clamp(100px, 16vh, 200px)' }}
        >
            {/* Decorative giant text background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            >
                <span className="font-serif italic text-[28vw] md:text-[20vw] leading-none text-white/[0.018] whitespace-nowrap tracking-tighter">
                    Inquiry
                </span>
            </div>

            {/* Subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CEB175] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                <div className="text-center">
                    <Reveal>
                        <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-10 font-light">
                            — {content.subtitle} —
                        </p>
                    </Reveal>

                    <Reveal delay={200}>
                        <h2 className="font-serif font-light text-white leading-[0.95] tracking-tight mb-12 text-balance"
                            style={{ fontSize: 'clamp(48px, 9vw, 140px)' }}>
                            {titleParts[0]}
                            {titleParts[1] !== undefined && (
                                <span className="italic gold-gradient-text">.</span>
                            )}
                        </h2>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/30 to-transparent w-24 mx-auto mb-12" />
                    </Reveal>

                    <Reveal delay={500}>
                        <p className="font-light text-base md:text-lg text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed mb-16 tracking-wide">
                            {content.description}
                        </p>
                    </Reveal>

                    {/* Stats strip — merged from SocialProof */}
                    <Reveal delay={550}>
                        <div
                            ref={statsRef}
                            className="flex justify-center gap-12 md:gap-20 mb-14 border-y border-[#CEB175]/8 py-8"
                        >
                            {[
                                { count: c0, suffix: '+', label: 'Cerita Dirangkai' },
                                { count: c1, suffix: '+', label: 'Tahun Pengalaman' },
                                { count: c2, suffix: '%', label: 'Dedikasi Penuh Hati' },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <p className="font-serif font-light text-white/90 leading-none mb-1.5" style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
                                        <span className="tabular-nums">{s.count}</span>
                                        <span className="text-[#CEB175] italic" style={{ fontSize: '0.6em' }}>{s.suffix}</span>
                                    </p>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-light">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={600}>
                        {/* Scarcity indicator — slot dots */}
                        <div className="flex flex-col items-center gap-4 mb-12">
                            <div className="flex items-center gap-1.5">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-full transition-all duration-300 ${
                                            i < 9
                                                ? 'w-2 h-2 bg-[#CEB175]/15'
                                                : 'w-2.5 h-2.5 bg-[#CEB175]'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/50 font-light">
                                3 Celebrations Remaining · 2025
                            </span>
                        </div>
                    </Reveal>

                    <Reveal delay={700}>
                        <button
                            onClick={() => setInquiryOpen(true)}
                            className="inline-flex items-center gap-5 group border border-[#CEB175]/40 px-12 py-6 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700 relative overflow-hidden mb-6"
                        >
                            <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700 relative z-10">
                                {content.cta_text}
                            </span>
                            <span className="w-8 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700 relative z-10" />
                            <ArrowUpRight className="w-4 h-4 text-[#CEB175] group-hover:text-black group-hover:rotate-45 transition-all duration-700 relative z-10" />
                        </button>
                    </Reveal>

                    <Reveal delay={900}>
                        <p className="mt-12 text-[10px] uppercase tracking-[0.5em] text-white/20 italic font-serif">
                            A limited number of celebrations each year.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
        <InquiryForm isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
        </>
    );
}
