'use client';

import React, { useEffect, useState } from 'react';
import Reveal from './Reveal';
import { supabase } from '@/lib/supabase';

export default function Partners() {
    const [partners, setPartners] = useState([
        'BVLGARI', 'VERA WANG', 'RITZ-CARLTON', 'CARTIER', 'DIOR', 'VOGUE'
    ]);

    useEffect(() => {
        const fetchPartners = async () => {
            const { data, error } = await supabase
                .from('section_items')
                .select('title')
                .eq('section_name', 'partners')
                .order('display_order', { ascending: true });
            
            if (data && data.length > 0 && !error) {
                setPartners(data.map(item => item.title));
            }
        };

        fetchPartners();
    }, []);

    return (
        <section className="py-16 bg-[#050505] overflow-hidden border-y border-[#CEB175]/10">
            <Reveal delay={200}>
                <div className="flex items-center group">
                    <div className="flex animate-marquee-content items-center group-hover:[animation-play-state:paused] cursor-default">
                        {[1, 2].map((loopIndex) => (
                            <div key={loopIndex} className="flex items-center justify-around min-w-full px-8 gap-20">
                                {partners.map((partner, i) => (
                                    <span 
                                        key={i}
                                        className="text-white font-serif text-2xl md:text-3xl tracking-widest opacity-40 transition-all duration-500 hover:!opacity-100 hover:text-[#CEB175] hover:scale-110"
                                    >
                                        {partner}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
