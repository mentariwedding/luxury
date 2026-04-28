'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function FloatingGoldThread() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            {/* Floating Gold Thread - Left Side */}
            <motion.div
                className="fixed left-[clamp(16px,2vw,32px)] top-0 w-[1px] h-full pointer-events-none z-[100]"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(206, 177, 117, 0.08) 20%, rgba(206, 177, 117, 0.12) 50%, rgba(206, 177, 117, 0.08) 80%, transparent 100%)',
                    scaleY: scaleY,
                    transformOrigin: 'top'
                }}
            />

            {/* Subtle Gold Accent Dot - Top */}
            <motion.div
                className="fixed left-[calc(clamp(16px,2vw,32px)-3px)] top-[15vh] w-[7px] h-[7px] rounded-full pointer-events-none z-[101]"
                style={{
                    background: 'radial-gradient(circle, rgba(206, 177, 117, 0.6) 0%, rgba(206, 177, 117, 0) 70%)',
                    scale: scaleY,
                    transformOrigin: 'top'
                }}
            />

            {/* Subtle Gold Accent Dot - Bottom */}
            <motion.div
                className="fixed left-[calc(clamp(16px,2vw,32px)-3px)] bottom-[15vh] w-[7px] h-[7px] rounded-full pointer-events-none z-[101]"
                style={{
                    background: 'radial-gradient(circle, rgba(206, 177, 117, 0) 30%, rgba(206, 177, 117, 0.6) 70%)',
                    scale: scaleY,
                    transformOrigin: 'top'
                }}
            />
        </>
    );
}
