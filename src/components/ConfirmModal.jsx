'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState({ 
        open: false, title: '', message: '', 
        confirmText: 'Hapus', cancelText: 'Batal', 
        type: 'danger', resolve: null 
    });

    const confirm = useCallback((title, message, options = {}) => {
        return new Promise((resolve) => {
            setState({ 
                open: true, title, message, 
                confirmText: options.confirmText || 'Hapus',
                cancelText: options.cancelText || 'Batal',
                type: options.type || 'danger',
                resolve 
            });
        });
    }, []);

    const handleClose = (result) => {
        state.resolve?.(result);
        setState(prev => ({ ...prev, open: false, resolve: null }));
    };

    const isDanger = state.type === 'danger';

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <AnimatePresence>
                {state.open && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
                         style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => handleClose(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1,    y: 0  }}
                            exit={{   opacity: 0, scale: 0.95, y: 10  }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 bg-[#0a0a0a] border border-white/[0.08] p-8 max-w-sm w-full"
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 flex items-center justify-center mb-5 border ${
                                isDanger 
                                    ? 'bg-red-500/10 border-red-500/15 text-red-400' 
                                    : 'bg-[#CEB175]/10 border-[#CEB175]/15 text-[#CEB175]'
                            }`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <h3 className="font-serif text-xl font-light text-white mb-2">
                                {state.title}
                            </h3>
                            <p className="text-[10px] text-white/40 leading-relaxed tracking-wide mb-8">
                                {state.message}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => handleClose(false)}
                                    className="px-5 py-2.5 text-[9px] uppercase tracking-[0.35em] text-white/40 hover:text-white/70 transition-colors duration-300 border border-white/[0.06] hover:border-white/[0.12]">
                                    {state.cancelText}
                                </button>
                                <button onClick={() => handleClose(true)}
                                    className={`px-5 py-2.5 text-[9px] uppercase tracking-[0.35em] border transition-all duration-300 ${
                                        isDanger
                                            ? 'bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white'
                                            : 'bg-[#CEB175]/15 text-[#CEB175] border-[#CEB175]/20 hover:bg-[#CEB175] hover:text-black'
                                    }`}>
                                    {state.confirmText}
                                </button>
                            </div>

                            {/* Close */}
                            <button onClick={() => handleClose(false)}
                                className="absolute top-4 right-4 text-white/15 hover:text-white/40 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>');
    return ctx;
}
