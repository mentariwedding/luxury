'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Luxury Lightbox — modal untuk zoom portfolio images.
 * Minimalist, dark, dengan navigasi kiri/kanan.
 */
export default function Lightbox({ images = [], currentIndex = 0, isOpen = false, onClose, onNavigate }) {
    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;
        if (e.key === 'Escape') onClose?.();
        if (e.key === 'ArrowLeft') onNavigate?.(Math.max(0, currentIndex - 1));
        if (e.key === 'ArrowRight') onNavigate?.(Math.min(images.length - 1, currentIndex + 1));
    }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const current = images[currentIndex];
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;

    return (
        <AnimatePresence>
            {isOpen && current && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-light">
                            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Navigation arrows */}
                    {hasPrev && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNavigate?.(currentIndex - 1); }}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center text-white/30 hover:text-[#CEB175] transition-colors duration-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    {hasNext && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNavigate?.(currentIndex + 1); }}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center text-white/30 hover:text-[#CEB175] transition-colors duration-300"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    {/* Image */}
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={current.image_url}
                            alt={current.title || ''}
                            className="max-w-full max-h-[75vh] object-contain"
                        />

                        {/* Caption */}
                        {(current.title || current.category) && (
                            <div className="mt-6 text-center">
                                {current.category && (
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#CEB175]/60 mb-2">
                                        {current.category}
                                    </p>
                                )}
                                {current.title && (
                                    <p className="font-serif italic text-white/70 text-lg">
                                        {current.title}
                                    </p>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
