'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from './Reveal';
import SplitText from './SplitText';
import Lightbox from './Lightbox';
import { supabase } from '@/lib/supabase';

/**
 * Editorial Mood Gallery — Magazine-style asymmetric layout.
 * Tidak menampilkan harga atau detail. Hanya atmosfer.
 */
export default function Portfolio() {
    const [photos, setPhotos] = useState([
        { title: 'Pesta Penuh Tawa', category: 'Tawa Lepas', image_url: '/images/tawalepas.JPG' },
        { title: 'Detail Penuh Makna', category: 'Hangat', image_url: '/images/hangat.JPG' },
        { title: 'Momen Tak Terlupakan', category: 'Estetik', image_url: '/images/estetik.JPG' },
    ]);

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
        };

        fetchPhotos();
    }, []);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section id="portfolio" className="luxury-section px-6 md:px-12 max-w-[1500px] mx-auto">
            {/* Magazine masthead */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-28 gap-8 border-b border-[#CEB175]/10 pb-8">
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
                        <p className="text-[#A3A3A3] font-light tracking-wide leading-relaxed max-w-lg italic">
                            Tidak ada dua perayaan yang sama. Berikut, beberapa fragmen yang kami pilih untuk dibagikan.
                        </p>
                    </Reveal>
                </div>
                <Reveal delay={400}>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-light">Curated by</span>
                        <span className="font-serif italic text-lg text-[#CEB175]">Mentari Wedding</span>
                    </div>
                </Reveal>
            </div>

            {/* Magazine asymmetric grid */}
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Feature 1 - Large left */}
                {photos[0] && (
                    <EditorialCard
                        photo={photos[0]}
                        index={0}
                        className="col-span-12 md:col-span-7 h-[750px] md:h-[900px] lg:h-[1100px] w-full"
                        size="large"
                        onClick={openLightbox}
                    />
                )}

                {/* Stack right */}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6 h-[750px] md:h-[900px] lg:h-[1100px]">
                    {photos[1] && (
                        <EditorialCard
                            photo={photos[1]}
                            index={1}
                            className="flex-[1.6] w-full"
                            size="medium"
                            onClick={openLightbox}
                        />
                    )}
                    {photos[2] && (
                        <EditorialCard
                            photo={photos[2]}
                            index={2}
                            className="flex-1 w-full"
                            size="medium"
                            onClick={openLightbox}
                        />
                    )}
                </div>

                {/* Optional row 2 — extra photos if available */}
                {photos[3] && (
                    <EditorialCard
                        photo={photos[3]}
                        index={3}
                        className="col-span-12 md:col-span-4 aspect-square md:aspect-[3/4]"
                        size="medium"
                        onClick={openLightbox}
                    />
                )}
                {photos[4] && (
                    <EditorialCard
                        photo={photos[4]}
                        index={4}
                        className="col-span-12 md:col-span-4 aspect-square md:aspect-[3/4]"
                        size="medium"
                        offset
                        onClick={openLightbox}
                    />
                )}
                {photos[5] && (
                    <EditorialCard
                        photo={photos[5]}
                        index={5}
                        className="col-span-12 md:col-span-4 aspect-square md:aspect-[3/4]"
                        size="medium"
                        onClick={openLightbox}
                    />
                )}
            </div>

            {/* Magazine footnote */}
            <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#CEB175]/10 pt-8">
                <p className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">
                    Fragmen pilihan — selengkapnya hanya melalui percakapan
                </p>
                <a
                    href="#manifesto"
                    className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] border-b border-[#CEB175]/30 pb-1 hover:text-white hover:border-white transition-all duration-500"
                >
                    Mulai Percakapan
                </a>
            </div>

            {/* Lightbox */}
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

function EditorialCard({ photo, index, className = '', size = 'medium', offset = false, onClick }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
            className={`group relative overflow-hidden bg-[#0A0A0A] border border-[#CEB175]/10 cursor-pointer ${className} ${offset ? 'md:translate-y-12' : ''
                }`}
            onClick={() => onClick?.(index)}
        >
            <motion.img
                style={{ y, scale: 1.12 }}
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover opacity-65 group-hover:opacity-100 transition-opacity duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-100 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

            {/* Magazine number */}
            <div className="absolute top-5 left-5 z-20">
                <span className="text-[9px] uppercase tracking-[0.5em] text-white/70 font-light font-serif italic">
                    Pl. {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 z-20">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-px bg-[#CEB175]" />
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#CEB175] font-medium">
                        {photo.category || 'Gallery'}
                    </p>
                </div>
                <h3
                    className={`font-serif text-white font-light leading-tight italic ${size === 'large' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
                        }`}
                >
                    {photo.title}
                </h3>
            </div>
        </motion.div>
    );
}
