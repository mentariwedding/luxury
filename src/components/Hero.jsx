'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import SplitText from './SplitText';
import { supabase } from '@/lib/supabase';

export default function Hero() {
    const [content, setContent] = useState({
        title: "Rayakan Cinta, Penuh Makna.",
        subtitle: "Merangkai Momen dengan Ketulusan",
        description: "Kami percaya setiap pernikahan adalah cerita unik yang layak dirayakan dengan sempurna.",
        image_url: "/images/hero.JPG"
    });

    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'hero')
                .single();
            
            if (data && !error) {
                setContent({
                    title: data.title || content.title,
                    subtitle: data.subtitle || content.subtitle,
                    description: data.description || content.description,
                    image_url: data.image_url || content.image_url
                });
            }
        };

        fetchContent();
    }, []);

    // Split title for effect if it contains comma
    const titleParts = content.title.split(',');

    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-[#CEB175]/10 rounded-full animate-float-slow"></div>
                <div className="absolute bottom-[20%] right-[15%] w-48 h-48 border border-[#CEB175]/5 rounded-full animate-float-slower"></div>
                <div className="absolute top-[40%] right-[10%] w-2 h-2 bg-[#CEB175]/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-[#CEB175]/40 rounded-full animate-ping"></div>
            </div>

            {/* Subtle Video Background or Motion Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050505]/40 z-10"></div>
                <img 
                    src={content.image_url} 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-60 scale-110 animate-[subtle-zoom_20s_infinite_alternate]"
                />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-24 flex flex-col items-center">
                <Reveal>
                    <SplitText 
                        text={content.subtitle}
                        className="text-[10px] md:text-xs font-light tracking-[0.5em] text-[#CEB175] uppercase mb-8 opacity-80"
                        stagger={0.05}
                    />
                </Reveal>
                
                <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-light leading-[1.1] text-white mb-10 drop-shadow-2xl">
                    {titleParts[0] && <><SplitText text={titleParts[0] + (titleParts[1] ? ',' : '')} delay={300} /> <br /></>}
                    {titleParts[1] && (
                        <span className="italic gold-gradient-text relative inline-block">
                            <SplitText text={titleParts[1].trim()} delay={800} />
                            <div className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CEB175]/30 to-transparent"></div>
                        </span>
                    )}
                </h1>

                <Reveal delay={1200}>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-light max-w-2xl mx-auto mb-12 tracking-[0.1em] leading-relaxed uppercase opacity-80">
                        {content.description}
                    </p>
                </Reveal>
                <Reveal delay={1400}>
                    <div className="w-px h-12 bg-[#CEB175]/30 mx-auto mb-8"></div>
                </Reveal>
            </div>

            {/* Scroll Indicator - More Elegant & Minimalist */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175]/60 font-light">Scroll</span>
                <div className="w-px h-16 bg-gradient-to-b from-[#CEB175] to-transparent"></div>
            </div>
        </section>
    );
}

