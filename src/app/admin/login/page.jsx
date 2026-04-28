'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { SunMedium, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';

const shakeAnim = {
    shake: { x: [0, -12, 12, -8, 8, -4, 4, 0], transition: { duration: 0.45 } },
    idle:  { x: 0 },
};

export default function AdminLogin() {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [shake,    setShake]    = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [touched,  setTouched]  = useState({ email: false, password: false });
    const router = useRouter();
    const toast  = useToast();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passValid  = password.length >= 6;

    const handleLogin = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!emailValid || !passValid) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setLoading(false);
        } else {
            toast('Selamat datang kembali!', 'success');
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-[#040404] flex"
             style={{ fontFamily: "'Montserrat', sans-serif" }}>

            {/* Left — Brand Panel */}
            <motion.div
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-[45%] flex-col justify-between p-16 border-r border-white/[0.05] relative overflow-hidden">
                {/* Gold top rule */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#CEB175]/60 to-transparent" />
                {/* Ambient */}
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CEB175]/[0.04] rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    <SunMedium className="w-4 h-4 text-[#CEB175]" />
                    <span className="font-serif text-base tracking-[0.12em] text-white/80">Mentari Wedding</span>
                </div>

                <div className="relative z-10">
                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/50 mb-8">Administrative Suite</p>
                    <h1 className="font-serif font-light text-white leading-[0.9] mb-10"
                        style={{ fontSize: 'clamp(42px, 5vw, 72px)' }}>
                        Selamat<br/>
                        <span className="italic text-white/30">Datang</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-24 mb-8" />
                    <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase leading-relaxed max-w-[200px]">
                        Pusat kendali digital Mentari Wedding
                    </p>
                </div>

                <p className="text-[8px] uppercase tracking-[0.5em] text-white/12 relative z-10">
                    © 2026 Mentari Wedding
                </p>
            </motion.div>

            {/* Right — Form Panel */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
                {/* Top rule */}
                <div className="absolute top-0 left-0 right-0 h-px bg-[#CEB175]/40" />
                {/* Ambient */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CEB175]/[0.025] rounded-full blur-[130px] pointer-events-none" />

                {/* Mobile brand */}
                <div className="lg:hidden flex items-center gap-3 mb-16">
                    <SunMedium className="w-4 h-4 text-[#CEB175]" />
                    <span className="font-serif text-base tracking-[0.12em]">Mentari Wedding</span>
                </div>

                <div className="relative z-10 max-w-sm">
                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Masuk ke Suite</p>
                    <h2 className="font-serif text-4xl font-light text-white mb-12 leading-tight">
                        Verifikasi<br/><span className="italic text-white/40">Identitas</span>
                    </h2>

                    <motion.form onSubmit={handleLogin} className="space-y-8"
                        variants={shakeAnim} animate={shake ? 'shake' : 'idle'}>
                        {/* Email */}
                        <div className="space-y-2 group">
                            <label className="text-[7px] uppercase tracking-[0.5em] text-white/35 group-focus-within:text-[#CEB175] transition-colors duration-300">
                                Email
                            </label>
                            <input type="email" value={email}
                                onChange={e => { setEmail(e.target.value); setError(null); }}
                                onBlur={() => setTouched(p => ({ ...p, email: true }))}
                                required placeholder="admin@mentariwedding.com"
                                className={`w-full bg-transparent border-b py-3 text-sm text-white placeholder:text-white/10 focus:outline-none transition-colors duration-400 ${
                                    touched.email && !emailValid
                                        ? 'border-red-500/50 focus:border-red-400'
                                        : 'border-white/[0.1] focus:border-[#CEB175]/50'
                                }`} />
                            <AnimatePresence>
                                {touched.email && !emailValid && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="text-[9px] text-red-400/70 tracking-wide">
                                        Format email tidak valid
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password */}
                        <div className="space-y-2 group">
                            <label className="text-[7px] uppercase tracking-[0.5em] text-white/35 group-focus-within:text-[#CEB175] transition-colors duration-300">
                                Password
                            </label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password}
                                    onChange={e => { setPassword(e.target.value); setError(null); }}
                                    onBlur={() => setTouched(p => ({ ...p, password: true }))}
                                    required placeholder="••••••••"
                                    className={`w-full bg-transparent border-b py-3 pr-10 text-sm text-white placeholder:text-white/10 focus:outline-none transition-colors duration-400 ${
                                        touched.password && !passValid
                                            ? 'border-red-500/50 focus:border-red-400'
                                            : 'border-white/[0.1] focus:border-[#CEB175]/50'
                                    }`} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {touched.password && !passValid && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="text-[9px] text-red-400/70 tracking-wide">
                                        Minimal 6 karakter
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Server Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="text-[10px] text-red-400/80 tracking-wide border-l-2 border-red-500/30 pl-3">
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <button type="submit" disabled={loading}
                            className="group flex items-center gap-4 mt-4 disabled:opacity-40">
                            <span className="text-[9px] uppercase tracking-[0.5em] text-white group-hover:text-[#CEB175] transition-colors duration-400">
                                {loading ? 'Memverifikasi...' : 'Masuk'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#CEB175] group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}
