'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import GoldSkeleton from '@/components/GoldSkeleton';
import Reveal from '@/components/Reveal';

const DEFAULTS = [
    { id: 1, slug: 'sabtu-di-lereng-gunung', title: 'Sebuah Sabtu di Lereng Gunung', tagline: 'Ketika kabut turun tepat saat ijab kabul, kami tahu alam pun ikut menjadi saksi.', aesthetic_tag: 'Natural', venue_hint: 'Lereng Gunung, Sukabumi Selatan', season: 'Musim Hujan 2024', cover_image: '/images/tawalepas.JPG' },
    { id: 2, slug: 'ketika-hujan-menjadi-rencana', title: 'Ketika Hujan Menjadi Bagian dari Rencananya', tagline: 'Tidak ada yang bisa mengontrol cuaca. Tapi ada yang bisa memilih cara merayakannya.', aesthetic_tag: 'Elegant', venue_hint: 'Kediaman Keluarga, Bogor', season: 'Musim Hujan 2023', cover_image: '/images/hangat.JPG' },
    { id: 3, slug: 'taman-yang-menunggu', title: 'Taman yang Sudah Menunggu Dua Tahun', tagline: 'Mereka menunda pernikahannya dua kali. Ketika akhirnya tiba, semuanya terasa sempurna.', aesthetic_tag: 'Romantic', venue_hint: 'Taman Keluarga, Sukabumi Utara', season: 'Musim Kemarau 2024', cover_image: '/images/estetik.JPG' },
];

export default function KisahPage() {
    const [entries, setEntries] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('journal_entries')
                .select('id, slug, title, tagline, aesthetic_tag, venue_hint, season, cover_image')
                .eq('is_published', true)
                .order('display_order', { ascending: true });
            if (data && data.length > 0) setEntries(data);
            setLoading(false);
        })();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="grain-overlay" />

            <main className="container mx-auto px-6 md:px-12 max-w-[1200px]"
                style={{ paddingTop: 'clamp(100px, 14vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>

                {/* Page Header */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mb-16 md:mb-24">
                    <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-6 font-light">— Kisah —</p>
                    <h1 className="font-serif font-light text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}>
                        Setiap Perayaan,{' '}
                        <span className="italic gold-gradient-text">Sebuah Cerita</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-20 mb-6" />
                    <p className="font-serif italic text-[#A3A3A3] text-base md:text-lg leading-relaxed max-w-xl">
                        Tidak ada nama. Tidak ada detail yang mengidentifikasi. Hanya cerita — karena setiap momen terbaik layak untuk diceritakan, bukan diekspos.
                    </p>
                </motion.div>

                {/* Entries */}
                {loading ? (
                    <div className="space-y-16">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <GoldSkeleton className="aspect-[16/10] w-full" rounded="md" />
                                <div className="flex flex-col gap-4 justify-center">
                                    <GoldSkeleton className="w-1/3 h-3" />
                                    <GoldSkeleton className="w-full h-8" />
                                    <GoldSkeleton className="w-4/5 h-5" />
                                    <GoldSkeleton className="w-full h-4" />
                                    <GoldSkeleton className="w-full h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-20 md:space-y-32">
                        {entries.map((entry, i) => (
                            <Reveal key={entry.id || i} delay={i * 80}>
                                <Link href={`/kisah/${entry.slug}`} className="group block">
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                                        {/* Cover image */}
                                        <div className="overflow-hidden border border-[#CEB175]/8 bg-[#0A0A0A] aspect-[16/10] relative" style={{ direction: 'ltr' }}>
                                            {entry.cover_image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={entry.cover_image} alt={entry.title}
                                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[1200ms]"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="font-serif italic text-white/10 text-4xl">{String(i + 1).padStart(2, '0')}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            {/* Gold corner */}
                                            <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute top-0 right-0 w-full h-px bg-[#CEB175]/60" />
                                                <div className="absolute top-0 right-0 w-px h-full bg-[#CEB175]/60" />
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div style={{ direction: 'ltr' }} className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 h-px bg-[#CEB175]/50" />
                                                <span className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/70 font-light">{entry.aesthetic_tag}</span>
                                            </div>
                                            <h2 className="font-serif font-light text-white group-hover:text-[#CEB175] transition-colors duration-500 leading-tight"
                                                style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
                                                {entry.title}
                                            </h2>
                                            <p className="font-serif italic text-[#A3A3A3] leading-relaxed text-sm md:text-base">
                                                {entry.tagline}
                                            </p>
                                            <div className="flex items-center gap-6 mt-2">
                                                <span className="text-[8px] uppercase tracking-[0.4em] text-white/25">{entry.venue_hint}</span>
                                                <span className="text-white/10">·</span>
                                                <span className="text-[8px] uppercase tracking-[0.4em] text-white/25">{entry.season}</span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/60 group-hover:text-[#CEB175] transition-colors duration-500">
                                                Baca Cerita <span className="w-6 h-px bg-current" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}

                {entries.length === 0 && !loading && (
                    <div className="text-center py-24">
                        <p className="font-serif italic text-white/30 text-2xl">Belum ada cerita yang diterbitkan.</p>
                    </div>
                )}

                {/* CTA Footer */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.8 }} className="mt-24 text-center border-t border-[#CEB175]/10 pt-16">
                    <p className="text-[9px] uppercase tracking-[0.6em] text-white/15 mb-8">Setiap cerita dimulai dari percakapan</p>
                    <a href="/#manifesto"
                        className="group inline-flex items-center gap-5 border border-[#CEB175]/40 px-12 py-5 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">Mulai Cerita</span>
                        <span className="w-6 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700" />
                    </a>
                </motion.div>
            </main>
        </div>
    );
}
