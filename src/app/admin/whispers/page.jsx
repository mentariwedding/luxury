'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, RefreshCw, GripVertical, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

export default function WhispersAdmin() {
    const [whispers, setWhispers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const toast = useToast();
    const confirm = useConfirm();

    const fetchAll = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('whispers')
            .select('*')
            .order('display_order', { ascending: true });
        setWhispers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleAdd = async () => {
        const { data, error } = await supabase
            .from('whispers')
            .insert([
                {
                    quote: 'A new whisper.',
                    accent_word: '',
                    display_order: whispers.length,
                    is_active: true,
                },
            ])
            .select();
        if (error) {
            toast('Gagal menambah: ' + error.message, 'error');
            return;
        }
        setWhispers((p) => [...p, data[0]]);
        toast('Whisper baru ditambahkan.', 'success');
    };

    const handleField = async (id, field, value) => {
        setSaving((p) => ({ ...p, [id]: true }));
        await supabase.from('whispers').update({ [field]: value }).eq('id', id);
        setWhispers((p) => p.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
        setSaving((p) => ({ ...p, [id]: false }));
    };

    const handleDelete = async (id) => {
        const ok = await confirm('Hapus Whisper', 'Whisper ini akan dihapus permanen. Lanjutkan?');
        if (!ok) return;
        await supabase.from('whispers').delete().eq('id', id);
        setWhispers((p) => p.filter((w) => w.id !== id));
        toast('Whisper dihapus.', 'success');
    };

    const moveItem = async (id, direction) => {
        const idx = whispers.findIndex((w) => w.id === id);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= whispers.length) return;
        const reordered = [...whispers];
        [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
        // Update display_order in DB for the swapped pair
        await Promise.all([
            supabase.from('whispers').update({ display_order: idx }).eq('id', reordered[idx].id),
            supabase.from('whispers').update({ display_order: newIdx }).eq('id', reordered[newIdx].id),
        ]);
        // Refresh from DB to ensure orders are correct
        fetchAll();
    };

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16"
            >
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Editor</p>
                <h1
                    className="font-serif font-light leading-[0.9] mb-8"
                    style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}
                >
                    Whispers
                </h1>
                <div className="flex items-center gap-6 mb-2">
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 italic font-serif">
                        Kalimat puitis yang muncul di section "A Whisper"
                    </p>
                </div>
            </motion.div>

            {/* Action bar */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
                    {loading ? '— memuat —' : `${whispers.length} Whisper${whispers.length !== 1 ? 's' : ''}`}
                </p>
                <MinimalistTooltip text="Tambah whisper baru">
                    <button
                        onClick={handleAdd}
                        className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-6 py-3 hover:bg-[#CEB175] hover:text-black transition-all duration-500"
                    >
                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah Whisper
                    </button>
                </MinimalistTooltip>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-white/[0.02]" />
                    ))}
                </div>
            ) : whispers.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/[0.05]">
                    <p className="font-serif italic text-2xl text-white/30 mb-4">Belum ada whisper.</p>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">
                        Klik "Tambah Whisper" untuk memulai
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {whispers.map((w, idx) => (
                            <motion.div
                                key={w.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="group border border-white/[0.05] hover:border-[#CEB175]/15 p-6 md:p-8 transition-colors duration-500 bg-white/[0.01]"
                            >
                                <div className="flex items-start gap-5">
                                    {/* Order indicator */}
                                    <div className="flex flex-col items-center gap-2 pt-2">
                                        <span className="font-serif italic text-2xl text-[#1a1a1a]">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => moveItem(w.id, 'up')}
                                                disabled={idx === 0}
                                                className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs px-1"
                                                aria-label="Pindah ke atas"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => moveItem(w.id, 'down')}
                                                disabled={idx === whispers.length - 1}
                                                className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs px-1"
                                                aria-label="Pindah ke bawah"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="flex-1 space-y-5">
                                        {/* Quote */}
                                        <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                            <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                Kalimat (Quote)
                                            </p>
                                            <textarea
                                                rows={2}
                                                defaultValue={w.quote || ''}
                                                onBlur={(e) => handleField(w.id, 'quote', e.target.value)}
                                                placeholder="Bisikkan kalimat puitis di sini..."
                                                className="w-full bg-transparent text-base md:text-lg text-white font-serif italic leading-relaxed resize-none focus:outline-none placeholder:text-white/10"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Accent word */}
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                    Accent Word (kata yang di-highlight)
                                                </p>
                                                <input
                                                    type="text"
                                                    defaultValue={w.accent_word || ''}
                                                    onBlur={(e) => handleField(w.id, 'accent_word', e.target.value)}
                                                    placeholder="cth: timelessness"
                                                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            {/* Active toggle */}
                                            <div className="flex items-end">
                                                <button
                                                    onClick={() => handleField(w.id, 'is_active', !w.is_active)}
                                                    className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] py-2 transition-colors ${
                                                        w.is_active ? 'text-[#CEB175]' : 'text-white/20'
                                                    }`}
                                                >
                                                    {w.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                    {w.is_active ? 'Tampil' : 'Disembunyikan'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right actions */}
                                    <div className="flex flex-col gap-3 items-end pt-2">
                                        {saving[w.id] && (
                                            <RefreshCw className="w-3 h-3 text-[#CEB175] animate-spin" />
                                        )}
                                        <MinimalistTooltip text="Hapus whisper">
                                            <button
                                                onClick={() => handleDelete(w.id)}
                                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all duration-300"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </MinimalistTooltip>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
