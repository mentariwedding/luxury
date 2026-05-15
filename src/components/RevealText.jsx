'use client';

import { motion } from 'framer-motion';

/**
 * RevealText — wraps a line of text in a clip-path mask.
 * The text slides upward into view when entering the viewport.
 *
 * For multi-line headings, wrap each line individually.
 *
 * Usage:
 *   <RevealText delay={0}>
 *     <h2>Your Headline</h2>
 *   </RevealText>
 */
export default function RevealText({ children, delay = 0, className = '' }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: '105%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                    duration: 1.0,
                    ease: [0.22, 1, 0.36, 1],
                    delay: delay / 1000,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
