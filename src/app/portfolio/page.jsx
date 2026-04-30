'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Lightbox from '@/components/Lightbox';

const CATEGORIES = ['Semua', 'Romantic', 'Bold', 'Natural', 'Elegant', 'Garden'];

const DEFAULTS = [
    { id: 1, title: 'Pesta Penuh Tawa', category: 'Romantic', image_url: '/images/tawalepas.JPG' },
    { id: 2, title: 'Detail Penuh Makna', category: 'Elegant', image_url: '/images/hangat.JPG' },
    { id: 3, title: 'Momen Tak Terlupakan', category: 'Natural', image_url: '/images/estetik.JPG' },
    { id: 4, title: 'Sentuhan Akhir', category: 'Bold', image_url: '/images/sentuhan.JPG' },
    { id: 5, title: 'Ruang Cerita', category: 'Elegant', image_url: '/images/ruang.JPG' },
    { id: 6, title: 'Suasana Hangat', category: 'Romantic', image_url: '/images/suasana.JPG' },
];

export default function PortfolioPage() {
    const [photos, setPhotos] = useState(DEFAULTS);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('portfolio_gallery')
                .select('*')
                .order('display_order', { ascending: true });
            if (data && data.length > 0) setPhotos(data);
            setLoading(false);
        })();
    }, []);

    const filtered = activeFilter === 'Semua'
        ? photos
        : photos.filter(p => p.category === activeFilter);

    const openLightbox = (globalIndex) => {
        setLightboxIndex(globalIndex);
        setLightboxOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="grain-overlay" />

            <main className="container mx-auto px-6 md:px-12 max-w-[1400px]" style={{ paddingTop: 'clamp(100px, 14vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 md:mb-24"
                >
                    <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-6 font-light">
                        — Momen Abadi —
                    </p>
                    <h1 className="font-serif font-light text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}>
                        Karya{' '}
                        <span className="italic gold-gradient-text">Pilihan</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-20 mb-6" />
                    <p className="font-serif italic text-[#A3A3A3] text-base md:text-lg leading-relaxed max-w-xl">
                        Tidak ada dua perayaan yang sama. Setiap fragmen di bawah adalah sepenggal cerita yang kami rancang dengan penuh ketulusan.
                    </p>
                </motion.div>

                {/* ── Filter Tabs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-wrap gap-2 mb-12 md:mb-16"
                >
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`text-[9px] uppercase tracking-[0.4em] px-5 py-2.5 rounded-full border transition-all duration-500 font-light ${
                                activeFilter === cat
                                    ? 'bg-[#CEB175] border-[#CEB175] text-black'
                                    : 'border-white/10 text-white/40 hover:border-[#CEB175]/40 hover:text-white/70'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <span className="ml-auto self-center text-[9px] uppercase tracking-[0.4em] text-white/20 font-light">
                        {filtered.length} karya
                    </span>
                </motion.div>

                {/* ── Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.02] rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                        >
                            {filtered.map((photo, idx) => {
                                // Find global index in photos array for lightbox
                                const globalIdx = photos.findIndex(p => p.id === photo.id);
                                return (
                                    <motion.div
                                        key={photo.id || idx}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                        className={`group relative overflow-hidden cursor-pointer border border-[#CEB175]/8 bg-[#0A0A0A] ${
                                            idx % 7 === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
                                        }`}
                                        onClick={() => openLightbox(globalIdx >= 0 ? globalIdx : idx)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={photo.image_url}
                                            alt={photo.title}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-[1200ms]"
                                        />
                                        {/* Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                                        {/* Gold corner */}
                                        <div className="absolute top-0 right-0 w-8 h-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                            <div className="absolute top-0 right-0 w-full h-px bg-[#CEB175]/60" />
                                            <div className="absolute top-0 right-0 w-px h-full bg-[#CEB175]/60" />
                                        </div>
                                        {/* Caption */}
                                        <div className="absolute bottom-0 left-0 w-full z-20 p-5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="w-4 h-px bg-[#CEB175]" />
                                                <p className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175] font-medium">
                                                    {photo.category || 'Gallery'}
                                                </p>
                                            </div>
                                            <h2 className="font-serif text-white font-light text-base md:text-lg leading-tight italic">
                                                {photo.title}
                                            </h2>
                                        </div>
                                        {/* Plate number */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-light font-serif italic">
                                                Pl. {String(idx + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}

                {filtered.length === 0 && !loading && (
                    <div className="text-center py-24">
                        <p className="font-serif italic text-white/30 text-2xl mb-2">Belum ada karya dalam kategori ini.</p>
                        <button onClick={() => setActiveFilter('Semua')} className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/60 hover:text-[#CEB175] transition-colors">
                            Lihat semua →
                        </button>
                    </div>
                )}

                {/* ── CTA Footer ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-20 md:mt-28 text-center border-t border-[#CEB175]/10 pt-16"
                >
                    <p className="text-[9px] uppercase tracking-[0.6em] text-white/20 mb-6">
                        Fragmen pilihan — selengkapnya hanya melalui percakapan
                    </p>
                    <a
                        href="/#manifesto"
                        className="group inline-flex items-center gap-5 border border-[#CEB175]/40 px-12 py-5 rounded-full hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700"
                    >
                        <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">
                            Mulai Cerita
                        </span>
                        <span className="w-6 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700" />
                    </a>
                </motion.div>
            </main>

            {/* Lightbox */}
            <Lightbox
                images={photos}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(i) => setLightboxIndex(i)}
            />
        </div>
    );
}
