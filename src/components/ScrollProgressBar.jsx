'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * ScrollProgressBar — garis tipis emas horizontal di paling atas viewport.
 * Mengikuti progress scroll dari atas ke bawah halaman.
 * Tidak muncul di halaman /admin.
 */
export default function ScrollProgressBar() {
    const pathname = usePathname();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
    });

    // Sembunyikan di admin
    if (pathname?.startsWith('/admin')) return null;

    return (
        <motion.div
            style={{
                scaleX,
                transformOrigin: 'left',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '1.5px',
                background: 'linear-gradient(to right, #B59554, #CEB175, #E8D399, #CEB175)',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        />
    );
}
