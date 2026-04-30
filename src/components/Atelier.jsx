'use client';

import React, { useEffect, useState } from 'react';
import Reveal from './Reveal';
import SplitText from './SplitText';
import GoldDivider from './GoldDivider';
import { supabase } from '@/lib/supabase';

export default function Atelier() {
    const [content, setContent] = useState({
        subtitle: "The Atelier",
        title: "Estetika Kami.",
        description: "Keindahan sejati lahir dari detail yang sederhana namun bermakna."
    });

    const [pillars, setPillars] = useState([
        {
            tag: "Material",
            title: "Sentuhan Halus",
            description: "Kami memilih material berkualitas—dari kain sutra hingga detail terkecil—untuk memberikan kenyamanan yang elegan.",
            image_url: "/images/sentuhan.JPG"
        },
        {
            tag: "Harmoni",
            title: "Ruang yang Seimbang",
            description: "Setiap elemen ditata dengan rapi agar menciptakan suasana yang indah dan menenangkan mata.",
            image_url: "/images/ruang.JPG"
        },
        {
            tag: "Cahaya",
            title: "Suasana Hangat",
            description: "Pencahayaan yang diatur dengan tepat untuk membangun emosi dan kehangatan di setiap sudut acara.",
            image_url: "/images/suasana.JPG"
        }
    ]);

    useEffect(() => {
        const fetchContent = async () => {
            // Fetch Section Content
            const { data: sectionData } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'atelier')
                .single();
            
            if (sectionData) {
                setContent({
                    subtitle: sectionData.subtitle || content.subtitle,
                    title: sectionData.title || content.title,
                    description: sectionData.description || content.description
                });
            }

            // Fetch Section Items (Pillars)
            const { data: itemsData } = await supabase
                .from('section_items')
                .select('*')
                .eq('section_name', 'atelier')
                .order('display_order', { ascending: true });
            
            if (itemsData && itemsData.length > 0) {
                setPillars(itemsData);
            }
        };

        fetchContent();
    }, []);

    return (
        <section id="atelier" className="luxury-section bg-[#050505] section-ambient">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-3xl mb-24">
                    <Reveal>
                        <SplitText 
                            text={content.subtitle}
                            className="text-[#CEB175] text-[10px] uppercase tracking-[0.4em] mb-6"
                        />
                    </Reveal>
                    <h2 className="font-serif text-4xl md:text-7xl font-light text-white mb-8 leading-[1.1]">
                        {content.title.split(' ').map((word, i) => (
                            <React.Fragment key={i}>
                                {word.includes('.') ? (
                                    <span className="italic text-[#CEB175]">
                                        <SplitText text={word} delay={600} />
                                    </span>
                                ) : (
                                    <>
                                        <SplitText text={word} delay={200} />
                                        {' '}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </h2>
                    <Reveal delay={1000}>
                        <p className="text-[#A3A3A3] font-light leading-relaxed max-w-xl italic">
                            &ldquo;{content.description}&rdquo;
                        </p>
                    </Reveal>
                    <GoldDivider delay={0.5} width="w-16" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-20">
                    {pillars.map((pillar, index) => (
                        <Reveal key={index} delay={200 + (index * 200)}>
                            <div className="flex flex-col group cursor-pointer">
                                <div className="aspect-[3/4] overflow-hidden mb-8 bg-[#111]">
                                    <img
                                        src={pillar.image_url}
                                        alt={pillar.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
                                    />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-[#CEB175]/30"></div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEB175]">{pillar.tag}</span>
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-4 font-light tracking-[0.05em]">{pillar.title}</h3>
                                <p className="text-[13px] text-[#737373] group-hover:text-[#A3A3A3] transition-colors leading-relaxed font-light tracking-wide">
                                    {pillar.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>


                {/* Lookbook CTA */}
                <Reveal delay={800}>
                    <div className="mt-20 md:mt-28 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-[#CEB175]/10 pt-10">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light mb-2">Koleksi Visual</p>
                            <p className="font-serif italic text-[#A3A3A3] text-lg font-light">
                                Lihat dunia estetika kami yang lebih dalam.
                            </p>
                        </div>
                        <a
                            href={`https://wa.me/628123456789?text=${encodeURIComponent('Halo Mentari Wedding, saya ingin melihat Lookbook Anda.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 flex-shrink-0"
                        >
                            <span className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] border-b border-[#CEB175]/30 pb-1 group-hover:text-white group-hover:border-white transition-all duration-500">
                                Request Our Lookbook
                            </span>
                            <div className="w-8 h-8 border border-[#CEB175]/30 rounded-full flex items-center justify-center group-hover:bg-[#CEB175] group-hover:border-[#CEB175] transition-all duration-500">
                                <span className="text-[#CEB175] group-hover:text-black text-xs transition-colors duration-500">↗</span>
                            </div>
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
