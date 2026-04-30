'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * GoldDivider — Animated gold underline yang "menggambar dirinya sendiri"
 * dari kiri ke kanan saat elemen masuk viewport.
 * Digunakan sebagai visual accent di bawah section headlines.
 */
export default function GoldDivider({ delay = 0, className = '', width = 'w-16' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <div ref={ref} className={`${width} overflow-hidden my-6 ${className}`}>
            <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                    duration: 1.4,
                    ease: [0.22, 1, 0.36, 1],
                    delay,
                }}
                style={{ originX: 0 }}
                className="h-px bg-gradient-to-r from-[#CEB175] via-[#CEB175]/60 to-transparent"
            />
        </div>
    );
}
