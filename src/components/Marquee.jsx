'use client';

import React from 'react';

/**
 * Luxury Marquee Divider — teks berjalan horizontal ala fashion house.
 * Dipakai sebagai pemisah antar section untuk menambah brand identity.
 */
export default function Marquee() {
    const items = [
        'Planned to Perfection',
        'By Inquiry Only',
        'Woven in Light',
        'Mentari Wedding',
    ];

    const separator = (
        <span className="mx-6 md:mx-10 text-[#CEB175]/40 font-serif text-lg select-none">✦</span>
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
