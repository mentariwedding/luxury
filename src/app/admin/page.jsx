'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Clock, ImageIcon, FileText, Activity, MessageCircle, Quote, MapPin, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats,    setStats]    = useState({ photos: 0, sections: 0, testimonials: 0, venues: 0, clicksToday: 0, clicksWeek: 0, clicksTotal: 0 });
    const [recent,   setRecent]   = useState([]);
    const [updated,  setUpdated]  = useState([]);
    const [recentClicks, setRecentClicks] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        (async () => {
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

            const [p, s, t, v, ct, cw, cTotal, recentPhotos, recentSections, recentClicksData] = await Promise.all([
                supabase.from('portfolio_gallery').select('*', { count: 'exact', head: true }),
                supabase.from('section_content').select('*',  { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }),
                supabase.from('venues').select('*', { count: 'exact', head: true }),
                supabase.from('inquiry_clicks').select('*', { count: 'exact', head: true }).gte('created_at', dayAgo),
                supabase.from('inquiry_clicks').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
                supabase.from('inquiry_clicks').select('*', { count: 'exact', head: true }),
                supabase.from('portfolio_gallery').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(4),
                supabase.from('section_content').select('section_name, updated_at').order('updated_at', { ascending: false }).limit(4),
                supabase.from('inquiry_clicks').select('id, source, created_at').order('created_at', { ascending: false }).limit(5),
            ]);

            setStats({
                photos: p.count || 0,
                sections: s.count || 0,
                testimonials: t.count || 0,
                venues: v.count || 0,
                clicksToday: ct.count || 0,
                clicksWeek: cw.count || 0,
                clicksTotal: cTotal.count || 0,
            });
            setRecent(recentPhotos.data || []);
            setUpdated(recentSections.data || []);
            setRecentClicks(recentClicksData.data || []);
            setLoading(false);
        })();
    }, []);

    const timeAgo = (date) => {
        if (!date) return '—';
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Baru saja';
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}j`;
        const days = Math.floor(hrs / 24);
        return `${days}h`;
    };

    const SECTION_LABELS = {
        hero: 'Hero',
        signature: 'Signature',
        approach: 'Pendekatan',
        philosophy: 'Filosofi',
        atelier: 'Atelier',
        venues: 'Venues',
        manifesto: 'Manifesto',
        moodboard: 'Mood Board',
        testimonial: 'Testimonial',
    };

    const SOURCE_LABELS = {
        manifesto: 'Manifesto Section',
        floating: 'Floating Whisper',
        navbar: 'Navbar',
        footer: 'Footer',
    };

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
                    <p className="text-[8px] uppercase tracking-[0.5em] text-white/20">Mystique Mode</p>
                </div>
            </motion.div>

            {/* ── Inquiry Pulse — featured stat ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16 border border-[#CEB175]/15 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-[#CEB175]/[0.04] to-transparent">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className="w-3.5 h-3.5 text-[#CEB175]" />
                            <p className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/80">Inquiry Pulse</p>
                        </div>
                        <p className="font-serif italic text-white/60 text-base md:text-lg leading-relaxed max-w-md">
                            Berapa kali bisikan dibuka — sebuah indikator rasa penasaran.
                        </p>
                    </div>
                    <div className="flex items-end gap-10 md:gap-16">
                        <div>
                            <p className="font-serif font-light text-white/90 leading-none mb-2"
                               style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                                <Num v={stats.clicksToday} />
                            </p>
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">Hari ini</p>
                        </div>
                        <div>
                            <p className="font-serif font-light text-[#CEB175] leading-none mb-2"
                               style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                                <Num v={stats.clicksWeek} />
                            </p>
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">7 Hari</p>
                        </div>
                        <div>
                            <p className="font-serif font-light text-white/40 leading-none mb-2"
                               style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                                <Num v={stats.clicksTotal} />
                            </p>
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">Total</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <div className="border-t border-white/[0.06]">
                {[
                    { label: 'Foto Editorial',    value: stats.photos,       href: '/admin/gallery',       desc: 'Arsip visual pernikahan',    icon: ImageIcon },
                    { label: 'Section Aktif',      value: stats.sections,     href: '/admin/content',       desc: 'Konten yang dikelola',       icon: FileText },
                    { label: 'Testimonial',        value: stats.testimonials, href: '/admin/testimonials',  desc: 'Kutipan pasangan eksklusif', icon: Quote },
                    { label: 'Venues',             value: stats.venues,       href: '/admin/venues',        desc: 'Curated locations',          icon: MapPin },
                ].map((stat, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                        <Link href={stat.href}
                            className="group flex items-center justify-between py-7 border-b border-white/[0.06] hover:border-[#CEB175]/20 transition-colors duration-500">
                            <div className="flex items-baseline gap-4 sm:gap-8 md:gap-16">
                                <span className="font-serif font-light text-white/80 group-hover:text-[#CEB175] transition-colors duration-500"
                                      style={{ fontSize: 'clamp(28px, 4.5vw, 60px)', lineHeight: 1 }}>
                                    <Num v={stat.value} />
                                </span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <stat.icon className="w-3 h-3 text-[#CEB175]/40" />
                                        <p className="text-[9px] uppercase tracking-[0.45em] text-white/70">{stat.label}</p>
                                    </div>
                                    <p className="text-[8px] tracking-wide text-white/30 hidden sm:block">{stat.desc}</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-white/25 group-hover:text-[#CEB175] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-400" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* ── Activity Section ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                {/* Recent Inquiry Clicks */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <MessageCircle className="w-3 h-3 text-[#CEB175]/50" />
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/35">Bisikan Terbaru</p>
                    </div>
                    <div className="space-y-0">
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white/[0.02] rounded-lg mb-1 animate-pulse" />)
                        ) : recentClicks.length === 0 ? (
                            <p className="text-[9px] text-white/20 italic">Belum ada bisikan</p>
                        ) : (
                            recentClicks.map((c) => (
                                <div key={c.id} className="flex items-center justify-between py-3 border-b border-white/[0.03]">
                                    <div>
                                        <p className="text-[10px] text-white/60 font-medium">{SOURCE_LABELS[c.source] || c.source || 'Unknown'}</p>
                                        <p className="text-[8px] text-white/20 uppercase tracking-wider">via WhatsApp</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/15">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="text-[8px] tracking-wide">{timeAgo(c.created_at)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

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
                            { num: '01', label: 'Edit Banner Hero',       href: '/admin/content'       },
                            { num: '02', label: 'Tambah Foto Editorial',  href: '/admin/gallery'       },
                            { num: '03', label: 'Curate Venues',          href: '/admin/venues'        },
                            { num: '04', label: 'Kelola Testimonial',     href: '/admin/testimonials'  },
                            { num: '05', label: 'Kelola Mood Board',      href: '/admin/moodboard'     },
                            { num: '06', label: 'Kelola Feed Instagram',  href: '/admin/instagram'     },
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
                            "By Inquiry<br/>
                            <span className="italic text-[#CEB175]/70">Only."</span>
                        </p>
                        <div className="space-y-2 mt-6">
                            {[
                                { label: 'Database', ok: true },
                                { label: 'Storage', ok: true },
                                { label: 'Auth', ok: true },
                            ].map((sys) => (
                                <div key={sys.label} className="flex items-center gap-3 text-[9px] tracking-wide text-white/30">
                                    <span className={`w-1.5 h-1.5 rounded-full ${sys.ok ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                                    {sys.label} — Aktif
                                </div>
                            ))}
                        </div>
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
