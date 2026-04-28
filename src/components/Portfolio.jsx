'use client';

import React, { useEffect, useState } from 'react';
import Reveal from './Reveal';
import SplitText from './SplitText';
import { supabase } from '@/lib/supabase';

export default function Portfolio() {
    const [photos, setPhotos] = useState([
        { title: 'Pesta Penuh Tawa', category: 'Tawa Lepas', image_url: '/images/tawalepas.JPG' },
        { title: 'Detail Penuh Makna', category: 'Hangat', image_url: '/images/hangat.JPG' },
        { title: 'Momen Tak Terlupakan', category: 'Estetik', image_url: '/images/estetik.JPG' }
    ]);

    useEffect(() => {
        const fetchPhotos = async () => {
            const { data, error } = await supabase
                .from('portfolio_gallery')
                .select('*')
                .order('display_order', { ascending: true })
                .limit(3);
            
            if (data && data.length > 0 && !error) {
                setPhotos(data);
            }
        };

        fetchPhotos();
    }, []);

    return (
        <section id="portfolio" className="luxury-section px-6 md:px-12 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="max-w-2xl relative">
                    <div className="absolute -left-12 top-0 text-[10vw] font-serif text-white/[0.03] select-none pointer-events-none hidden lg:block">
                        Gallery
                    </div>
                    <h2 className="font-serif text-4xl md:text-6xl font-light text-white mb-6 relative z-10">
                        <SplitText text="Momen " />
                        <span className="italic text-[#CEB175]">
                            <SplitText text="Abadi" delay={400} />
                        </span>
                    </h2>
                    <Reveal delay={800}>
                        <p className="text-[#A3A3A3] font-light tracking-wide leading-relaxed max-w-lg border-l border-[#CEB175]/20 pl-6">Sekilas tentang perayaan cinta yang telah kami susun. Setiap detail dirancang untuk mencerminkan kepribadian unik dari setiap pasangan.</p>
                    </Reveal>
                </div>
                <Reveal delay={400}>
                    <button className="text-[#CEB175] text-[10px] uppercase tracking-[0.5em] border-b border-[#CEB175]/30 pb-2 hover:text-white hover:border-white transition-all duration-500">
                        Eksplorasi Galeri
                    </button>
                </Reveal>
            </div>

            {/* Luxury Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[600px] md:h-[900px]">

                {/* Card 1 (Massive feature) */}
                {photos[0] && (
                    <div className="md:col-span-7 md:row-span-2 group relative overflow-hidden bg-[#111] border border-[#CEB175]/10">
                        <img 
                            src={photos[0].image_url} 
                            alt={photos[0].title} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                            <p className="text-[#CEB175] text-xs uppercase tracking-[0.3em] mb-3 font-medium">
                                {photos[0].category || 'Gallery'}
                            </p>
                            <h3 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight">
                                {photos[0].title}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Card 2 (Top Right) */}
                {photos[1] && (
                    <div className="md:col-span-5 group relative h-[400px] md:h-full overflow-hidden bg-[#111] border border-[#CEB175]/10">
                        <img 
                            src={photos[1].image_url} 
                            alt={photos[1].title} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                            <p className="text-[#CEB175] text-xs uppercase tracking-[0.3em] mb-2 font-medium">
                                {photos[1].category || 'Gallery'}
                            </p>
                            <h3 className="font-serif text-2xl md:text-3xl text-white font-light">
                                {photos[1].title}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Card 3 (Bottom Right) */}
                {photos[2] && (
                    <div className="md:col-span-5 group relative h-[400px] md:h-full overflow-hidden bg-[#111] border border-[#CEB175]/10">
                        <img 
                            src={photos[2].image_url} 
                            alt={photos[2].title} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                            <p className="text-[#CEB175] text-xs uppercase tracking-[0.3em] mb-2 font-medium">
                                {photos[2].category || 'Gallery'}
                            </p>
                            <h3 className="font-serif text-2xl md:text-3xl text-white font-light">
                                {photos[2].title}
                            </h3>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

