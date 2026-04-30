'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

/**
 * Back to Top — muncul setelah scroll jauh ke bawah.
 * Posisi di kiri bawah agar tidak conflict dengan AmbientMusic & FloatingInquiry di kanan.
 */
export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 1.5);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[60] w-11 h-11 border border-[#CEB175]/20 bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center text-[#CEB175]/60 hover:text-[#CEB175] hover:border-[#CEB175]/50 transition-all duration-500 group"
                    aria-label="Kembali ke atas"
                >
                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
