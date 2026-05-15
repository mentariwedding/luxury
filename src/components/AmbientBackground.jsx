'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Per-section ambient config: [x%, y%, opacity, size]
const AMBIENTS = {
    'portfolio':   { x: '75%',  y: '40%', opacity: 0.028, size: 600 },
    'approach':    { x: '15%',  y: '50%', opacity: 0.020, size: 500 },
    'atelier':     { x: '85%',  y: '55%', opacity: 0.025, size: 600 },
    'venues':      { x: '25%',  y: '50%', opacity: 0.022, size: 550 },
    'testimonial': { x: '8%',   y: '50%', opacity: 0.025, size: 500 },
    'whisper':     { x: '50%',  y: '50%', opacity: 0.025, size: 700 },
    'philosophy':  { x: '50%',  y: '50%', opacity: 0.025, size: 600 },
    'manifesto':   { x: '50%',  y: '50%', opacity: 0.030, size: 700 },
};

export default function AmbientBackground() {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState(null);

    // Skip on admin
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && AMBIENTS[entry.target.id]) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
        );

        sections.forEach((s) => {
            if (AMBIENTS[s.id]) observer.observe(s);
        });

        return () => observer.disconnect();
    }, [pathname]);

    const config = activeSection ? AMBIENTS[activeSection] : null;

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[1]"
            aria-hidden="true"
        >
            <AnimatePresence mode="wait">
                {config && (
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.0, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(${config.size}px circle at ${config.x} ${config.y}, rgba(206,177,117,${config.opacity}), transparent 70%)`,
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
