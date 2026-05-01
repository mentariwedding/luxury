'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import {
    Plus, Trash2, Image as ImageIcon, Edit2,
    Upload, RefreshCw, X, Check, Search, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmModal';
import MinimalistTooltip from '@/components/MinimalistTooltip';

const fadeUp = {
    hidden:  { opacity: 0, y: 14, filter: 'blur(6px)' },
    visible: (i = 0) => ({
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }),
};

const CATEGORIES = ['Romantic', 'Bold', 'Natural', 'Elegant', 'Garden'];

/* ── Category Dropdown ── */
function CategorySelect({ value, onChange }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full bg-white/[0.03] border ${open ? 'border-[#CEB175]/40' : 'border-white/[0.07]'} px-4 py-3 text-sm text-white flex items-center justify-between transition-all duration-300 hover:bg-white/[0.05]`}
            >
                <span className={value ? 'text-white' : 'text-white/20'}>{value || 'Pilih Kategori'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#CEB175]/50 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-full left-0 right-0 mt-2 z-20 bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/[0.08] overflow-hidden"
                        >
                            <div className="py-1.5">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => { onChange(cat); setOpen(false); }}
                                        className={`w-full px-5 py-3 text-left text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-between ${value === cat ? 'text-[#CEB175] bg-[#CEB175]/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat}
                                        {value === cat && <div className="w-1 h-1 bg-[#CEB175]" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Upload Modal ── */
function UploadModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ title: '', category: 'Romantic', file: null });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!form.file) return;
        setUploading(true); setError('');
        try {
            const ext = form.file.name.split('.').pop();
            const filePath = `portfolio/${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage.from('photos').upload(filePath, form.file);
            if (upErr) throw upErr;
            const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
            const { error: dbErr } = await supabase.from('portfolio_gallery').insert([{ title: form.title, category: form.category, image_url: publicUrl }]);
            if (dbErr) throw dbErr;
            onSuccess(); onClose();
        } catch (err) { setError(err.message); }
        finally { setUploading(false); }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0a0a0a] border border-[#CEB175]/15 p-8"
                >
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <h2 className="font-serif text-2xl font-light text-white italic mb-1">Unggah Foto</h2>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">Tambah ke arsip visual</p>
                        </div>
                        <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors duration-300 mt-1"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleUpload} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Judul</label>
                                <input type="text" required value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="Nama momen..."
                                    className="w-full bg-transparent border-b border-white/[0.08] focus-within:border-[#CEB175]/40 px-0 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Kategori</label>
                                <CategorySelect value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Berkas Gambar</label>
                            <div className="relative">
                                <input type="file" accept="image/*"
                                    onChange={e => e.target.files?.[0] && setForm(p => ({ ...p, file: e.target.files[0] }))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="border-2 border-dashed border-white/[0.07] p-8 text-center hover:border-[#CEB175]/25 transition-colors duration-300">
                                    {form.file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-[#CEB175]/15 flex items-center justify-center text-[#CEB175]"><ImageIcon className="w-5 h-5" /></div>
                                            <p className="text-white text-xs font-medium">{form.file.name}</p>
                                            <p className="text-[9px] text-white/25 uppercase tracking-wider">Klik untuk ganti</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-white/30"><Upload className="w-5 h-5" /></div>
                                            <p className="text-white/40 text-xs">Tarik gambar atau klik untuk memilih</p>
                                            <p className="text-[9px] text-white/25 uppercase tracking-wider">Rekomendasi: rasio 4:5</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-[10px] text-center border border-red-500/15 py-2.5 px-4 bg-red-500/5">{error}</p>}
                        <button type="submit" disabled={uploading || !form.file}
                            className="w-full flex items-center justify-center gap-2 bg-[#CEB175] text-black py-3.5 text-[10px] uppercase tracking-[0.35em] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D4C090] transition-all duration-400">
                            {uploading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mengunggah...</> : <><Check className="w-3.5 h-3.5" /> Simpan ke Galeri</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>,
        document.body
    );
}

/* ── Edit Modal ── */
function EditModal({ photo, onClose, onSuccess }) {
    const [form, setForm] = useState({ title: photo.title || '', category: photo.category || 'Romantic', image_url: photo.image_url || '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title || !form.image_url) return;
        setSaving(true); setError('');
        try {
            const { error: dbErr } = await supabase.from('portfolio_gallery')
                .update({ title: form.title, category: form.category, image_url: form.image_url })
                .eq('id', photo.id);
            if (dbErr) throw dbErr;
            onSuccess(); onClose();
        } catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0a0a0a] border border-[#CEB175]/15 p-8"
                >
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <h2 className="font-serif text-2xl font-light text-white italic mb-1">Edit Foto</h2>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">Perbarui detail foto</p>
                        </div>
                        <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors duration-300 mt-1"><X className="w-4 h-4" /></button>
                    </div>

                    {/* Preview */}
                    <div className="mb-6 aspect-[4/3] overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                        {form.image_url
                            ? <img src={form.image_url} alt="Preview" className="w-full h-full object-cover opacity-70" />
                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-white/10" /></div>
                        }
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Judul *</label>
                            <input type="text" required value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                placeholder="Nama momen..."
                                className="w-full bg-transparent border-b border-white/[0.08] focus-within:border-[#CEB175]/40 px-0 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Kategori</label>
                            <CategorySelect value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">URL Gambar *</label>
                            <input type="text" required value={form.image_url}
                                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                                placeholder="https://... atau /images/foto.jpg"
                                className="w-full bg-transparent border-b border-white/[0.08] focus-within:border-[#CEB175]/40 px-0 py-2.5 text-sm text-white font-mono text-xs placeholder:text-white/10 focus:outline-none transition-colors" />
                            <p className="text-[8px] text-white/20">Ganti URL untuk mengganti gambar</p>
                        </div>

                        {error && <p className="text-red-400 text-[10px] text-center border border-red-500/15 py-2.5 px-4 bg-red-500/5">{error}</p>}

                        <div className="flex items-center gap-3 pt-2">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-3 text-[9px] uppercase tracking-[0.4em] text-white/30 border border-white/[0.06] hover:border-white/[0.15] hover:text-white/60 transition-all duration-300">
                                Batal
                            </button>
                            <button type="submit" disabled={saving || !form.title || !form.image_url}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#CEB175] text-black py-3 text-[9px] uppercase tracking-[0.4em] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D4C090] transition-all duration-400">
                                {saving ? <><RefreshCw className="w-3 h-3 animate-spin" /> Menyimpan...</> : <><Check className="w-3 h-3" /> Simpan</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>,
        document.body
    );
}

/* ── Main Page ── */
export default function GalleryAdmin() {
    const [photos,     setPhotos]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [editPhoto,  setEditPhoto]  = useState(null);
    const [search,     setSearch]     = useState('');
    const [filter,     setFilter]     = useState('Semua');
    const toast   = useToast();
    const confirm = useConfirm();

    const fetchPhotos = async () => {
        const { data, error } = await supabase.from('portfolio_gallery').select('*').order('created_at', { ascending: false });
        if (!error) setPhotos(data);
        setLoading(false);
    };

    useEffect(() => { fetchPhotos(); }, []);

    const handleDelete = async (id, imageUrl) => {
        const ok = await confirm('Hapus Foto', 'Foto akan dihapus permanen dari galeri dan storage.');
        if (!ok) return;
        try {
            const parts = imageUrl?.split('/storage/v1/object/public/photos/');
            if (parts?.[1]) await supabase.storage.from('photos').remove([parts[1]]);
        } catch (e) { console.warn('Storage cleanup:', e.message); }
        const { error } = await supabase.from('portfolio_gallery').delete().eq('id', id);
        if (!error) { toast('Foto berhasil dihapus.', 'success'); fetchPhotos(); }
        else toast('Gagal menghapus foto.', 'error');
    };

    const filtered = photos.filter(p =>
        (filter === 'Semua' || p.category === filter) &&
        (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="luxury-section">
            {/* Header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                <div>
                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/70 mb-5">Arsip Visual</p>
                    <h1 className="font-serif font-light leading-[0.9] mb-6 sm:mb-8" style={{ fontSize: 'clamp(34px, 6vw, 80px)' }}>
                        Galeri <span className="italic text-white/30">Foto</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-16" />
                </div>
                <MinimalistTooltip text="Unggah foto baru">
                    <button onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 bg-transparent border border-[#CEB175]/30 text-[#CEB175] px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-light hover:bg-[#CEB175]/10 transition-all duration-400 group shrink-0 mb-1">
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah Foto
                    </button>
                </MinimalistTooltip>
            </motion.div>

            {/* Search & Filter */}
            {!loading && photos.length > 0 && (
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari foto..."
                            className="w-full sm:w-64 bg-white/[0.03] border border-white/[0.06] pl-10 pr-4 py-2.5 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#CEB175]/30 transition-colors tracking-wider" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {['Semua', ...new Set(photos.map(p => p.category).filter(Boolean))].map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.3em] border transition-all duration-300 ${filter === cat ? 'bg-[#CEB175] text-black border-[#CEB175] font-semibold' : 'bg-transparent text-white/30 border-white/[0.06] hover:text-white/60 hover:border-white/[0.12]'}`}>
                                {cat}
                            </button>
                        ))}
                        <span className="text-[8px] text-white/20 tracking-wider ml-2">{filtered.length} foto</span>
                    </div>
                </motion.div>
            )}

            {/* Grid */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-white/[0.03] animate-pulse" />)}
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/[0.05]">
                        <ImageIcon className="w-10 h-10 text-white/25 mx-auto mb-4" />
                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/25">Belum ada foto</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/[0.05]">
                        <Search className="w-8 h-8 text-white/15 mx-auto mb-4" />
                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/25">Tidak ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((photo, i) => (
                            <motion.div key={photo.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                className="group relative bg-white/[0.02] border border-white/[0.05] overflow-hidden hover:border-[#CEB175]/20 transition-colors duration-500">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img src={photo.image_url} alt={photo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-4 pb-5 text-center gap-3">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#CEB175] mb-1">{photo.category}</p>
                                        <p className="font-serif text-sm text-white italic leading-tight">{photo.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MinimalistTooltip text="Edit Foto">
                                            <button onClick={() => setEditPhoto(photo)}
                                                className="w-8 h-8 bg-white/10 border border-white/20 text-white/70 flex items-center justify-center hover:bg-[#CEB175] hover:text-black hover:border-[#CEB175] transition-all duration-300">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                        </MinimalistTooltip>
                                        <MinimalistTooltip text="Hapus Foto">
                                            <button onClick={() => handleDelete(photo.id, photo.image_url)}
                                                className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </MinimalistTooltip>
                                    </div>
                                </div>

                                {/* Category label */}
                                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/40">{photo.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showUpload && (
                    <UploadModal
                        onClose={() => setShowUpload(false)}
                        onSuccess={() => { fetchPhotos(); toast('Foto berhasil diunggah!', 'success'); }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {editPhoto && (
                    <EditModal
                        photo={editPhoto}
                        onClose={() => setEditPhoto(null)}
                        onSuccess={() => { fetchPhotos(); toast('Foto berhasil diperbarui!', 'success'); setEditPhoto(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
