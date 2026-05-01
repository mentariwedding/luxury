'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import GoldSkeleton from '@/components/GoldSkeleton';

export default function KisahDetailPage() {
    const { slug } = useParams();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        (async () => {
            const { data } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();
            if (data) setEntry(data);
            else setNotFound(true);
            setLoading(false);
        })();
    }, [slug]);

    return (
        <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="grain-overlay" />

            <main className="max-w-[900px] mx-auto px-6 md:px-12"
                style={{ paddingTop: 'clamp(100px, 14vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>

                {/* Loading */}
                {loading && (
                    <div className="space-y-6">
                        <GoldSkeleton className="w-1/4 h-3" />
                        <GoldSkeleton className="w-full h-12" />
                        <GoldSkeleton className="w-3/4 h-8" />
                        <GoldSkeleton className="w-full aspect-[16/9]" rounded="md" />
                        {[...Array(6)].map((_, i) => (
                            <GoldSkeleton key={i} className={`w-${i % 3 === 0 ? 'full' : i % 3 === 1 ? '5/6' : '4/5'} h-4`} />
                        ))}
                    </div>
                )}

                {/* Not found */}
                {notFound && !loading && (
                    <div className="text-center py-32">
                        <p className="font-serif italic text-white/30 text-3xl mb-4">Kisah ini tidak ditemukan.</p>
                        <Link href="/kisah" className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/60 hover:text-[#CEB175] transition-colors">
                            ← Kembali ke Semua Kisah
                        </Link>
                    </div>
                )}

                {/* Content */}
                {entry && !loading && (
                    <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-10">
                            <span className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/70">{entry.aesthetic_tag}</span>
                            {entry.venue_hint && <><span className="text-white/10">·</span><span className="text-[8px] uppercase tracking-[0.4em] text-white/25">{entry.venue_hint}</span></>}
                            {entry.season && <><span className="text-white/10">·</span><span className="text-[8px] uppercase tracking-[0.4em] text-white/25">{entry.season}</span></>}
                        </div>

                        {/* Title */}
                        <h1 className="font-serif font-light text-white leading-[1.1] mb-6"
                            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
                            {entry.title}
                        </h1>

                        {/* Tagline */}
                        {entry.tagline && (
                            <p className="font-serif italic text-[#CEB175]/70 text-lg md:text-xl leading-relaxed mb-10 border-l-2 border-[#CEB175]/20 pl-6">
                                {entry.tagline}
                            </p>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-24 mb-10" />

                        {/* Cover image */}
                        {entry.cover_image && (
                            <div className="mb-14 overflow-hidden border border-[#CEB175]/8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={entry.cover_image} alt={entry.title}
                                    className="w-full aspect-[16/9] object-cover opacity-80"
                                />
                            </div>
                        )}

                        {/* Content body */}
                        <div className="font-serif font-light text-[#A3A3A3] leading-[1.9] space-y-6"
                            style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>
                            {(entry.content || '').split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        {/* Bottom divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/20 to-transparent w-full my-16" />

                        {/* End note */}
                        <p className="text-center text-[9px] uppercase tracking-[0.6em] text-white/15 font-light mb-12">
                            — Ditulis oleh Mentari Wedding —
                        </p>

                        {/* CTA */}
                        <div className="text-center">
                            <a href="/#manifesto"
                                className="group inline-flex items-center gap-5 border border-[#CEB175]/40 px-10 py-4 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700">
                                <span className="text-[9px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">
                                    Mulai Cerita
                                </span>
                                <span className="w-5 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700" />
                            </a>
                        </div>

                        {/* Back */}
                        <div className="text-center mt-10">
                            <Link href="/kisah"
                                className="text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white/50 transition-colors duration-500">
                                ← Kisah Lainnya
                            </Link>
                        </div>
                    </motion.article>
                )}
            </main>
        </div>
    );
}
