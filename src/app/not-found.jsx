'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            {/* Grain overlay */}
            <div className="grain-overlay" />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CEB175] rounded-full blur-[250px] opacity-[0.025] pointer-events-none" />

            {/* Gold thread — left */}
            <div className="fixed left-6 md:left-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#CEB175]/10 to-transparent pointer-events-none" />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

                {/* 404 number */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-[10px] uppercase tracking-[0.8em] text-[#CEB175]/50 mb-8 font-light">
                        — 404 —
                    </p>
                </motion.div>

                {/* Main text */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif font-light text-white leading-[1.1] mb-8"
                    style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}
                >
                    Halaman ini seperti{' '}
                    <span className="italic gold-gradient-text">momen terbaik</span>
                    {' '}—{' '}
                    <br className="hidden md:block" />
                    tak ditemukan lagi.
                </motion.h1>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/40 to-transparent w-32 mx-auto mb-8"
                />

                {/* Sub text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0, delay: 0.7 }}
                    className="text-[#A3A3A3] font-light text-sm md:text-base leading-relaxed mb-14 font-serif italic"
                >
                    Tapi setiap cerita yang indah selalu menemukan jalannya.
                    <br />
                    Biarkan kami membantu menemukan jalan itu.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-4 border border-[#CEB175]/40 px-10 py-4 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700"
                    >
                        <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">
                            Kembali ke Beranda
                        </span>
                    </Link>

                    <Link
                        href="/#manifesto"
                        className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175]/60 hover:text-[#CEB175] transition-colors duration-500 font-light pb-0.5 border-b border-[#CEB175]/20 hover:border-[#CEB175]/50"
                    >
                        Hubungi Kami
                    </Link>
                </motion.div>

                {/* Brand footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0, delay: 1.2 }}
                    className="mt-20"
                >
                    <p className="text-[9px] uppercase tracking-[0.6em] text-white/15 font-serif italic">
                        Mentari Wedding · Est. 2019 · Sukabumi
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
