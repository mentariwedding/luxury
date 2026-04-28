'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, RefreshCw, Phone, MapPin, Map, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

const InstagramIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const FIELDS = [
    {
        key: 'whatsapp_number',
        label: 'Nomor WhatsApp',
        desc: 'Nomor yang digunakan untuk tombol konsultasi di website.',
        icon: <Phone className="w-3.5 h-3.5" />,
        placeholder: '628123456789',
    },
    {
        key: 'instagram_url',
        label: 'URL Instagram',
        desc: 'Link profil Instagram Mentari Wedding.',
        icon: <InstagramIcon />,
        placeholder: 'https://instagram.com/mentariwedding',
    },
    {
        key: 'pinterest_url',
        label: 'URL Pinterest',
        desc: 'Link profil Pinterest untuk inspirasi visual.',
        icon: <Globe className="w-3.5 h-3.5" />,
        placeholder: 'https://pinterest.com/...',
    },
    {
        key: 'map_coordinates',
        label: 'Koordinat Maps',
        desc: 'Koordinat GPS untuk peta lokasi studio.',
        icon: <Map className="w-3.5 h-3.5" />,
        placeholder: '-6.887, 106.776',
    },
    {
        key: 'office_address',
        label: 'Alamat Studio',
        desc: 'Alamat lengkap yang ditampilkan di website.',
        icon: <MapPin className="w-3.5 h-3.5" />,
        placeholder: 'Jl. ... Sukabumi, Jawa Barat',
    },
];

export default function SettingsPage() {
    const [data,    setData]    = useState({});
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const toast   = useToast();
    const confirm = useConfirm();

    const load = async (quiet = false) => {
        if (!quiet) setLoading(true);
        const { data: rows, error } = await supabase.from('site_settings').select('*');
        if (error) {
            toast('Gagal mengambil data: ' + error.message, 'error');
        } else if (rows) {
            setData(Object.fromEntries(rows.map(r => [r.key, r.value])));
        }
        setLoading(false);
    };

    useEffect(() => { load(true); }, []);

    const handleCancel = async () => {
        const ok = await confirm(
            'Batalkan Perubahan',
            'Apakah Anda yakin ingin membatalkan semua perubahan yang belum disimpan?',
            { confirmText: 'Ya, Batalkan', type: 'info' }
        );
        if (ok) {
            await load();
            toast('Perubahan telah dibatalkan.', 'info');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await Promise.all(
                Object.entries(data).map(([key, value]) =>
                    supabase.from('site_settings').update({ value }).eq('key', key)
                )
            );
            toast('Semua pengaturan berhasil diperbarui.', 'success');
        } catch {
            toast('Gagal menyimpan perubahan.', 'error');
        }
        setSaving(false);
    };

    return (
        <div className="luxury-section">
            {/* ── Page Header ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16">
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/70 mb-5">Konfigurasi</p>
                <h1 className="font-serif font-light leading-[0.9]"
                    style={{ fontSize: 'clamp(34px, 6vw, 80px)' }}>
                    Pengaturan
                </h1>
                <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-16 mt-8" />
            </motion.div>


            {/* ── Fields ── */}
            {loading ? (
                <div className="space-y-0 border-t border-white/[0.06] luxury-section">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-[1fr_2fr] gap-12 py-9 border-b border-white/[0.05]">
                            <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
                            <div className="h-5 w-full bg-white/[0.05] rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <form id="settings-form" onSubmit={handleSave}
                    className="border-t border-white/[0.06]">
                    {FIELDS.map((field, i) => (
                        <motion.div key={field.key}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-16 py-9 border-b border-white/[0.05] hover:border-white/[0.1] transition-colors duration-400">

                            {/* Left — label */}
                            <div className="flex items-start gap-3 pt-0.5">
                                <span className="text-[#CEB175]/40 group-focus-within:text-[#CEB175]/70 transition-colors duration-300 mt-0.5 shrink-0">
                                    {field.icon}
                                </span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 mb-1.5">
                                        {field.label}
                                    </p>
                                    <p className="text-[10px] text-white/25 leading-relaxed">
                                        {field.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Right — input */}
                            <div className="border-b border-white/[0.08] focus-within:border-[#CEB175]/40 transition-colors duration-400 pb-2">
                                <input
                                    type="text"
                                    value={data[field.key] || ''}
                                    onChange={e => setData(d => ({ ...d, [field.key]: e.target.value }))}
                                    placeholder={field.placeholder}
                                    className="w-full bg-transparent text-white/80 text-sm focus:outline-none placeholder:text-white/15 tracking-wide"
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-10">
                        <MinimalistTooltip text="Batalkan semua perubahan">
                            <button type="button" onClick={handleCancel}
                                className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.45em] text-white/20 hover:text-white/50 transition-colors duration-300">
                                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                Batalkan Perubahan
                            </button>
                        </MinimalistTooltip>
                        <MinimalistTooltip text="Simpan Pengaturan">
                            <button type="submit" disabled={saving}
                                className="group flex items-center gap-3 disabled:opacity-40">
                                {saving
                                    ? <RefreshCw className="w-3.5 h-3.5 text-[#CEB175] animate-spin" />
                                    : <Save className="w-3.5 h-3.5 text-[#CEB175]" />
                                }
                                <span className="text-[9px] uppercase tracking-[0.45em] text-white/70 group-hover:text-[#CEB175] transition-colors duration-300">
                                    {saving ? 'Menyimpan...' : 'Perbarui Portal'}
                                </span>
                            </button>
                        </MinimalistTooltip>
                    </div>
                </form>
            )}
        </div>
    );
}
