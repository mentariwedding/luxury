'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * Floating "Whisper to Us" CTA
 * Persistent floating button (bottom-right) yang membuka WhatsApp.
 * Tampil setelah user scroll lebih dari 1 viewport untuk tidak menutupi hero.
 */
export default function FloatingInquiry() {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [whatsapp, setWhatsapp] = useState('628123456789');

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'whatsapp_number')
                .single();
            if (data?.value) setWhatsapp(data.value);
        })();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClick = async (e) => {
        // Track click silently
        try {
            await supabase.from('inquiry_clicks').insert([
                {
                    source: 'floating',
                    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                    referrer: typeof document !== 'undefined' ? document.referrer : null,
                },
            ]);
        } catch (_) {
            // silent
        }
    };

    const waMessage = encodeURIComponent(
        'Halo Mentari Wedding, saya tertarik untuk memulai percakapan tentang perayaan kami.',
    );

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex items-end gap-3"
                >
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="hidden sm:block bg-[#050505] border border-[#CEB175]/30 backdrop-blur-xl p-5 max-w-[260px] shadow-2xl shadow-black/60 mb-1"
                            >
                                <p className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175] mb-3 font-light">
                                    Sebuah Bisikan
                                </p>
                                <p className="font-serif italic text-sm text-white/80 leading-relaxed mb-4">
                                    &ldquo;Ceritakan rencana kalian. Kami mendengarkan dengan sepenuh hati.&rdquo;
                                </p>
                                <a
                                    href={`https://wa.me/${whatsapp}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleClick}
                                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-[#CEB175] hover:text-white transition-colors duration-500 group"
                                >
                                    Mulai
                                    <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform duration-500" />
                                </a>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main floating button */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setExpanded((p) => !p)}
                            className="hidden sm:flex w-14 h-14 border border-[#CEB175]/30 bg-[#050505]/90 backdrop-blur-xl items-center justify-center text-[#CEB175] hover:bg-[#CEB175] hover:text-black hover:border-[#CEB175] transition-all duration-500 shadow-2xl shadow-black/60 group"
                            aria-label={expanded ? 'Tutup' : 'Buka pesan'}
                        >
                            {expanded ? (
                                <X className="w-4 h-4" />
                            ) : (
                                <span className="text-[9px] uppercase tracking-[0.3em] font-light">Whisper</span>
                            )}
                            {/* Pulse */}
                            {!expanded && (
                                <span className="absolute inset-0 border border-[#CEB175]/40 animate-ping opacity-50" />
                            )}
                        </button>

                        {/* Mobile: direct link, no expand */}
                        <a
                            href={`https://wa.me/${whatsapp}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClick}
                            className="sm:hidden flex items-center gap-2 px-5 py-3 border border-[#CEB175]/40 bg-[#050505]/95 backdrop-blur-xl text-[#CEB175] hover:bg-[#CEB175] hover:text-black hover:border-[#CEB175] transition-all duration-500 shadow-2xl shadow-black/60"
                        >
                            <span className="text-[9px] uppercase tracking-[0.3em] font-light">Whisper</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
