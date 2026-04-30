'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, RefreshCw, Eye, EyeOff, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

/**
 * Helper: array → comma string untuk display di input
 */
const arrToStr = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') {
        try { return JSON.parse(val).join(', '); } catch { return val; }
    }
    return '';
};

/**
 * Helper: comma string → JSON array untuk simpan ke Supabase JSONB
 */
const strToArr = (str) =>
    str.split(',').map(s => s.trim()).filter(Boolean);

export default function MoodBoardAdmin() {
    const [palettes, setPalettes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const toast = useToast();
    const confirm = useConfirm();

    const fetchAll = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('mood_palettes')
            .select('*')
            .order('display_order', { ascending: true });
        setPalettes(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleAdd = async () => {
        const { data, error } = await supabase
            .from('mood_palettes')
            .insert([{
                name: 'Palette Baru',
                keywords: ['Elegant', 'Timeless'],
                colors: ['#CEB175', '#E8D399', '#A3A3A3', '#050505'],
                mood: 'Untuk cerita yang belum terceritakan.',
                image_url: '/images/hero.JPG',
                is_active: true,
                display_order: palettes.length,
            }])
            .select();
        if (error) { toast('Gagal menambah: ' + error.message, 'error'); return; }
        setPalettes(p => [...p, data[0]]);
        toast('Palette baru ditambahkan.', 'success');
    };

    const handleField = async (id, field, value) => {
        setSaving(p => ({ ...p, [id]: true }));
        await supabase.from('mood_palettes').update({ [field]: value }).eq('id', id);
        setPalettes(p => p.map(v => v.id === id ? { ...v, [field]: value } : v));
        setSaving(p => ({ ...p, [id]: false }));
    };

    // Simpan keywords sebagai JSONB array
    const handleKeywords = async (id, str) => {
        const arr = strToArr(str);
        handleField(id, 'keywords', arr);
    };

    // Simpan colors sebagai JSONB array
    const handleColors = async (id, str) => {
        const arr = strToArr(str);
        handleField(id, 'colors', arr);
    };

    const handleDelete = async (id) => {
        const ok = await confirm('Hapus Palette', 'Palette ini akan dihapus permanen. Lanjutkan?');
        if (!ok) return;
        await supabase.from('mood_palettes').delete().eq('id', id);
        setPalettes(p => p.filter(v => v.id !== id));
        toast('Palette dihapus.', 'success');
    };

    const moveItem = async (id, direction) => {
        const idx = palettes.findIndex(v => v.id === id);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= palettes.length) return;
        const reordered = [...palettes];
        [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
        await Promise.all([
            supabase.from('mood_palettes').update({ display_order: idx }).eq('id', reordered[idx].id),
            supabase.from('mood_palettes').update({ display_order: newIdx }).eq('id', reordered[newIdx].id),
        ]);
        fetchAll();
    };

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16"
            >
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Editor</p>
                <h1 className="font-serif font-light leading-[0.9] mb-8" style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                    Mood Board
                </h1>
                <div className="flex items-center gap-6 mb-2">
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 italic font-serif">
                        Inspirasi estetika — 3 gaya pilihan untuk calon klien
                    </p>
                </div>
            </motion.div>

            {/* Panduan singkat */}
            <div className="mb-10 p-5 border border-[#CEB175]/10 bg-[#CEB175]/[0.02]">
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/60 mb-2">Panduan Pengisian</p>
                <ul className="space-y-1">
                    {[
                        'Keywords: pisahkan dengan koma — contoh: Romantic, Soft, Garden',
                        'Colors: kode hex dipisah koma — contoh: #E8D0C0, #F5EDE6, #C9A9A6, #8B6B5D',
                        'Gunakan tepat 4 warna agar tampil sempurna di website',
                    ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-[9px] text-white/30">
                            <span className="text-[#CEB175]/40 shrink-0 mt-0.5">·</span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
                    {loading ? '— memuat —' : `${palettes.length} Palette`}
                </p>
                <MinimalistTooltip text="Tambah palette baru">
                    <button
                        onClick={handleAdd}
                        className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-6 py-3 hover:bg-[#CEB175] hover:text-black transition-all duration-500"
                    >
                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah
                    </button>
                </MinimalistTooltip>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-56 bg-white/[0.02]" />)}
                </div>
            ) : palettes.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/[0.05]">
                    <Palette className="w-8 h-8 text-white/10 mx-auto mb-4" />
                    <p className="font-serif italic text-2xl text-white/30 mb-4">Belum ada palette.</p>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">Klik &quot;Tambah&quot; untuk mulai</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {palettes.map((pal, idx) => {
                            const colors = Array.isArray(pal.colors) ? pal.colors : [];
                            const keywords = Array.isArray(pal.keywords) ? pal.keywords : [];
                            return (
                                <motion.div
                                    key={pal.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="group border border-white/[0.05] hover:border-[#CEB175]/15 p-6 md:p-8 transition-colors duration-500 bg-white/[0.01]"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_auto] gap-6 items-start">

                                        {/* Thumbnail + color preview */}
                                        <div className="flex flex-col gap-2">
                                            <div className="relative w-20 h-28 overflow-hidden border border-white/[0.06] bg-[#0A0A0A]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={pal.image_url}
                                                    alt={pal.name}
                                                    className="w-full h-full object-cover opacity-70"
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                />
                                                <div className="absolute top-1 left-1 text-[8px] text-[#CEB175]/80 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                            </div>
                                            {/* Color swatches preview */}
                                            <div className="flex gap-1">
                                                {colors.slice(0, 4).map((c, ci) => (
                                                    <div
                                                        key={ci}
                                                        className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
                                                        style={{ background: c }}
                                                        title={c}
                                                    />
                                                ))}
                                            </div>
                                            {saving[pal.id] && <RefreshCw className="w-3 h-3 text-[#CEB175] animate-spin" />}
                                        </div>

                                        {/* Fields */}
                                        <div className="space-y-4">
                                            {/* Nama palette */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Nama Palette</p>
                                                <input
                                                    type="text"
                                                    defaultValue={pal.name || ''}
                                                    onBlur={e => handleField(pal.id, 'name', e.target.value)}
                                                    placeholder="Dusty Rose & Ivory"
                                                    className="w-full bg-transparent text-base md:text-lg text-white font-serif italic focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            {/* Keywords */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                    Keywords <span className="text-white/15 normal-case tracking-normal">(pisah koma)</span>
                                                </p>
                                                <input
                                                    type="text"
                                                    defaultValue={arrToStr(pal.keywords)}
                                                    onBlur={e => handleKeywords(pal.id, e.target.value)}
                                                    placeholder="Romantic, Soft, Garden"
                                                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                                                />
                                                {/* Tags preview */}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {keywords.map((kw, ki) => (
                                                        <span key={ki} className="text-[7px] uppercase tracking-wider border border-[#CEB175]/20 px-2 py-0.5 text-[#CEB175]/50">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Colors */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                    Colors HEX <span className="text-white/15 normal-case tracking-normal">(pisah koma, maks 4)</span>
                                                </p>
                                                <input
                                                    type="text"
                                                    defaultValue={arrToStr(pal.colors)}
                                                    onBlur={e => handleColors(pal.id, e.target.value)}
                                                    placeholder="#E8D0C0, #F5EDE6, #C9A9A6, #8B6B5D"
                                                    className="w-full bg-transparent text-sm text-white font-mono focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            {/* Mood */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Kalimat Suasana (Mood)</p>
                                                <textarea
                                                    rows={2}
                                                    defaultValue={pal.mood || ''}
                                                    onBlur={e => handleField(pal.id, 'mood', e.target.value)}
                                                    placeholder="Untuk cerita yang berbisik lembut..."
                                                    className="w-full bg-transparent text-sm text-white font-serif italic leading-relaxed resize-none focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            {/* Image URL */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">URL Gambar</p>
                                                <input
                                                    type="text"
                                                    defaultValue={pal.image_url || ''}
                                                    onBlur={e => handleField(pal.id, 'image_url', e.target.value)}
                                                    placeholder="/images/..."
                                                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-6 pt-1">
                                                <button
                                                    onClick={() => handleField(pal.id, 'is_active', !pal.is_active)}
                                                    className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] transition-colors ${pal.is_active ? 'text-[#CEB175]' : 'text-white/20'}`}
                                                >
                                                    {pal.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                    {pal.is_active ? 'Tampil' : 'Disembunyikan'}
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => moveItem(pal.id, 'up')} disabled={idx === 0}
                                                        className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1">
                                                        ▲ Up
                                                    </button>
                                                    <button onClick={() => moveItem(pal.id, 'down')} disabled={idx === palettes.length - 1}
                                                        className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1">
                                                        Down ▼
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete */}
                                        <div className="flex flex-col gap-3 items-end pt-2">
                                            <MinimalistTooltip text="Hapus palette">
                                                <button
                                                    onClick={() => handleDelete(pal.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all duration-300"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </MinimalistTooltip>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
