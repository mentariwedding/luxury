'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SunMedium, LogOut, X, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from '@/components/Toast';
import { ConfirmProvider } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

const NAV = [
    { label: 'Dashboard',  href: '/admin',          exact: true },
    { label: 'Konten',     href: '/admin/content'               },
    { label: 'Whispers',   href: '/admin/whispers'              },
    { label: 'Galeri',     href: '/admin/gallery'               },
    { label: 'Venues',     href: '/admin/venues'                },
    { label: 'Instagram',  href: '/admin/instagram'             },
    { label: 'Pengaturan', href: '/admin/settings'              },
];

export default function AdminLayout({ children }) {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobile,  setMobile]  = useState(false);
    const router   = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user && pathname !== '/admin/login') router.push('/admin/login');
            else setUser(user);
            setLoading(false);
        })();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!session && pathname !== '/admin/login') router.push('/admin/login');
            else setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };
    const isActive = (item) => item.exact ? pathname === item.href : pathname.startsWith(item.href);

    if (pathname === '/admin/login') return <ToastProvider><ConfirmProvider>{children}</ConfirmProvider></ToastProvider>;
    
    // Always return the layout structure, but only show content when ready
    return (
        <ToastProvider>
        <ConfirmProvider>
        <div className="min-h-screen bg-[#040404] text-white"
             style={{ fontFamily: "'Montserrat', sans-serif" }}>

            {/* ══ TOPBAR ══ */}
            <header className="sticky top-0 z-50 bg-[#040404]/95 backdrop-blur-xl">
                <div className="flex items-center justify-between px-8 lg:px-16 h-[60px]">
                    {/* Brand */}
                    <Link href="/admin" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-8 h-8 flex items-center justify-center border border-[#CEB175]/20 group-hover:border-[#CEB175]/50 transition-all duration-700">
                            <SunMedium className="w-4 h-4 text-[#CEB175]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-[16px] tracking-[0.15em] text-white leading-none">Mentari</span>
                            <span className="text-[7px] uppercase tracking-[0.5em] text-[#CEB175]/50 mt-1">Admin Suite</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10">
                        {NAV.map((item) => (
                            <Link key={item.label} href={item.href}
                                className={`relative text-[10px] uppercase tracking-[0.5em] transition-all duration-500 pb-0.5 group ${
                                    isActive(item) ? 'text-[#CEB175] font-medium' : 'text-white/20 hover:text-white/60'
                                }`}>
                                {item.label}
                                <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#CEB175] to-transparent transition-all duration-700 ${
                                    isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                                }`} />
                            </Link>
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <MinimalistTooltip text="Keluar dari Panel Admin">
                            <button onClick={signOut}
                                className="hidden md:flex items-center gap-1.5 text-[8px] uppercase tracking-[0.4em] text-white/20 hover:text-white/50 transition-colors duration-300">
                                <LogOut className="w-[11px] h-[11px]" />
                                Keluar
                            </button>
                        </MinimalistTooltip>
                        <button onClick={() => setMobile(true)} className="md:hidden text-white/30">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ══ CONTENT ══ */}
            <main className="px-5 sm:px-8 lg:px-16 py-8 sm:py-14 max-w-[1280px] mx-auto">
                {(!user && loading) ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-5 h-5 border-2 border-[#CEB175]/20 border-t-[#CEB175] rounded-full animate-spin" />
                    </div>
                ) : user ? (
                    children
                ) : null}
            </main>

            {/* ══ MOBILE OVERLAY ══ */}
            <AnimatePresence>
                {mobile && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#040404] flex flex-col">
                        <div className="h-px bg-[#CEB175]/40" />
                        <div className="flex items-center justify-between px-8 h-[60px] border-b border-white/[0.05]">
                            <div className="flex items-center gap-2.5">
                                <SunMedium className="w-[15px] h-[15px] text-[#CEB175]" />
                                <span className="font-serif text-[15px] tracking-[0.12em]">Mentari</span>
                            </div>
                            <button onClick={() => setMobile(false)} className="text-white/35">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col justify-center px-12 space-y-8">
                            {NAV.map((item, i) => (
                                <motion.div key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22,1,0.36,1] }}>
                                    <Link href={item.href} onClick={() => setMobile(false)}
                                        className={`block font-serif text-5xl font-light transition-colors ${
                                            isActive(item) ? 'text-[#CEB175] italic' : 'text-white/40 hover:text-white'
                                        }`}>
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <button onClick={signOut}
                            className="mb-14 mx-12 flex items-center gap-2 text-[8px] uppercase tracking-[0.5em] text-white/25 hover:text-red-400 transition-colors">
                            <LogOut className="w-3 h-3" />
                            Keluar dari Suite
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </ConfirmProvider>
        </ToastProvider>
    );
}
