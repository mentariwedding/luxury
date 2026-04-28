'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SoftFocusTransitions({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, filter: 'blur(12px)', y: 5 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(12px)', y: -5 }}
                transition={{ 
                    duration: 0.6, 
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
