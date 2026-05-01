'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal — animasi fade+slide saat element masuk viewport.
 * Punya mountDelay (default 420ms) agar tidak bentrok dengan
 * PageTransition overlay yang sedang fade-out saat navigasi.
 */
export default function Reveal({ children, className = "", delay = 0, mountDelay = 420 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [ready, setReady] = useState(false);

    // Tunggu PageTransition selesai sebelum mulai observe
    useEffect(() => {
        const t = setTimeout(() => setReady(true), mountDelay);
        return () => clearTimeout(t);
    }, [mountDelay]);

    useEffect(() => {
        if (!ready) return;

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.08 }
        );

        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    }, [ready]);

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? 'active' : ''} ${className}`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    );
}
