'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinimalistTooltip({ children, text, delay = 0.4 }) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), delay * 1000);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    return (
        <div 
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, x: 8 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 2, x: 4 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-full ml-3 pointer-events-none whitespace-nowrap"
                        style={{ zIndex: 9999 }}
                    >
                        <span 
                            className="text-[10px] italic tracking-[0.08em] text-[#CEB175]/70 leading-relaxed"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {text}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
