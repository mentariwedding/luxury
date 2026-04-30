'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
    new:       { label: 'Baru', color: '#CEB175', bg: 'rgba(206,177,117,0.12)', icon: Clock },
    contacted: { label: 'Dihubungi', color: '#6BA3BE', bg: 'rgba(107,163,190,0.12)', icon: MessageSquare },
    booked:    { label: 'Booked', color: '#7CAE7A', bg: 'rgba(124,174,122,0.12)', icon: CheckCircle },
    declined:  { label: 'Ditolak', color: '#A3A3A3', bg: 'rgba(163,163,163,0.08)', icon: XCircle },
};

export default function InquiriesAdmin() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updating, setUpdating] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        const query = supabase
            .from('inquiry_submissions')
            .select('*')
            .order('created_at', { ascending: false });
        if (filter !== 'all') query.eq('status', filter);
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
        all: inquiries.length || 0,
        new: inquiries.filter(i => i.status === 'new').length,
        contacted: inquiries.filter(i => i.status === 'contacted').length,
        booked: inquiries.filter(i => i.status === 'booked').length,
    };

    const displayed = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

    const label = (key) => STATUS_CONFIG[key]?.label || key;
    const color = (key) => STATUS_CONFIG[key]?.color || '#A3A3A3';

    return (
        <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {/* Page Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CEB175', marginBottom: 8, fontWeight: 300 }}>
                        Admin · Phase 4
                    </p>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, color: '#FAFAFA', margin: 0 }}>
                        Inquiry Submissions
                    </h1>
                    <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8, fontWeight: 300 }}>
                        Semua permintaan yang masuk melalui Smart Inquiry Form.
                    </p>
                </div>
                <button onClick={fetch} className="flex items-center gap-2" style={{ color: '#CEB175', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { key: 'all', label: 'Total', count: counts.all, color: '#FAFAFA' },
                    { key: 'new', label: 'Baru', count: counts.new, color: '#CEB175' },
                    { key: 'contacted', label: 'Dihubungi', count: counts.contacted, color: '#6BA3BE' },
                    { key: 'booked', label: 'Booked', count: counts.booked, color: '#7CAE7A' },
                ].map(s => (
                    <button key={s.key} onClick={() => setFilter(s.key)}
                        style={{
                            background: filter === s.key ? 'rgba(206,177,117,0.07)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${filter === s.key ? 'rgba(206,177,117,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 12, padding: '16px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s',
                        }}>
                        <p style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: s.color, margin: 0, lineHeight: 1 }}>
                            {s.count}
                        </p>
                        <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#525252', margin: '6px 0 0', fontWeight: 300 }}>
                            {s.label}
                        </p>
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#525252', fontSize: 12 }}>Memuat...</div>
            ) : displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#525252' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', marginBottom: 8 }}>Belum ada inquiry masuk.</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Form inquiry tersedia di halaman utama</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px 120px 160px', gap: 16, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {['Pasangan', 'Tanggal', 'Estetika', 'Tamu', 'Status'].map(h => (
                            <p key={h} style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#525252', margin: 0, fontWeight: 300 }}>{h}</p>
                        ))}
                    </div>

                    {displayed.map((item) => (
                        <div key={item.id}
                            style={{
                                display: 'grid', gridTemplateColumns: '1fr 100px 140px 120px 160px', gap: 16,
                                padding: '16px', background: 'rgba(255,255,255,0.015)',
                                border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8,
                                transition: 'background 0.3s', alignItems: 'center',
                            }}
                        >
                            {/* Pasangan */}
                            <div>
                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#FAFAFA', margin: 0, fontWeight: 300 }}>
                                    {item.initials || '—'}
                                </p>
                                {item.message && (
                                    <p style={{ fontSize: 11, color: '#525252', margin: '4px 0 0', lineHeight: 1.4, fontWeight: 300 }}>
                                        {item.message.slice(0, 60)}{item.message.length > 60 ? '...' : ''}
                                    </p>
                                )}
                                <p style={{ fontSize: 9, color: '#333', margin: '6px 0 0', letterSpacing: '0.3em' }}>
                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>

                            {/* Tanggal nikah */}
                            <p style={{ fontSize: 12, color: '#A3A3A3', margin: 0, fontWeight: 300 }}>
                                {item.wedding_date ? new Date(item.wedding_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>

                            {/* Estetika */}
                            <p style={{ fontSize: 11, color: '#A3A3A3', margin: 0, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
                                {item.aesthetic || '—'}
                            </p>

                            {/* Tamu */}
                            <p style={{ fontSize: 11, color: '#A3A3A3', margin: 0, fontWeight: 300 }}>
                                {item.guest_range || '—'}
                            </p>

                            {/* Status + actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <select
                                    value={item.status || 'new'}
                                    onChange={e => updateStatus(item.id, e.target.value)}
                                    disabled={updating === item.id}
                                    style={{
                                        background: STATUS_CONFIG[item.status]?.bg || 'rgba(206,177,117,0.12)',
                                        border: `1px solid ${color(item.status)}33`,
                                        color: color(item.status),
                                        borderRadius: 20, padding: '4px 10px', fontSize: 9, letterSpacing: '0.3em',
                                        textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif",
                                        outline: 'none', appearance: 'none', fontWeight: 300,
                                    }}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                        <option key={k} value={k}>{v.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
