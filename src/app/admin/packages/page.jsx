'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, RefreshCw, Eye, EyeOff, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

export default function PackagesAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const toast = useToast();
    const confirm = useConfirm();

    const fetchAll = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('section_items')
            .select('*')
            .eq('section_name', 'packages')
            .order('display_order', { ascending: true });
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleAdd = async () => {
        const { data, error } = await supabase
            .from('section_items')
            .insert([{
                section_name: 'packages',
                title: 'Tier Baru',
                subtitle: 'Subtitle tier',
                tag: 'Deskripsi tamu',
                description: 'Deskripsi tier ini.\n\nFitur-fitur:\n- Fitur pertama\n- Fitur kedua',
                cta_text: 'Style · Atmosphere · Mood',
                icon_name: '◇',
                display_order: items.length,
                is_active: true,
            }])
            .select();
        if (error) { toast('Gagal menambah: ' + error.message, 'error'); return; }
        setItems(p => [...p, data[0]]);
        toast('Tier baru ditambahkan.', 'success');
    };

    const handleField = async (id, field, value) => {
        setSaving(p => ({ ...p, [id]: true }));
        await supabase.from('section_items').update({ [field]: value }).eq('id', id);
        setItems(p => p.map(v => v.id === id ? { ...v, [field]: value } : v));
        setSaving(p => ({ ...p, [id]: false }));
    };

    const handleDelete = async (id) => {
        const ok = await confirm('Hapus Tier', 'Tier ini akan dihapus permanen. Lanjutkan?');
        if (!ok) return;
        await supabase.from('section_items').delete().eq('id', id);
        setItems(p => p.filter(v => v.id !== id));
        toast('Tier dihapus.', 'success');
    };

    const moveItem = async (id, direction) => {
        const idx = items.findIndex(v => v.id === id);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= items.length) return;
        const reordered = [...items];
        [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
        await Promise.all([
            supabase.from('section_items').update({ display_order: idx }).eq('id', reordered[idx].id),
            supabase.from('section_items').update({ display_order: newIdx }).eq('id', reordered[newIdx].id),
        ]);
        fetchAll();
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-16">
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Editor</p>
                <h1 className="font-serif font-light leading-[0.9] mb-8" style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                    Packages
                </h1>
                <div className="flex items-center gap-6 mb-2">
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 italic font-serif">
                        Dua tier perayaan — tanpa harga, hanya estetika
                    </p>
                </div>
            </motion.div>

            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
                    {loading ? '— memuat —' : `${items.length} Tier`}
                </p>
                <MinimalistTooltip text="Tambah tier baru">
                    <button onClick={handleAdd}
                        className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-6 py-3 hover:bg-[#CEB175] hover:text-black transition-all duration-500">
                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah Tier
                    </button>
                </MinimalistTooltip>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-48 bg-white/[0.02]" />)}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/[0.05]">
                    <Layers className="w-8 h-8 text-white/10 mx-auto mb-4" />
                    <p className="font-serif italic text-2xl text-white/30 mb-4">Belum ada tier.</p>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">Klik &quot;Tambah Tier&quot; untuk mulai</p>
                </div>
            ) : (
                <div className="space-y-5">
                    <AnimatePresence>
                        {items.map((item, idx) => (
                            <motion.div key={item.id} layout
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="group border border-white/[0.05] hover:border-[#CEB175]/15 p-6 md:p-8 transition-colors duration-500 bg-white/[0.01]"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_auto] gap-6 items-start">
                                    <div className="flex flex-col items-center gap-2 pt-1">
                                        <span className="font-serif text-2xl italic text-[#CEB175]/30">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        {saving[item.id] && <RefreshCw className="w-3 h-3 text-[#CEB175] animate-spin" />}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Nama Tier</p>
                                                <input type="text" defaultValue={item.title || ''}
                                                    onBlur={e => handleField(item.id, 'title', e.target.value)}
                                                    className="w-full bg-transparent text-base text-white font-serif italic focus:outline-none placeholder:text-white/10"
                                                    placeholder="Intimate" />
                                            </div>
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Label Tamu</p>
                                                <input type="text" defaultValue={item.tag || ''}
                                                    onBlur={e => handleField(item.id, 'tag', e.target.value)}
                                                    className="w-full bg-transparent text-sm text-[#CEB175] focus:outline-none placeholder:text-white/10"
                                                    placeholder="Di bawah 150 tamu" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Subtitle</p>
                                                <input type="text" defaultValue={item.subtitle || ''}
                                                    onBlur={e => handleField(item.id, 'subtitle', e.target.value)}
                                                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                                                    placeholder="Perayaan yang Berbisik" />
                                            </div>
                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Simbol</p>
                                                <input type="text" defaultValue={item.icon_name || ''}
                                                    onBlur={e => handleField(item.id, 'icon_name', e.target.value)}
                                                    className="w-full bg-transparent text-sm text-[#CEB175] focus:outline-none font-mono"
                                                    placeholder="◇" />
                                            </div>
                                        </div>

                                        <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                            <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                Deskripsi &amp; Fitur <span className="normal-case tracking-normal text-white/10">(fitur diawali &quot;- &quot;)</span>
                                            </p>
                                            <textarea rows={5} defaultValue={item.description || ''}
                                                onBlur={e => handleField(item.id, 'description', e.target.value)}
                                                className="w-full bg-transparent text-sm text-white/80 font-light leading-relaxed resize-none focus:outline-none placeholder:text-white/10"
                                                placeholder={"Deskripsi tier...\n\n- Fitur pertama\n- Fitur kedua"} />
                                        </div>

                                        <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                            <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Mood / Atmosphere</p>
                                            <input type="text" defaultValue={item.cta_text || ''}
                                                onBlur={e => handleField(item.id, 'cta_text', e.target.value)}
                                                className="w-full bg-transparent text-sm text-white/60 focus:outline-none placeholder:text-white/10"
                                                placeholder="Garden · Intimate Dining · Quiet Grandeur" />
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <button onClick={() => handleField(item.id, 'is_active', !item.is_active)}
                                                className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] transition-colors ${item.is_active ? 'text-[#CEB175]' : 'text-white/20'}`}>
                                                {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {item.is_active ? 'Tampil' : 'Disembunyikan'}
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0}
                                                    className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1">▲ Up</button>
                                                <button onClick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1}
                                                    className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1">Down ▼</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 items-end pt-2">
                                        <MinimalistTooltip text="Hapus tier">
                                            <button onClick={() => handleDelete(item.id)}
                                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all duration-300">
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
