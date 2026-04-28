'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Clock, ImageIcon, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats,    setStats]    = useState({ photos: 0, sections: 0, services: 0 });
    const [recent,   setRecent]   = useState([]);
    const [updated,  setUpdated]  = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        (async () => {
            const [p, s, sv, recentPhotos, recentSections] = await Promise.all([
                supabase.from('portfolio_gallery').select('*', { count: 'exact', head: true }),
                supabase.from('section_content').select('*',  { count: 'exact', head: true }),
                supabase.from('section_items').select('*',    { count: 'exact', head: true })
                    .eq('section_name', 'philosophy'),
                supabase.from('portfolio_gallery').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('section_content').select('section_name, updated_at').order('updated_at', { ascending: false }).limit(5),
            ]);
            setStats({ photos: p.count || 0, sections: s.count || 0, services: sv.count || 0 });
            setRecent(recentPhotos.data || []);
            setUpdated(recentSections.data || []);
            setLoading(false);
        })();
    }, []);

    const timeAgo = (date) => {
        if (!date) return '—';
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Baru saja';
        if (mins < 60) return `${mins} menit lalu`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} jam lalu`;
        const days = Math.floor(hrs / 24);
        return `${days} hari lalu`;
    };

    const SECTION_LABELS = { hero: 'Hero', signature: 'Signature', approach: 'Pendekatan', philosophy: 'Filosofi', atelier: 'Atelier', partners: 'Partners' };

    const Num = ({ v }) => loading
        ? <span className="inline-block w-20 h-16 bg-white/[0.04] rounded-lg animate-pulse align-bottom" />
        : <>{v}</>;

    return (
        <div>
            {/* ── Hero Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-20">
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/70 mb-5">
                    Mentari Wedding — Administrative Suite
                </p>
                <h1 className="font-serif font-light leading-[0.9] tracking-tight mb-6 sm:mb-8"
                    style={{ fontSize: 'clamp(40px, 8vw, 110px)' }}>
                    Ringkasan
                </h1>
                <div className="flex items-center gap-4">
                    <div className="h-px bg-[#CEB175]/40 w-16" />
                    <p className="text-[8px] uppercase tracking-[0.5em] text-white/20">2026</p>
                </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <div className="border-t border-white/[0.06]">
                {[
                    { label: 'Foto Portfolio', value: stats.photos,   href: '/admin/gallery',  desc: 'Arsip visual pernikahan' },
                    { label: 'Section Aktif',  value: stats.sections, href: '/admin/content',  desc: 'Konten yang dikelola'    },
                    { label: 'Layanan',        value: stats.services, href: '/admin/content',  desc: 'Layanan yang ditawarkan' },
                ].map((stat, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                        <Link href={stat.href}
                            className="group flex items-center justify-between py-8 border-b border-white/[0.06] hover:border-[#CEB175]/20 transition-colors duration-500">
                            <div className="flex items-baseline gap-4 sm:gap-8 md:gap-16">
                                <span className="font-serif font-light text-white/80 group-hover:text-[#CEB175] transition-colors duration-500"
                                      style={{ fontSize: 'clamp(32px, 5vw, 72px)', lineHeight: 1 }}>
                                    <Num v={stat.value} />
                                </span>
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.45em] text-white/70 mb-1">{stat.label}</p>
                                    <p className="text-[8px] tracking-wide text-white/30 hidden sm:block">{stat.desc}</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-white/25 group-hover:text-[#CEB175] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-400" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* ── Analytics Section ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                {/* Recent Uploads */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <ImageIcon className="w-3 h-3 text-[#CEB175]/50" />
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/35">Upload Terbaru</p>
                    </div>
                    <div className="space-y-0">
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white/[0.02] rounded-lg mb-1 animate-pulse" />)
                        ) : recent.length === 0 ? (
                            <p className="text-[9px] text-white/20 italic">Belum ada foto</p>
                        ) : (
                            recent.map((photo) => (
                                <div key={photo.id} className="flex items-center justify-between py-3 border-b border-white/[0.03]">
                                    <div>
                                        <p className="text-[10px] text-white/60 font-medium">{photo.title}</p>
                                        <p className="text-[8px] text-white/20 uppercase tracking-wider">{photo.category}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/15">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="text-[8px] tracking-wide">{timeAgo(photo.created_at)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Section Updates */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <FileText className="w-3 h-3 text-[#CEB175]/50" />
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/35">Update Konten</p>
                    </div>
                    <div className="space-y-0">
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white/[0.02] rounded-lg mb-1 animate-pulse" />)
                        ) : (
                            updated.map((sec) => (
                                <div key={sec.section_name} className="flex items-center justify-between py-3 border-b border-white/[0.03]">
                                    <p className="text-[10px] text-white/60 font-medium">{SECTION_LABELS[sec.section_name] || sec.section_name}</p>
                                    <div className="flex items-center gap-1.5 text-white/15">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="text-[8px] tracking-wide">{timeAgo(sec.updated_at)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Health */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-3 h-3 text-[#CEB175]/50" />
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/35">Sistem</p>
                    </div>
                    <div className="space-y-0">
                        {[
                            { label: 'Database', status: 'Online', ok: true },
                            { label: 'Storage', status: 'Online', ok: true },
                            { label: 'Auth', status: 'Active', ok: true },
                        ].map((sys) => (
                            <div key={sys.label} className="flex items-center justify-between py-3 border-b border-white/[0.03]">
                                <p className="text-[10px] text-white/60 font-medium">{sys.label}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${sys.ok ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                                    <span className="text-[8px] text-white/30 tracking-wide">{sys.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Quick Actions + Brand ── */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                    <p className="text-[8px] uppercase tracking-[0.5em] text-white/35 mb-8">Akses Cepat</p>
                    <div className="space-y-0">
                        {[
                            { num: '01', label: 'Edit Banner Hero',    href: '/admin/content'  },
                            { num: '02', label: 'Upload Foto Baru',    href: '/admin/gallery'  },
                            { num: '03', label: 'Perbarui Filosofi',   href: '/admin/content'  },
                            { num: '04', label: 'Atur Info Kontak',    href: '/admin/settings' },
                        ].map((l) => (
                            <Link key={l.num} href={l.href}
                                className="group flex items-center justify-between py-4 border-b border-white/[0.04] hover:border-[#CEB175]/15 transition-colors duration-400">
                                <div className="flex items-center gap-6">
                                    <span className="font-serif text-[11px] text-white/20 italic">{l.num}</span>
                                    <span className="text-[9px] uppercase tracking-[0.35em] text-white/40 group-hover:text-white transition-colors duration-400">{l.label}</span>
                                </div>
                                <span className="text-white/20 group-hover:text-[#CEB175] transition-colors duration-400 text-xs">→</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Brand Status */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between pt-2">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/40 mb-6">Status Portal</p>
                        <p className="font-serif font-light text-white/80 leading-snug mb-2"
                           style={{ fontSize: 'clamp(22px, 3vw, 34px)' }}>
                            "Planned to<br/>
                            <span className="italic text-[#CEB175]/70">Perfection."</span>
                        </p>
                        <p className="text-[9px] text-white/30 tracking-wider mt-4">Semua sistem berjalan optimal.</p>
                    </div>
                    <a href="/" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[8px] uppercase tracking-[0.45em] text-white/25 hover:text-[#CEB175] transition-colors duration-400 mt-10 group w-fit">
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        Lihat Website Live
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
