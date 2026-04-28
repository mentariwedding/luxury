'use client';

import React, { useEffect, useState } from 'react';
import { Compass, PenTool, Heart, Sparkles, Star, Moon } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '@/lib/supabase';

const IconMap = {
    Compass: <Compass className="w-6 h-6" />,
    PenTool: <PenTool className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
    Sparkles: <Sparkles className="w-6 h-6" />,
    Star: <Star className="w-6 h-6" />,
    Moon: <Moon className="w-6 h-6" />
};

export default function Approach() {
    const [content, setContent] = useState({
        subtitle: "Metode Kami",
        title: "Cara Kami Bekerja.",
        description: "Kami percaya kemewahan sejati ada pada detail yang mencerminkan kejujuran perasaan Anda.",
        image_url: "/images/pendekatan.JPG"
    });

    const [steps, setSteps] = useState([
        {
            title: "Visi",
            icon_name: "Compass",
            description: "Kami mendengar cerita Anda untuk menciptakan konsep yang benar-benar pribadi."
        },
        {
            title: "Detail",
            icon_name: "PenTool",
            description: "Semua elemen, dari warna hingga alur acara, kami susun dengan rapi dan teliti."
        },
        {
            title: "Eksekusi",
            icon_name: "Heart",
            description: "Kami pastikan semua berjalan lancar agar Anda bisa menikmati momen tanpa beban."
        }
    ]);

    useEffect(() => {
        const fetchContent = async () => {
            // Fetch Section Content
            const { data: sectionData } = await supabase
                .from('section_content')
                .select('*')
                .eq('section_name', 'approach')
                .single();
            
            if (sectionData) {
                setContent({
                    subtitle: sectionData.subtitle || content.subtitle,
                    title: sectionData.title || content.title,
                    description: sectionData.description || content.description,
                    image_url: sectionData.image_url || content.image_url
                });
            }

            // Fetch Section Items (Steps)
            const { data: itemsData } = await supabase
                .from('section_items')
                .select('*')
                .eq('section_name', 'approach')
                .order('display_order', { ascending: true });
            
            if (itemsData && itemsData.length > 0) {
                setSteps(itemsData);
            }
        };

        fetchContent();
    }, []);

    const titleParts = content.title.split('.');

    return (
        <section id="approach" className="py-32 bg-[#050505] relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <Reveal>
                            <p className="text-[#CEB175] text-[10px] uppercase tracking-[0.4em] mb-6">{content.subtitle}</p>
                        </Reveal>
                        <Reveal delay={200}>
                            <h2 className="font-serif text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                                {titleParts[0]} <br />
                                {titleParts[1] && <span className="italic text-[#CEB175]">{titleParts[1]}.</span>}
                            </h2>
                        </Reveal>
                        <Reveal delay={300}>
                            <p className="text-[#A3A3A3] font-light leading-relaxed mb-12 max-w-lg">
                                {content.description}
                            </p>
                        </Reveal>
                        
                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <Reveal key={index} delay={400 + (index * 150)}>
                                    <div className="flex gap-8 group">
                                        <div className="flex-shrink-0 w-12 h-12 border border-[#CEB175]/20 flex items-center justify-center text-[#CEB175] group-hover:border-[#CEB175] transition-colors duration-500">
                                            {IconMap[step.icon_name] || <Sparkles className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-white mb-2">{step.title}</h3>
                                            <p className="text-sm text-[#737373] font-light leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                    
                    <Reveal delay={500} className="relative">
                        <div className="aspect-[4/5] overflow-hidden border border-[#CEB175]/10">
                            <img 
                                src={content.image_url} 
                                alt="Our Process" 
                                className="w-full h-full object-cover opacity-70 hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-[#CEB175]/40 -z-10"></div>
                        <div className="absolute -top-6 -right-6 w-32 h-32 border-r border-t border-[#CEB175]/40 -z-10"></div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
