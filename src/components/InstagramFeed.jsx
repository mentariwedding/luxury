'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';

/**
 * Instagram Feed Preview — row minimal 4 foto dari Instagram.
 * Ditampilkan di dalam footer area, bukan section terpisah.
 * Data dari Supabase table 'instagram_feed' atau fallback ke portfolio.
 */
export default function InstagramFeed() {
    const [posts, setPosts] = useState([]);
    const [igUrl, setIgUrl] = useState('#');

    useEffect(() => {
        (async () => {
            // Try to get Instagram feed data
            const { data: feed } = await supabase
                .from('instagram_feed')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(4);

            if (feed && feed.length > 0) {
                setPosts(feed);
            } else {
                // Fallback: use portfolio photos
                const { data: portfolio } = await supabase
                    .from('portfolio_gallery')
                    .select('id, title, image_url')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (portfolio && portfolio.length > 0) {
                    setPosts(portfolio.map(p => ({
                        id: p.id,
                        image_url: p.image_url,
                        caption: p.title,
                    })));
                } else {
                    // Hardcoded fallback
                    setPosts([
                        { id: 1, image_url: '/images/tawalepas.JPG', caption: '' },
                        { id: 2, image_url: '/images/hangat.JPG', caption: '' },
                        { id: 3, image_url: '/images/estetik.JPG', caption: '' },
                        { id: 4, image_url: '/images/suasana.JPG', caption: '' },
                    ]);
                }
            }

            // Get Instagram URL from settings
            const { data: settings } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'instagram_url')
                .single();

            if (settings?.value) setIgUrl(settings.value);
        })();
    }, []);

    if (posts.length === 0) return null;

    return (
        <div className="mt-20 border-t border-[#CEB175]/10 pt-16">
            <Reveal>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-[#CEB175]/30" />
                        <p className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/50 font-light">
                            @mentariwedding
                        </p>
                    </div>
                    <a
                        href={igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] uppercase tracking-[0.4em] text-white/25 hover:text-[#CEB175] transition-colors duration-500"
                    >
                        Follow →
                    </a>
                </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {posts.map((post, i) => (
                    <motion.a
                        key={post.id || i}
                        href={igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative aspect-square overflow-hidden bg-[#111]"
                    >
                        <img
                            src={post.image_url}
                            alt={post.caption || 'Instagram post'}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Hover icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
