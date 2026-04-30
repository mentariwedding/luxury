'use client';

import React, { useRef, useEffect, useState } from 'react';
import Reveal from './Reveal';
import GoldDivider from './GoldDivider';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Signature() {
    const containerRef = useRef(null);
    const [content, setContent] = useState({
        subtitle: "Karakter Kami",
        title: "Sentuhan yang Abadi & Timeless.",
        description: "Di Mentari Wedding, kami tidak mengejar tren yang cepat hilang. Kami berfokus pada estetika yang akan tetap terlihat indah puluhan tahun dari sekarang.\n\nSetiap acara yang kami tangani memiliki ciri khas: perpaduan antara kemewahan yang tenang, detail yang rapi, dan suasana yang hangat.",
        quote: "Menghadirkan keindahan yang jujur, tanpa harus berlebihan.",
        image_url: "/images/signature.JPG"
    });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'signature')
                .single();
            
            if (data && !error) {
                setContent({
                    subtitle: data.subtitle || content.subtitle,
                    title: data.title || content.title,
                    description: data.description || content.description,
                    quote: data.cta_text || content.quote,
                    image_url: data.image_url || content.image_url
                });
            }
        };

        fetchContent();
    }, []);

    // Split paragraphs
    const paragraphs = content.description.split('\n\n');
    const titleParts = content.title.split('&');

    return (
        <section id="signature" ref={containerRef} className="luxury-section bg-[#0A0A0A] relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <Reveal delay={200} className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative max-w-md mx-auto lg:mx-0">
                            <div className="aspect-[3/4] overflow-hidden border border-[#CEB175]/20 rounded-sm">
                                <motion.img
                                    style={{ y, scale: 1.2 }}
                                    src={content.image_url}
                                    alt="Mentari Signature Style"
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-[#050505] px-6 py-5 border border-[#CEB175]/20 hidden md:block z-10 shadow-2xl">
                                <p className="font-serif text-[#CEB175] text-xs italic mb-1 tracking-[0.2em]">Est. 2019</p>
                                <p className="text-white text-[9px] uppercase tracking-[0.45em] font-light">Sukabumi, Jawa Barat</p>
                            </div>
                        </div>
                    </Reveal>
                    
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <Reveal>
                            <p className="gold-gradient-text text-[10px] uppercase tracking-[0.4em] mb-6 font-medium">{content.subtitle}</p>
                        </Reveal>
                        <Reveal delay={200}>
                            <h2 className="font-serif text-4xl md:text-6xl font-light text-white mb-4 leading-tight">
                                {titleParts[0]} <br />
                                {titleParts[1] && <span className="italic gold-gradient-text">& {titleParts[1]}</span>}
                            </h2>
                        </Reveal>
                        <GoldDivider delay={0.3} width="w-14" />
                        <Reveal delay={400} className="space-y-6 text-[#A3A3A3] font-light leading-relaxed max-w-lg text-sm md:text-base">
                            {paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                            <div className="pt-8 mt-4 border-t border-[#CEB175]/10">
                                <p className="italic gold-gradient-text font-serif text-xl md:text-2xl opacity-90">
                                    "{content.quote}"
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
