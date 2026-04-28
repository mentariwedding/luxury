'use client';

import React, { useEffect, useState } from 'react';
import { Diamond, Feather, ShieldCheck, Heart, Sparkles, Star } from 'lucide-react';
import Reveal from './Reveal';
import SplitText from './SplitText';
import { supabase } from '@/lib/supabase';

const IconMap = {
    Diamond: <Diamond className="w-6 h-6 text-[#CEB175]" />,
    Feather: <Feather className="w-6 h-6 text-[#CEB175]" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#CEB175]" />,
    Heart: <Heart className="w-6 h-6 text-[#CEB175]" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#CEB175]" />,
    Star: <Star className="w-6 h-6 text-[#CEB175]" />
};

export default function Philosophy() {
    const [content, setContent] = useState({
        subtitle: "Filosofi Mentari Wedding",
        title: "Dedikasi untuk Hari Anda"
    });

    const [features, setFeatures] = useState([
        { title: "Eksklusif", icon_name: "Diamond", description: "Kami hanya melayani sedikit klien untuk memastikan setiap pernikahan mendapatkan perhatian penuh." },
        { title: "Personal", icon_name: "Feather", description: "Setiap dekorasi dan alur acara kami buat khusus sesuai dengan karakter unik Anda." },
        { title: "Tenang", icon_name: "ShieldCheck", description: "Kami menjaga semua detail teknis agar Anda bisa menikmati hari bahagia dengan tenang." }
    ]);

    useEffect(() => {
        const fetchContent = async () => {
            // Fetch Section Content
            const { data: sectionData } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'philosophy')
                .single();
            
            if (sectionData) {
                setContent({
                    subtitle: sectionData.subtitle || content.subtitle,
                    title: sectionData.title || content.title
                });
            }

            // Fetch Section Items (Features)
            const { data: itemsData } = await supabase
                .from('section_items')
                .select('*')
                .eq('section_name', 'philosophy')
                .order('display_order', { ascending: true });
            
            if (itemsData && itemsData.length > 0) {
                setFeatures(itemsData);
            }
        };

        fetchContent();
    }, []);

    const titleParts = content.title.split('untuk');

    return (
        <section id="philosophy" className="luxury-section relative bg-[#0A0A0A] border-y border-[#1A1A1A]">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CEB175] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="text-center mb-24">
                    <Reveal>
                        <SplitText 
                            text={content.subtitle}
                            className="text-[#CEB175] text-[10px] uppercase tracking-[0.5em] mb-4"
                        />
                    </Reveal>
                    <h2 className="font-serif text-4xl md:text-5xl font-light text-white">
                        <SplitText text={titleParts[0] + (titleParts[1] ? 'untuk ' : '')} delay={200} /> 
                        {titleParts[1] && (
                            <span className="italic text-[#CEB175]">
                                <SplitText text={titleParts[1].trim()} delay={600} />
                            </span>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                    {features.map((feature, i) => (
                        <Reveal key={i} delay={400 + (i * 200)}>
                            <div className="text-center group px-4">
                                <div className="w-16 h-16 mx-auto border border-[#CEB175]/10 flex items-center justify-center mb-10 group-hover:border-[#CEB175]/40 transition-all duration-700 bg-[#050505]">
                                    <div className="group-hover:scale-110 transition-transform duration-700">
                                        {IconMap[feature.icon_name] || <Sparkles className="w-6 h-6 text-[#CEB175]" />}
                                    </div>
                                </div>
                                <h3 className="font-serif text-2xl font-light text-white mb-4 tracking-wide">{feature.title}</h3>
                                <p className="text-[#737373] group-hover:text-[#A3A3A3] transition-colors font-light text-[13px] leading-relaxed tracking-wide max-w-[280px] mx-auto">
                                    {feature.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
