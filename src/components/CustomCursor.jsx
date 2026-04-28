'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const dotX    = useMotionValue(-100);
    const dotY    = useMotionValue(-100);
    const scale   = useMotionValue(1);

    const springX = useSpring(cursorX, { damping: 25, stiffness: 200, mass: 0.5 });
    const springY = useSpring(cursorY, { damping: 25, stiffness: 200, mass: 0.5 });
    const springScale = useSpring(scale, { damping: 20, stiffness: 300 });

    const isTouch = useRef(false);

    useEffect(() => {
        // Detect touch device
        const checkTouch = () => { isTouch.current = true; };
        window.addEventListener('touchstart', checkTouch, { once: true });

        const onMove = (e) => {
            if (isTouch.current) return;
            cursorX.set(e.clientX - 20);
            cursorY.set(e.clientY - 20);
            dotX.set(e.clientX - 3);
            dotY.set(e.clientY - 3);
        };

        const onDown = () => scale.set(0.7);
        const onUp   = () => scale.set(1);

        const onEnterInteractive = () => scale.set(1.8);
        const onLeaveInteractive = () => scale.set(1);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup',   onUp);

        // Enlarge on interactive elements
        const observe = () => {
            document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
                .forEach(el => {
                    el.addEventListener('mouseenter', onEnterInteractive);
                    el.addEventListener('mouseleave', onLeaveInteractive);
                });
        };

        observe();
        const observer = new MutationObserver(observe);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup',   onUp);
            window.removeEventListener('touchstart', checkTouch);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Outer ring — smooth follow */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference hidden md:block"
                style={{
                    x: springX,
                    y: springY,
                    scale: springScale,
                    width:  40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid rgba(206, 177, 117, 0.5)',
                    backgroundColor: 'transparent',
                }}
            />
            {/* Inner dot — instant */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
                style={{
                    x: dotX,
                    y: dotY,
                    width:  6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#CEB175',
                }}
            />
        </>
    );
}
