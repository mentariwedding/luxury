'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    ArrowUpRight, ExternalLink, Clock,
    ImageIcon, FileText, MessageCircle, Quote,
    MapPin, BookOpen, Inbox, TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────── */
const timeAgo = (date) => {
    if (!date) return '—';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Baru saja';
    if (mins < 60) return `${mins}m lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}j lalu`;
    return `${Math.floor(hrs / 24)}h lalu`;
};

const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 17) return 'Selamat Siang';
    return 'Selamat Malam';
};

const dateLabel = () => new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const STATUS_COLOR = {
    new:       'bg-[#CEB175]',
    contacted: 'bg-blue-400',
    booked:    'bg-emerald-400',
    declined:  'bg-red-400/60',
};

/* ── sub-components ──────────────────────────────────── */
function StatCard({ label, value, desc, href, icon: Icon, loading, delay, gold }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link href={href}
                className={`group block p-5 border transition-all duration-500 ${
                    gold
                        ? 'border-[#CEB175]/20 bg-[#CEB175]/[0.03] hover:border-[#CEB175]/40 hover:bg-[#CEB175]/[0.06]'
                        : 'border-white/[0.05] hover:border-white/10'
                }`}
            >
                <div className="flex items-start justify-between mb-6">
                    <Icon className={`w-4 h-4 ${gold ? 'text-[#CEB175]' : 'text-white/20'}`} strokeWidth={1.5} />
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-[#CEB175] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-400" />
                </div>
                <p className={`font-serif font-light leading-none mb-2 ${gold ? 'text-[#CEB175]' : 'text-white/80'}`}
                   style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
                    {loading
                        ? <span className="inline-block w-16 h-8 bg-white/[0.04] animate-pulse align-bottom" />
                        : value}
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-1">{label}</p>
                <p className="text-[8px] text-white/20 font-light">{desc}</p>
            </Link>
        </motion.div>
    );
}

function ActivityRow({ left, right, sub, loading }) {
    if (loading) return <div className="h-11 bg-white/[0.02] animate-pulse mb-px" />;
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04] group">
            <div>
                <p className="text-[10px] text-white/60 font-light">{left}</p>
                {sub && <p className="text-[8px] uppercase tracking-wider text-white/20 mt-0.5">{sub}</p>}
            </div>
            <div className="flex items-center gap-1.5 text-white/20">
                <Clock className="w-2.5 h-2.5" />
                <span className="text-[8px]">{right}</span>
            </div>
        </div>
    );
}

/* ── main page ───────────────────────────────────────── */
export default function AdminDashboard() {
    const [stats,    setStats]    = useState({ photos: 0, sections: 0, testimonials: 0, venues: 0, inquiries: 0, journal: 0 });
    const [newInqs,  setNewInqs]  = useState([]);
    const [recent,   setRecent]   = useState([]);
    const [updated,  setUpdated]  = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        (async () => {
            const [p, s, t, v, iq, j, recentInqs, recentPhotos, recentSections] = await Promise.all([
                supabase.from('portfolio_gallery').select('*',        { count: 'exact', head: true }),
                supabase.from('section_content').select('*',          { count: 'exact', head: true }),
                supabase.from('testimonials').select('*',             { count: 'exact', head: true }),
                supabase.from('venues').select('*',                   { count: 'exact', head: true }),
                supabase.from('inquiry_submissions').select('*',      { count: 'exact', head: true }),
                supabase.from('journal_entries').select('*',          { count: 'exact', head: true }),
                supabase.from('inquiry_submissions')
                    .select('id, name, event_type, status, created_at')
                    .order('created_at', { ascending: false }).limit(5),
                supabase.from('portfolio_gallery')
                    .select('id, title, category, created_at')
                    .order('created_at', { ascending: false }).limit(4),
                supabase.from('section_content')
                    .select('section_name, updated_at')
                    .order('updated_at', { ascending: false }).limit(4),
            ]);

            setStats({
                photos:       p.count  || 0,
                sections:     s.count  || 0,
                testimonials: t.count  || 0,
                venues:       v.count  || 0,
                inquiries:    iq.count || 0,
                journal:      j.count  || 0,
            });
            setNewInqs(recentInqs.data  || []);
            setRecent(recentPhotos.data || []);
            setUpdated(recentSections.data || []);
            setLoading(false);
        })();
    }, []);

    const newCount = newInqs.filter(i => i.status === 'new').length;

    const SECTION_LABELS = {
        hero: 'Hero', signature: 'Signature', approach: 'Pendekatan',
        philosophy: 'Filosofi', atelier: 'Atelier', venues: 'Venues',
        manifesto: 'Manifesto', moodboard: 'Mood Board', testimonial: 'Testimonial',
        partners: 'Vendor & Mitra',
    };

    return (
        <div>
            {/* ── Greeting Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 pb-10 border-b border-white/[0.05]"
            >
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/50 mb-4">{dateLabel()}</p>
                <h1 className="font-serif font-light text-white leading-[1.1] mb-3"
                    style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                    {greeting()},<br />
                    <span className="italic text-[#CEB175]/80">Admin Suite.</span>
                </h1>
                <div className="flex items-center gap-3 mt-5">
                    {newCount > 0 && (
                        <Link href="/admin/inquiries"
                            className="flex items-center gap-2 px-4 py-2 bg-[#CEB175]/10 border border-[#CEB175]/30 text-[#CEB175] hover:bg-[#CEB175]/20 transition-all duration-300">
                            <Inbox className="w-3 h-3" />
                            <span className="text-[9px] uppercase tracking-[0.4em]">{newCount} inquiry baru</span>
                        </Link>
                    )}
                    <a href="/" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-white/20 hover:text-white/50 transition-colors duration-300">
                        <ExternalLink className="w-3 h-3" />
                        Lihat Website
                    </a>
                </div>
            </motion.div>

            {/* ── Stat Cards Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
                <StatCard label="Inquiries"      value={stats.inquiries}    desc="Form submissions masuk"    href="/admin/inquiries"   icon={Inbox}         loading={loading} delay={0.05} gold />
                <StatCard label="Foto Editorial" value={stats.photos}       desc="Arsip visual pernikahan"   href="/admin/gallery"     icon={ImageIcon}     loading={loading} delay={0.10} />
                <StatCard label="Kisah"          value={stats.journal}      desc="Editorial journals aktif"  href="/admin/journal"     icon={BookOpen}      loading={loading} delay={0.15} />
                <StatCard label="Testimonial"    value={stats.testimonials} desc="Kutipan pasangan pilihan"  href="/admin/testimonials"icon={Quote}         loading={loading} delay={0.20} />
                <StatCard label="Venues"         value={stats.venues}       desc="Curated locations"         href="/admin/venues"      icon={MapPin}        loading={loading} delay={0.25} />
                <StatCard label="Sections Aktif" value={stats.sections}     desc="Konten yang dikelola"      href="/admin/content"     icon={FileText}      loading={loading} delay={0.30} />
            </div>

            {/* ── Activity Grid ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
            >
                {/* Recent Inquiries */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-3 h-3 text-[#CEB175]/50" />
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">Inquiry Terbaru</p>
                        </div>
                        <Link href="/admin/inquiries"
                            className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors">
                            Semua →
                        </Link>
                    </div>
                    {loading
                        ? [...Array(4)].map((_, i) => <ActivityRow key={i} loading />)
                        : newInqs.length === 0
                            ? <p className="text-[9px] text-white/20 italic">Belum ada inquiry</p>
                            : newInqs.map(inq => (
                                <div key={inq.id} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[inq.status] || 'bg-white/20'}`} />
                                            <p className="text-[10px] text-white/60 font-light">{inq.name || '—'}</p>
                                        </div>
                                        <p className="text-[8px] uppercase tracking-wider text-white/20">{inq.event_type || '—'}</p>
                                    </div>
                                    <span className="text-[8px] text-white/20">{timeAgo(inq.created_at)}</span>
                                </div>
                            ))}
                </div>

                {/* Recent Photos */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-3 h-3 text-[#CEB175]/50" />
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">Upload Terbaru</p>
                        </div>
                        <Link href="/admin/gallery"
                            className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors">
                            Galeri →
                        </Link>
                    </div>
                    {loading
                        ? [...Array(4)].map((_, i) => <ActivityRow key={i} loading />)
                        : recent.length === 0
                            ? <p className="text-[9px] text-white/20 italic">Belum ada foto</p>
                            : recent.map(photo => (
                                <ActivityRow key={photo.id}
                                    left={photo.title} sub={photo.category}
                                    right={timeAgo(photo.created_at)} />
                            ))}
                </div>

                {/* Section Updates */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-[#CEB175]/50" />
                            <p className="text-[8px] uppercase tracking-[0.5em] text-white/30">Update Konten</p>
                        </div>
                        <Link href="/admin/content"
                            className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors">
                            Editor →
                        </Link>
                    </div>
                    {loading
                        ? [...Array(4)].map((_, i) => <ActivityRow key={i} loading />)
                        : updated.length === 0
                            ? <p className="text-[9px] text-white/20 italic">Belum ada update</p>
                            : updated.map(sec => (
                                <ActivityRow key={sec.section_name}
                                    left={SECTION_LABELS[sec.section_name] || sec.section_name}
                                    right={timeAgo(sec.updated_at)} />
                            ))}
                </div>
            </motion.div>

            {/* ── Quick Actions ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-white/[0.05] pt-10"
            >
                <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 mb-6">Akses Cepat</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                    {[
                        { num: '01', label: 'Tambah Foto',        href: '/admin/gallery',      icon: ImageIcon      },
                        { num: '02', label: 'Tulis Kisah Baru',   href: '/admin/journal',      icon: BookOpen       },
                        { num: '03', label: 'Lihat Inquiries',    href: '/admin/inquiries',    icon: Inbox          },
                        { num: '04', label: 'Edit Banner Hero',   href: '/admin/content',      icon: FileText       },
                        { num: '05', label: 'Kelola Testimonial', href: '/admin/testimonials', icon: Quote          },
                        { num: '06', label: 'Curate Venues',      href: '/admin/venues',       icon: MapPin         },
                    ].map(l => {
                        const Icon = l.icon;
                        return (
                            <Link key={l.num} href={l.href}
                                className="group flex items-center gap-4 px-5 py-4 bg-[#040404] hover:bg-[#CEB175]/[0.04] transition-all duration-400">
                                <Icon className="w-3.5 h-3.5 text-white/15 group-hover:text-[#CEB175]/60 transition-colors duration-400" strokeWidth={1.5} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[8px] font-serif italic text-white/15 block mb-0.5">{l.num}</span>
                                    <span className="text-[9px] uppercase tracking-[0.35em] text-white/30 group-hover:text-white/60 transition-colors duration-400">{l.label}</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-[#CEB175] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-400 flex-shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── System Status ── */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-white/[0.04]"
            >
                {[{ label: 'Database' }, { label: 'Storage' }, { label: 'Auth' }].map(sys => (
                    <div key={sys.label} className="flex items-center gap-2 text-[8px] tracking-wide text-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
                        {sys.label} — Aktif
                    </div>
                ))}
                <p className="ml-auto text-[7px] uppercase tracking-[0.5em] text-white/10 font-serif italic">
                    Planned to Perfection
                </p>
            </motion.div>
        </div>
    );
}
