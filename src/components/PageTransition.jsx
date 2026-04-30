'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * PageTransition — overlay hitam slide in/out antar navigasi halaman.
 * Hitam solid turun dari atas saat leave, naik keluar saat enter.
 * Tidak aktif di halaman admin.
 */
export default function PageTransition() {
    const pathname = usePathname();
    const [displayPath, setDisplayPath] = useState(pathname);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (pathname !== displayPath) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setDisplayPath(pathname);
                setIsAnimating(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [pathname, displayPath]);

    // Skip admin
    if (pathname?.startsWith('/admin')) return null;

    return (
        <AnimatePresence>
            {isAnimating && (
                <motion.div
                    key="page-transition"
                    initial={{ scaleY: 0, transformOrigin: 'top' }}
                    animate={{ scaleY: 1, transformOrigin: 'top' }}
                    exit={{ scaleY: 0, transformOrigin: 'bottom' }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9990] bg-[#050505] pointer-events-none"
                >
                    {/* Gold center mark during transition */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#CEB175]/40">
                                <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1"/>
                                <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
