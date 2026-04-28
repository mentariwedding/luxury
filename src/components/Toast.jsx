'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <Check className="w-4 h-4" />,
    error:   <AlertTriangle className="w-4 h-4" />,
    info:    <Info className="w-4 h-4" />,
};

const COLORS = {
    success: { border: 'border-[#CEB175]/30', bg: 'bg-[#CEB175]/5',  text: 'text-[#CEB175]', icon: 'text-[#CEB175]' },
    error:   { border: 'border-red-500/30',    bg: 'bg-red-500/5',    text: 'text-red-400',    icon: 'text-red-400'   },
    info:    { border: 'border-white/10',       bg: 'bg-white/5',      text: 'text-white/70',   icon: 'text-white/50'  },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-20 right-4 sm:top-24 sm:right-8 z-[9998] flex flex-col gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const c = COLORS[toast.type] || COLORS.info;
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
                                exit={{   opacity: 0, x: 60, filter: 'blur(4px)' }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl ${c.border} ${c.bg}`}
                            >
                                <span className={`shrink-0 ${c.icon}`}>{ICONS[toast.type]}</span>
                                <p className={`text-[10px] uppercase tracking-[0.2em] flex-1 ${c.text}`}>
                                    {toast.message}
                                </p>
                                <button onClick={() => removeToast(toast.id)}
                                    className="shrink-0 text-white/20 hover:text-white/50 transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}
