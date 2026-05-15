'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const TRACKED = [
    { id: 'portfolio',   label: 'Editorial' },
    { id: 'approach',    label: 'Metode'    },
    { id: 'signature',   label: 'Karakter'  },
    { id: 'atelier',     label: 'Atelier'   },
    { id: 'venues',      label: 'Venues'    },
    { id: 'testimonial', label: 'Couple'    },
    { id: 'whisper',     label: 'Whisper'   },
    { id: 'philosophy',  label: 'Filosofi'  },
    { id: 'manifesto',   label: 'Inquiry'   },
];

export default function SectionCounter() {
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    // Only show on homepage
    if (pathname !== '/') return null;

    useEffect(() => {
        const observers = [];

        TRACKED.forEach((section, i) => {
            const el = document.getElementById(section.id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex(i);
                        setVisible(true);
                    }
                },
                { threshold: 0.3, rootMargin: '-15% 0px -15% 0px' }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    return (
        <div className="hidden lg:flex fixed right-8 xl:right-12 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 pointer-events-none select-none">
            <AnimatePresence mode="wait">
                <motion.span
                    key={activeIndex}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: visible ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif italic text-[#CEB175] tabular-nums leading-none"
                    style={{ fontSize: '11px' }}
                >
                    {String(activeIndex + 1).padStart(2, '0')}
                </motion.span>
            </AnimatePresence>

            <div className="w-px h-10 bg-gradient-to-b from-[#CEB175]/40 to-transparent" />

            <span
                className="font-light text-white/15 tabular-nums leading-none"
                style={{ fontSize: '9px' }}
            >
                {String(TRACKED.length).padStart(2, '0')}
            </span>

            <AnimatePresence mode="wait">
                <motion.span
                    key={`label-${activeIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 0.35 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white/35 font-light uppercase mt-1"
                    style={{
                        fontSize: '7px',
                        letterSpacing: '0.35em',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                    }}
                >
                    {TRACKED[activeIndex]?.label}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
