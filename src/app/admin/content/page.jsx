'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, RefreshCw, Plus, Trash2, Type, LayoutGrid, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

const SECTIONS = ['hero', 'signature', 'approach', 'atelier', 'venues', 'philosophy', 'manifesto', 'moodboard', 'testimonial', 'partners'];
const LABELS   = {
    hero: 'Hero',
    signature: 'Signature',
    approach: 'Pendekatan',
    atelier: 'Atelier',
    venues: 'Venues',
    philosophy: 'Filosofi',
    manifesto: 'Manifesto',
    moodboard: 'Mood Board',
    testimonial: 'Testimonial',
    partners: 'Vendor & Mitra',
};
const HAS_ITEMS = ['approach', 'philosophy', 'atelier', 'partners'];

function UnderlineInput({ label, name, value, onChange, textarea = false, rows = 4, placeholder = '' }) {
    return (
        <div className="group border-b border-white/[0.03] pb-8 focus-within:border-[#CEB175]/20 transition-all duration-500">
            <label className="block text-[8px] uppercase tracking-[0.5em] text-white/20 group-focus-within:text-[#CEB175]/60 transition-all duration-500 mb-4 font-medium">
                {label}
            </label>
            {textarea ? (
                <textarea name={name} value={value || ''} onChange={onChange} rows={rows} placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/5 focus:outline-none resize-none leading-relaxed font-light tracking-wide" />
            ) : (
                <input type="text" name={name} value={value || ''} onChange={onChange} placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/5 focus:outline-none font-light tracking-wide" />
            )}
        </div>
    );
}

export default function ContentManagement() {
    const [sections,  setSections]  = useState([]);
    const [active,    setActive]    = useState(null);
    const [items,     setItems]     = useState([]);
    const [form,      setForm]      = useState({});
    const [loading,   setLoading]   = useState(true);
    const [saving,    setSaving]    = useState(false);
    const [tab,       setTab]       = useState('text');
    const [preview, setPreview] = useState(false);
    const toast   = useToast();
    const confirm = useConfirm();

    const fetchSections = async () => {
        const { data } = await supabase.from('section_content').select('*').order('section_name');
        if (data) {
            setSections(data);
            if (!active) { setActive(data[0]); setForm(data[0]); }
        }
        setLoading(false);
    };

    const fetchItems = useCallback(async (name) => {
        const { data } = await supabase.from('section_items').select('*')
            .eq('section_name', name).order('display_order');
        if (data) setItems(data);
    }, []);

    useEffect(() => { fetchSections(); }, []);
    useEffect(() => { if (active) fetchItems(active.section_name); }, [active, fetchItems]);

    // Partners hanya punya Items (daftar vendor), langsung masuk tab items
    const handleSelect = (s) => { setActive(s); setForm(s); setTab(s.section_name === 'partners' ? 'items' : 'text'); };
    const handleInput  = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); };

    const handleSaveMain = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            title: form.title,
            subtitle: form.subtitle,
            description: form.description,
            cta_text: form.cta_text,
            image_url: form.image_url,
            updated_at: new Date(),
        };
        // Hero supports video_url
        if (active?.section_name === 'hero') {
            payload.video_url = form.video_url || null;
        }
        const { error } = await supabase.from('section_content')
            .update(payload)
            .eq('id', form.id);
        setSaving(false);
        error ? toast('Gagal: ' + error.message, 'error') : toast('Konten berhasil disimpan!', 'success');
        fetchSections();
    };

    const handleAddItem = async () => {
        const { data, error } = await supabase.from('section_items')
            .insert([{ section_name: active.section_name, title: 'Item Baru', display_order: items.length }]).select();
        if (!error) setItems(p => [...p, data[0]]);
    };

    const handleDeleteItem = async (id) => {
        const ok = await confirm('Hapus Item', 'Item ini akan dihapus permanen. Lanjutkan?');
        if (!ok) return;
        await supabase.from('section_items').delete().eq('id', id);
        setItems(p => p.filter(i => i.id !== id));
        toast('Item berhasil dihapus.', 'success');
    };

    const handleItemField = async (id, field, value) => {
        await supabase.from('section_items').update({ [field]: value }).eq('id', id);
        setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const hasItems = HAS_ITEMS.includes(active?.section_name);

    return (
        <div>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-16">
                <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">Editor</p>
                <h1 className="font-serif font-light leading-[0.9] mb-8"
                    style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                    Manajemen Konten
                </h1>
                <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
            </motion.div>



            {loading ? (
                <div className="animate-pulse space-y-4 luxury-section">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] luxury-gap luxury-section">

                    {/* ── Section Index ── */}
                    <div className="border-t border-white/[0.06]">
                        <p className="text-[7px] uppercase tracking-[0.6em] text-[#CEB175]/40 py-6 border-b border-white/[0.04] font-medium">
                            Arsip Bagian
                        </p>
                        {SECTIONS.map((name) => {
                            const s      = sections.find(x => x.section_name === name);
                            const isAct  = active?.section_name === name;
                            return (
                                <button key={name} onClick={() => s && handleSelect(s)}
                                    className={`w-full flex items-center justify-between py-5 border-b border-white/[0.04] text-left group transition-all duration-500 ${
                                        isAct ? 'text-[#CEB175] pl-2' : 'text-white/20 hover:text-white/50'
                                    }`}>
                                    <span className="text-[10px] uppercase tracking-[0.4em] font-light">{LABELS[name]}</span>
                                    {isAct && <motion.div layoutId="activeInd" className="w-1 h-1 bg-[#CEB175]" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Editor ── */}
                    {active && (
                        <motion.div key={active.section_name}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >

                            {/* Section title */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 border-b border-white/[0.06] pb-10">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/50 mb-3 italic font-serif">Curating Content</p>
                                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight italic">{LABELS[active.section_name]}</h2>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* Tabs */}
                                    {/* Tabs — sembunyikan tab Teks untuk section partners */}
                                    <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1.5 backdrop-blur-sm">
                                        {active.section_name !== 'partners' && (
                                            <button onClick={() => setTab('text')}
                                                className={`flex items-center gap-2 px-5 py-2.5 text-[8px] uppercase tracking-[0.35em] font-medium transition-all duration-500 ${
                                                    tab === 'text' ? 'bg-[#CEB175] text-black shadow-lg shadow-[#CEB175]/10' : 'text-white/20 hover:text-white/50'
                                                }`}>
                                                <Type className="w-3 h-3" />Teks
                                            </button>
                                        )}
                                        {hasItems && (
                                            <MinimalistTooltip text="Lihat Item Section">
                                                <button onClick={() => setTab('items')}
                                                    className={`flex items-center gap-2 px-5 py-2.5 text-[8px] uppercase tracking-[0.35em] font-medium transition-all duration-500 ${
                                                        tab === 'items' ? 'bg-[#CEB175] text-black shadow-lg shadow-[#CEB175]/10' : 'text-white/20 hover:text-white/50'
                                                    }`}>
                                                    <LayoutGrid className="w-3 h-3" />{items.length}
                                                </button>
                                            </MinimalistTooltip>
                                        )}
                                    </div>
                                    {/* Preview Toggle */}
                                    <MinimalistTooltip text={preview ? "Tutup Pratinjau" : "Lihat Pratinjau"}>
                                        <button type="button" onClick={() => setPreview(p => !p)}
                                            className={`flex items-center gap-2 px-5 py-2.5 text-[8px] uppercase tracking-[0.35em] font-medium transition-all duration-500 border ${preview ? 'bg-[#CEB175]/10 text-[#CEB175] border-[#CEB175]/20' : 'text-white/20 border-white/[0.05] hover:text-white/50'}`}>
                                            {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            Preview
                                        </button>
                                    </MinimalistTooltip>
                                </div>
                            </div>

                            {/* TAB: Text */}
                            {tab === 'text' && (
                                <form onSubmit={handleSaveMain} className="space-y-0">
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                                            <UnderlineInput label="Subtitle" name="subtitle" value={form.subtitle} onChange={handleInput} placeholder="Teks kecil di atas judul..." />
                                            <UnderlineInput label="Judul (Title)" name="title" value={form.title} onChange={handleInput} placeholder="Judul utama section..." />
                                        </div>
                                        <UnderlineInput label="Deskripsi" name="description" value={form.description} onChange={handleInput} textarea rows={4} placeholder="Paragraf deskripsi section..." />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                                            <UnderlineInput label="URL Gambar" name="image_url" value={form.image_url} onChange={handleInput} placeholder="/images/... atau https://..." />
                                            {(active.section_name === 'hero' || active.section_name === 'manifesto') && (
                                                <UnderlineInput label="Teks Tombol CTA" name="cta_text" value={form.cta_text} onChange={handleInput} placeholder="Mulai Konsultasi..." />
                                            )}
                                        </div>
                                        {active.section_name === 'hero' && (
                                            <UnderlineInput label="URL Video Background (Opsional, .mp4)" name="video_url" value={form.video_url} onChange={handleInput} placeholder="https://...mp4 — kosongkan jika ingin gambar saja" />
                                        )}
                                    </div>

                                    {/* Save */}
                                    <div className="flex items-center justify-between pt-16">
                                        <MinimalistTooltip text="Batalkan semua perubahan">
                                            <button type="button" 
                                                onClick={async () => {
                                                    const ok = await confirm('Batalkan Perubahan', 'Reset form ke data asli?', { confirmText: 'Ya, Reset', type: 'info' });
                                                    if (ok) {
                                                        setForm(active);
                                                        toast('Form telah direset.', 'info');
                                                    }
                                                }}
                                                className="text-[9px] uppercase tracking-[0.5em] text-white/10 hover:text-[#CEB175]/60 transition-all duration-500 font-medium italic">
                                                Discard Changes
                                            </button>
                                        </MinimalistTooltip>
                                        <MinimalistTooltip text="Simpan ke Database">
                                            <button type="submit" disabled={saving}
                                                className="group flex items-center gap-4 disabled:opacity-20 transition-all duration-500">
                                                <div className="w-10 h-10 border border-[#CEB175]/20 flex items-center justify-center group-hover:border-[#CEB175]/50 transition-all duration-500">
                                                    {saving
                                                        ? <RefreshCw className="w-3.5 h-3.5 text-[#CEB175] animate-spin" />
                                                        : <Save className="w-3.5 h-3.5 text-[#CEB175] group-hover:scale-110 transition-transform duration-500" />
                                                    }
                                                </div>
                                                <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors duration-500 font-light">
                                                    {saving ? 'Preserving...' : 'Preserve Content'}
                                                </span>
                                            </button>
                                        </MinimalistTooltip>
                                    </div>
                                </form>
                            )}

                            {/* TAB: Items */}
                            {tab === 'items' && hasItems && (
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="text-[8px] uppercase tracking-[0.45em] text-white/35 mb-8">
                                            {active.section_name === 'partners'   && 'Nama Brand / Mitra'}
                                            {active.section_name === 'approach'   && 'Langkah Pendekatan'}
                                            {active.section_name === 'atelier'    && 'Pilar Estetika'}
                                            {active.section_name === 'philosophy' && 'Nilai Filosofi'}
                                        </p>
                                        <MinimalistTooltip text="Tambah item baru">
                                            <button onClick={handleAddItem}
                                                className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-white/25 hover:text-[#CEB175] transition-colors">
                                                <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                                                Tambah
                                            </button>
                                        </MinimalistTooltip>
                                    </div>

                                    <div className="border-t border-white/[0.06] space-y-0">
                                        {items.map((item, idx) => (
                                            <div key={item.id}
                                                className="group/item border-b border-white/[0.05] py-7 hover:border-[#CEB175]/15 transition-colors duration-400">
                                                <div className="flex items-start gap-6">
                                                    <span className="font-serif text-xl text-[#1a1a1a] italic shrink-0 mt-1">
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="group/f border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Judul</p>
                                                                <input type="text" value={item.title || ''} onChange={e => handleItemField(item.id, 'title', e.target.value)}
                                                                    className="w-full bg-transparent text-sm text-white focus:outline-none" />
                                                            </div>
                                                            {active.section_name !== 'partners' && (
                                                                <div className="group/f border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                                    <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                                                                        {['approach','philosophy'].includes(active.section_name) ? 'Icon' : 'Tag'}
                                                                    </p>
                                                                    <input type="text"
                                                                        value={['approach','philosophy'].includes(active.section_name) ? (item.icon_name || '') : (item.tag || '')}
                                                                        onChange={e => handleItemField(item.id, ['approach','philosophy'].includes(active.section_name) ? 'icon_name' : 'tag', e.target.value)}
                                                                        placeholder={['approach','philosophy'].includes(active.section_name) ? 'Diamond, Heart...' : 'Label tag...'}
                                                                        className="w-full bg-transparent text-sm text-white placeholder:text-white/10 focus:outline-none" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {active.section_name !== 'partners' && (
                                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">Deskripsi</p>
                                                                <textarea value={item.description || ''} rows={2}
                                                                    onChange={e => handleItemField(item.id, 'description', e.target.value)}
                                                                    className="w-full bg-transparent text-sm text-white leading-relaxed resize-none focus:outline-none" />
                                                            </div>
                                                        )}
                                                        {active.section_name === 'atelier' && (
                                                            <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                                                                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">URL Gambar</p>
                                                                <input type="text" value={item.image_url || ''}
                                                                    onChange={e => handleItemField(item.id, 'image_url', e.target.value)}
                                                                    placeholder="/images/..." className="w-full bg-transparent text-sm text-white placeholder:text-white/10 focus:outline-none" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <MinimalistTooltip text="Hapus item ini">
                                                        <button onClick={() => handleDeleteItem(item.id)}
                                                            className="opacity-0 group-hover/item:opacity-100 text-white/20 hover:text-red-400 transition-all duration-300 mt-2 shrink-0">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </MinimalistTooltip>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Live Preview ── */}
                            <AnimatePresence>
                                {preview && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden">
                                        <div className="mt-10 border border-white/[0.06] overflow-hidden">
                                            {/* Preview Header */}
                                            <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                                                <div className="flex gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-red-500/50" />
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                    <span className="w-2 h-2 rounded-full bg-green-500/50" />
                                                </div>
                                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/20 ml-2">
                                                    Live Preview — {LABELS[active.section_name]}
                                                </p>
                                            </div>
                                            {/* Preview Body */}
                                            <div className="p-5 sm:p-8 md:p-12 bg-[#060606] min-h-[160px] sm:min-h-[200px]">
                                                {form.subtitle && (
                                                    <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/60 mb-3 sm:mb-4">
                                                        {form.subtitle}
                                                    </p>
                                                )}
                                                {form.title && (
                                                    <h2 className="font-serif font-light text-white leading-[0.95] mb-4 sm:mb-6"
                                                        style={{ fontSize: 'clamp(22px, 3.5vw, 52px)' }}>
                                                        {form.title}
                                                    </h2>
                                                )}
                                                {form.description && (
                                                    <p className="text-sm text-white/50 leading-relaxed max-w-lg mb-6 whitespace-pre-line">
                                                        {form.description}
                                                    </p>
                                                )}
                                                {form.cta_text && (
                                                    <span className="inline-block text-[9px] uppercase tracking-[0.4em] text-[#CEB175] border-b border-[#CEB175]/30 pb-1">
                                                        {form.cta_text}
                                                    </span>
                                                )}
                                                {form.image_url && (
                                                    <div className="mt-8 overflow-hidden border border-white/[0.05] max-w-md">
                                                        <img src={form.image_url} alt="Preview"
                                                            className="w-full h-48 object-cover"
                                                            onError={(e) => { e.target.style.display = 'none'; }} />
                                                    </div>
                                                )}
                                                {!form.title && !form.subtitle && !form.description && (
                                                    <p className="text-[9px] text-white/15 italic">Mulai ketik untuk melihat preview...</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
