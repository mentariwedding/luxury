'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle, Clock, XCircle, MessageSquare, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
    new:       { label: 'Baru',       color: 'text-[#CEB175]',      dot: 'bg-[#CEB175]',       border: 'border-[#CEB175]/20',      bg: 'bg-[#CEB175]/5'      },
    contacted: { label: 'Dihubungi',  color: 'text-blue-400',       dot: 'bg-blue-400',        border: 'border-blue-400/20',       bg: 'bg-blue-400/5'       },
    booked:    { label: 'Booked',     color: 'text-emerald-400',    dot: 'bg-emerald-400',     border: 'border-emerald-400/20',    bg: 'bg-emerald-400/5'    },
    declined:  { label: 'Ditolak',    color: 'text-white/25',       dot: 'bg-white/20',        border: 'border-white/10',          bg: 'bg-white/[0.02]'     },
};

export default function InquiriesAdmin() {
    const [inquiries, setInquiries] = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [filter,    setFilter]    = useState('all');
    const [updating,  setUpdating]  = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('inquiry_submissions').select('*').order('created_at', { ascending: false });
        if (filter !== 'all') query = query.eq('status', filter);
        const { data } = await query;
        setInquiries(data || []);
        setLoading(false);
    }, [filter]);

    useEffect(() => { fetch(); }, [fetch]);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        await supabase.from('inquiry_submissions').update({ status }).eq('id', id);
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        setUpdating(null);
    };

    const openWA = (inquiry) => {
        const msg = encodeURIComponent(
            `Halo ${inquiry.initials} 🌸, kami dari Mentari Wedding ingin menindaklanjuti inquiry Anda untuk pernikahan tanggal ${inquiry.wedding_date || '—'}. Apakah kita bisa berkenalan lebih lanjut?`
        );
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    const counts = {
        all:       inquiries.length,
        new:       inquiries.filter(i => i.status === 'new').length,
        contacted: inquiries.filter(i => i.status === 'contacted').length,
        booked:    inquiries.filter(i => i.status === 'booked').length,
    };

    const displayed = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

    return (
        <div>
            {/* ── Page Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
            >
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Manajemen</p>
                <h1 className="font-serif font-light leading-[0.9] mb-8"
                    style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                    Inquiries
                </h1>
                <div className="flex items-center gap-6">
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
                    <button onClick={fetch}
                        className="text-white/15 hover:text-white/40 transition-colors duration-300">
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </motion.div>

            {/* ── Filter / Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04] mb-12">
                {[
                    { key: 'all',       label: 'Total',     count: counts.all,       gold: false },
                    { key: 'new',       label: 'Baru',      count: counts.new,       gold: true  },
                    { key: 'contacted', label: 'Dihubungi', count: counts.contacted, gold: false },
                    { key: 'booked',    label: 'Booked',    count: counts.booked,    gold: false },
                ].map(s => (
                    <button key={s.key} onClick={() => setFilter(s.key)}
                        className={`group p-5 bg-[#040404] text-left transition-all duration-300 ${
                            filter === s.key ? 'bg-[#CEB175]/5' : 'hover:bg-white/[0.02]'
                        }`}>
                        <p className={`font-serif font-light leading-none mb-2 ${
                            s.gold ? 'text-[#CEB175]' : 'text-white/70'
                        }`} style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
                            {loading ? <span className="inline-block w-10 h-7 bg-white/[0.04] animate-pulse" /> : s.count}
                        </p>
                        <p className={`text-[8px] uppercase tracking-[0.4em] ${
                            filter === s.key ? 'text-[#CEB175]/60' : 'text-white/20'
                        }`}>{s.label}</p>
                    </button>
                ))}
            </div>

            {/* ── Inquiry List ── */}
            {loading ? (
                <div className="space-y-px">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-white/[0.02] animate-pulse" />
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/[0.05]">
                    <p className="font-serif italic text-white/20 text-2xl mb-3">Belum ada inquiry masuk.</p>
                    <p className="text-[8px] uppercase tracking-[0.5em] text-white/10">Form tersedia di halaman utama</p>
                </div>
            ) : (
                <div className="space-y-px">
                    {/* Column headers — desktop only */}
                    <div className="hidden md:grid md:grid-cols-[1fr_120px_160px_140px_auto] gap-4 px-5 pb-3 border-b border-white/[0.04]">
                        {['Pasangan', 'Tgl Nikah', 'Estetika', 'Tamu', 'Status'].map(h => (
                            <p key={h} className="text-[7px] uppercase tracking-[0.5em] text-white/20">{h}</p>
                        ))}
                    </div>

                    {displayed.map((item, i) => {
                        const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                        return (
                            <motion.div key={item.id}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22,1,0.36,1] }}
                                className="group flex flex-col md:grid md:grid-cols-[1fr_120px_160px_140px_auto] gap-3 md:gap-4 p-5 border border-white/[0.04] hover:border-[#CEB175]/10 transition-colors duration-400"
                            >
                                {/* Pasangan */}
                                <div>
                                    <p className="font-serif italic text-white/80 text-base font-light">
                                        {item.initials || '—'}
                                    </p>
                                    {item.message && (
                                        <p className="text-[10px] text-white/30 mt-1 font-light leading-relaxed line-clamp-2">
                                            {item.message}
                                        </p>
                                    )}
                                    <p className="text-[7px] uppercase tracking-[0.3em] text-white/15 mt-1.5">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Tanggal nikah */}
                                <p className="text-[10px] text-white/40 font-light self-start md:self-center">
                                    {item.wedding_date
                                        ? new Date(item.wedding_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : '—'}
                                </p>

                                {/* Estetika */}
                                <p className="font-serif italic text-white/40 text-sm self-start md:self-center">
                                    {item.aesthetic || '—'}
                                </p>

                                {/* Tamu */}
                                <p className="text-[10px] text-white/30 font-light self-start md:self-center">
                                    {item.guest_range || '—'}
                                </p>

                                {/* Status + WA */}
                                <div className="flex items-center gap-3 self-start md:self-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                        <select
                                            value={item.status || 'new'}
                                            onChange={e => updateStatus(item.id, e.target.value)}
                                            disabled={updating === item.id}
                                            className={`bg-transparent border-b ${cfg.border} ${cfg.color} text-[8px] uppercase tracking-[0.3em] cursor-pointer outline-none font-light disabled:opacity-40 transition-all duration-300`}
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        >
                                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                                <option key={k} value={k} style={{ background: '#0a0a0a', color: '#FAFAFA' }}>
                                                    {v.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={() => openWA(item)}
                                        className="text-white/15 hover:text-[#CEB175] transition-colors duration-300"
                                        title="Kirim pesan WA">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
