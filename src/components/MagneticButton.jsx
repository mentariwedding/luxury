'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * MagneticButton — wraps any element with a magnetic pull effect.
 * The content subtly moves toward the cursor when hovering nearby.
 * Disabled on touch devices automatically.
 *
 * Usage: <MagneticButton><button>...</button></MagneticButton>
 */
export default function MagneticButton({ children, className = '', strength = 0.3, ...props }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20, restDelta: 0.001 });
    const springY = useSpring(y, { stiffness: 200, damping: 20, restDelta: 0.001 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * strength);
        y.set((e.clientY - cy) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
