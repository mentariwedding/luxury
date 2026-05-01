'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FALLBACK_ITEMS = [
    'Planned to Perfection',
    'By Inquiry Only',
    'Woven in Light',
    'Mentari Wedding',
];

/**
 * Luxury Marquee Divider — menampilkan nama vendor/partner dari database.
 * Fallback ke tagline brand jika data partners belum tersedia.
 */
export default function Marquee() {
    const [items, setItems] = useState(FALLBACK_ITEMS);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('section_items')
                .select('title')
                .eq('section_name', 'partners')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            if (data && data.length > 0) {
                setItems(data.map(d => d.title));
            }
        })();
    }, []);

    const separator = (
        <span className="mx-12 md:mx-20 text-[#CEB175]/40 font-serif text-lg select-none">✦</span>
    );

    const content = items.map((item, i) => (
        <React.Fragment key={i}>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/30 font-light whitespace-nowrap hover:text-[#CEB175]/60 transition-colors duration-700">
                {item}
            </span>
            {separator}
        </React.Fragment>
    ));

    return (
        <div className="relative overflow-hidden py-10 md:py-14 bg-[#050505] border-y border-[#CEB175]/5 gold-shimmer">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-content">
                {/* Duplicate content for seamless loop */}
                {content}{content}{content}{content}
            </div>
        </div>
    );
}

