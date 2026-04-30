'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Reveal from './Reveal';
import SplitText from './SplitText';
import Lightbox from './Lightbox';
import GoldDivider from './GoldDivider';
import { supabase } from '@/lib/supabase';
import { PortfolioSkeleton } from './GoldSkeleton';

/**
 * Editorial Mood Gallery — Magazine-style layout.
 * Row 1: Large feature (7 cols) + two stacked right (5 cols, 3fr/2fr split).
 * Row 2: Three equal-proportion photos.
 */
export default function Portfolio() {
    const [photos, setPhotos] = useState([
        { title: 'Pesta Penuh Tawa', category: 'Tawa Lepas', image_url: '/images/tawalepas.JPG' },
        { title: 'Detail Penuh Makna', category: 'Hangat', image_url: '/images/hangat.JPG' },
        { title: 'Momen Tak Terlupakan', category: 'Estetik', image_url: '/images/estetik.JPG' },
    ]);
    const [photosLoading, setPhotosLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            const { data, error } = await supabase
                .from('portfolio_gallery')
                .select('*')
                .order('display_order', { ascending: true })
                .limit(6);

            if (data && data.length > 0 && !error) {
                setPhotos(data);
            }
            setPhotosLoading(false);
        };
        fetchPhotos();
    }, []);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section id="portfolio" className="luxury-section px-6 md:px-12 max-w-[1500px] mx-auto">

            {/* Magazine masthead */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 border-b border-[#CEB175]/10 pb-10">
                <div className="max-w-2xl relative">
                    <div className="absolute -left-12 -top-8 text-[10vw] font-serif italic text-white/[0.025] select-none pointer-events-none hidden lg:block leading-none">
                        Editorial
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-6 font-light">— Issue No. 01</p>
                    <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 relative z-10 leading-[1.05]">
                        <SplitText text="Momen " />
                        <span className="italic gold-gradient-text">
                            <SplitText text="Abadi" delay={400} />
                        </span>
                    </h2>
                    <Reveal delay={800}>
                        <p className="text-[#A3A3A3] font-light tracking-wide leading-relaxed max-w-lg italic font-serif">
                            Tidak ada dua perayaan yang sama. Berikut, beberapa fragmen yang kami pilih untuk dibagikan.
                        </p>
                    </Reveal>
                    <GoldDivider delay={0.4} width="w-20" />
                </div>
                <Reveal delay={400}>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-light">Curated by</span>
                        <span className="font-serif italic text-lg text-[#CEB175]">Mentari Wedding</span>
                    </div>
                </Reveal>
            </div>

            {photosLoading ? (
                <PortfolioSkeleton />
            ) : (
                <>
                {/* ── Row 1: Hero Spread ── */}
                <div className="grid grid-cols-12 gap-2 md:gap-3 mb-2 md:mb-3">

                    {/* Large feature — left */}
                    {photos[0] && (
                        <EditorialCard
                            photo={photos[0]}
                            index={0}
                            className="col-span-12 lg:col-span-7 h-[420px] sm:h-[500px] md:h-[560px] lg:h-[760px]"
                            size="large"
                            onClick={openLightbox}
                        />
                    )}

                    {/* Two stacked — right (3fr top, 2fr bottom) */}
                    <div className="col-span-12 lg:col-span-5 grid lg:grid-rows-[3fr_2fr] gap-2 md:gap-3 lg:h-[760px]">
                        {photos[1] && (
                            <EditorialCard
                                photo={photos[1]}
                                index={1}
                                className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-full"
                                size="medium"
                                onClick={openLightbox}
                            />
                        )}
                        {photos[2] && (
                            <EditorialCard
                                photo={photos[2]}
                                index={2}
                                className="h-[200px] sm:h-[240px] md:h-[270px] lg:h-full"
                                size="medium"
                                onClick={openLightbox}
                            />
                        )}
                    </div>
                </div>

                {/* ── Row 2: Three equal columns ── */}
                {(photos[3] || photos[4] || photos[5]) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                        {[3, 4, 5].map((i) =>
                            photos[i] ? (
                                <EditorialCard
                                    key={i}
                                    photo={photos[i]}
                                    index={i}
                                    className="aspect-[4/3] w-full"
                                    size="small"
                                    onClick={openLightbox}
                                />
                            ) : null
                        )}
                    </div>
                )}
                </>
            )}

            {/* Magazine footnote */}
            <div className="mt-16 md:mt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#CEB175]/10 pt-8">
                <p className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">
                    Fragmen pilihan — selengkapnya hanya melalui percakapan
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="/portfolio"
                        className="text-[10px] uppercase tracking-[0.5em] text-white/30 border-b border-white/15 pb-1 hover:text-[#CEB175] hover:border-[#CEB175]/40 transition-all duration-500"
                    >
                        Lihat Semua Karya
                    </a>
                    <span className="text-white/10">·</span>
                    <a
                        href="#manifesto"
                        className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] border-b border-[#CEB175]/30 pb-1 hover:text-white hover:border-white transition-all duration-500"
                    >
                        Mulai Percakapan
                    </a>
                </div>
            </div>


            <Lightbox
                images={photos}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(i) => setLightboxIndex(i)}
            />
        </section>
    );
}

/* ─────────────────────────────────────────────────── */
/*  Editorial Card                                      */
/* ─────────────────────────────────────────────────── */
function EditorialCard({ photo, index, className = '', size = 'medium', onClick }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

    // 3D Tilt — mouse tracking (desktop only)
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
    const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e) => {
        const card = ref.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);  // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
        rotateY.set(dx * 5);   // max 5 degrees
        rotateX.set(-dy * 4);  // max 4 degrees
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
            className={`group relative overflow-hidden bg-[#0A0A0A] border border-[#CEB175]/8 cursor-pointer ${className}`}
            style={{ borderColor: 'rgba(206,177,117,0.08)', rotateX: springX, rotateY: springY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick?.(index)}
        >
            {/* Parallax image */}
            <motion.img
                style={{ y, scale: 1.1 }}
                src={photo.image_url}
                alt={photo.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-[1200ms]"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 z-10 pointer-events-none" />

            {/* Hover vignette — luxury cinematic edge */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }} />

            {/* Plate number — top left */}
            <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] uppercase tracking-[0.5em] text-white/50 font-light font-serif italic">
                    Pl. {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Gold corner accent — top right, appears on hover */}
            <div className="absolute top-0 right-0 w-8 h-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-px bg-[#CEB175]/60" />
                <div className="absolute top-0 right-0 w-px h-full bg-[#CEB175]/60" />
            </div>

            {/* Caption — bottom */}
            <div className="absolute bottom-0 left-0 w-full z-20 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-px bg-[#CEB175]" />
                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175] font-medium">
                        {photo.category || 'Gallery'}
                    </p>
                </div>
                <h3 className={`font-serif text-white font-light leading-tight italic ${
                    size === 'large' ? 'text-xl md:text-3xl' :
                    size === 'medium' ? 'text-lg md:text-xl' :
                    'text-base md:text-lg'
                }`}>
                    {photo.title}
                </h3>
            </div>
        </motion.div>
    );
}
