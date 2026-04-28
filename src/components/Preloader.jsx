'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunMedium } from 'lucide-react';

export default function Preloader() {
    // null = belum diputuskan; true = tampilkan; false = jangan
    const [show, setShow] = useState(null);
    const [phase, setPhase] = useState('enter'); // enter -> hold -> exit -> done

    useEffect(() => {
        // Hanya tampil sekali per sesi browser tab
        if (typeof window === 'undefined') return;

        const seen = sessionStorage.getItem('mw_preloader_seen');
        if (seen) {
            setShow(false);
            return;
        }

        setShow(true);
        sessionStorage.setItem('mw_preloader_seen', '1');

        const t1 = setTimeout(() => setPhase('hold'), 600);
        const t2 = setTimeout(() => setPhase('exit'), 1900);
        const t3 = setTimeout(() => setPhase('done'), 3100);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    if (show === null || show === false || phase === 'done') return null;

    const isExiting = phase === 'exit';

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Curtain top — slides up on exit */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: isExiting ? '-100%' : 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#050505]"
            />
            {/* Curtain bottom — slides down on exit */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: isExiting ? '100%' : 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#050505]"
            />

            {/* Center content */}
            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center">
                            {/* Sun icon — breathing scale, not pulse */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{
                                    opacity: 1,
                                    scale: [0.95, 1.02, 0.95],
                                }}
                                transition={{
                                    opacity: { duration: 0.8, ease: 'easeOut' },
                                    scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                                }}
                                className="mb-8"
                            >
                                <SunMedium
                                    className="w-10 h-10 text-[#CEB175]"
                                    strokeWidth={1}
                                />
                            </motion.div>

                            {/* Brand name — letter reveal */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <span className="font-serif text-xl md:text-2xl tracking-[0.5em] text-white/90 uppercase font-light">
                                    Mentari
                                </span>
                            </motion.div>

                            {/* Gold line — draws from center outward */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1.0, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="h-px w-32 bg-gradient-to-r from-transparent via-[#CEB175] to-transparent mt-6 origin-center"
                            />

                            {/* Whisper tagline */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.0, delay: 1.1 }}
                                className="font-serif italic text-[10px] tracking-[0.4em] text-[#CEB175]/60 uppercase mt-6"
                            >
                                woven in light
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
