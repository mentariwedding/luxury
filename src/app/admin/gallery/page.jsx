'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import {
    Plus, Trash2, Image as ImageIcon,
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

/* ── Upload Modal (rendered via Portal to avoid transform-context issues) ── */
function UploadModal({ onClose, onSuccess }) {
    const [newPhoto,   setNewPhoto]  = useState({ title: '', category: 'Tawa Lepas', file: null });
    const [uploading,  setUploading] = useState(false);
    const [error,      setError]     = useState('');
    const [showCats,   setShowCats]  = useState(false);

    const categories = ['Tawa Lepas', 'Hangat', 'Estetik'];

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newPhoto.file) return;

        setUploading(true);
        setError('');

        try {
            const ext      = newPhoto.file.name.split('.').pop();
            const filePath = `portfolio/${Date.now()}.${ext}`;

            const { error: upErr } = await supabase.storage
                .from('photos')
                .upload(filePath, newPhoto.file);
            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath);

            const { error: dbErr } = await supabase
                .from('portfolio_gallery')
                .insert([{ title: newPhoto.title, category: newPhoto.category, image_url: publicUrl }]);
            if (dbErr) throw dbErr;

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
             style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal — scrollable wrapper so it never goes off-screen */}
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{   opacity: 0, scale: 0.98, y: 20  }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0a0a0a] border border-[#CEB175]/15 p-8"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <h2 className="font-serif text-2xl font-light text-white italic mb-1">Unggah Foto</h2>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">Tambah ke arsip visual</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/25 hover:text-white/60 transition-colors duration-300 mt-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-5">
                        {/* Title & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Judul</label>
                                <input
                                    type="text" required
                                    value={newPhoto.title}
                                    onChange={(e) => setNewPhoto(p => ({ ...p, title: e.target.value }))}
                                    placeholder="Nama momen..."
                                    className="w-full bg-transparent border-b border-white/[0.08] focus-within:border-[#CEB175]/40 px-0 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Kategori</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCats(!showCats)}
                                        className={`w-full bg-white/[0.03] border ${showCats ? 'border-[#CEB175]/40' : 'border-white/[0.07]'} px-4 py-3 text-sm text-white flex items-center justify-between transition-all duration-300 hover:bg-white/[0.05]`}
                                    >
                                        <span className={newPhoto.category ? 'text-white' : 'text-white/20'}>
                                            {newPhoto.category || 'Pilih Kategori'}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-[#CEB175]/50 transition-transform duration-500 ${showCats ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showCats && (
                                            <>
                                                {/* Invisible backdrop to close dropdown */}
                                                <div className="fixed inset-0 z-10" onClick={() => setShowCats(false)} />
                                                
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                                                    animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
                                                    exit={{    opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                                                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                                    className="absolute top-full left-0 right-0 mt-2 z-20 bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                                >
                                                    <div className="py-1.5">
                                                        {categories.map((cat, i) => (
                                                            <button
                                                                key={cat}
                                                                type="button"
                                                                onClick={() => {
                                                                    setNewPhoto(p => ({ ...p, category: cat }));
                                                                    setShowCats(false);
                                                                }}
                                                                className={`w-full px-5 py-3 text-left text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-between group ${
                                                                    newPhoto.category === cat 
                                                                        ? 'text-[#CEB175] bg-[#CEB175]/5' 
                                                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                                                }`}
                                                            >
                                                                {cat}
                                                                {newPhoto.category === cat && (
                                                                    <motion.div layoutId="activeCat" className="w-1 h-1 rounded-full bg-[#CEB175]" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* File Drop */}
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Berkas Gambar</label>
                            <div className="relative">
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && setNewPhoto(p => ({ ...p, file: e.target.files[0] }))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-white/[0.07] p-8 text-center hover:border-[#CEB175]/25 transition-colors duration-300">
                                    {newPhoto.file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-[#CEB175]/15 flex items-center justify-center text-[#CEB175]">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <p className="text-white text-xs font-medium">{newPhoto.file.name}</p>
                                            <p className="text-[9px] text-white/25 uppercase tracking-wider">Klik untuk ganti</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/30">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <p className="text-white/40 text-xs">Tarik gambar atau klik untuk memilih</p>
                                            <p className="text-[9px] text-white/25 uppercase tracking-wider">Rekomendasi: rasio 4:5</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] text-center border border-red-500/15 rounded-xl py-2.5 px-4 bg-red-500/5">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={uploading || !newPhoto.file}
                            className="w-full flex items-center justify-center gap-2 bg-[#CEB175] text-black py-3.5 text-[10px] uppercase tracking-[0.35em] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D4C090] transition-all duration-400"
                        >
                            {uploading
                                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mengunggah...</>
                                : <><Check className="w-3.5 h-3.5" /> Simpan ke Galeri</>
                            }
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>,
        document.body
    );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function GalleryAdmin() {
    const [photos,    setPhotos]    = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search,    setSearch]    = useState('');
    const [filter,    setFilter]    = useState('Semua');
    const toast   = useToast();
    const confirm = useConfirm();

    const fetchPhotos = async () => {
        const { data, error } = await supabase
            .from('portfolio_gallery')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setPhotos(data);
        setLoading(false);
    };

    useEffect(() => { fetchPhotos(); }, []);

    const handleDelete = async (id, imageUrl) => {
        const ok = await confirm('Hapus Foto', 'Foto akan dihapus permanen dari galeri dan storage. Tindakan ini tidak bisa dibatalkan.');
        if (!ok) return;

        // Hapus dari Storage
        try {
            const parts = imageUrl?.split('/storage/v1/object/public/photos/');
            if (parts?.[1]) await supabase.storage.from('photos').remove([parts[1]]);
        } catch (e) { console.warn('Storage cleanup:', e.message); }

        // Hapus dari DB
        const { error } = await supabase.from('portfolio_gallery').delete().eq('id', id);
        if (!error) {
            toast('Foto berhasil dihapus.', 'success');
            fetchPhotos();
        } else {
            toast('Gagal menghapus foto.', 'error');
        }
    };

    return (
        <div className="luxury-section">
            {/* Header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                <div>
                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/70 mb-5">Arsip Visual</p>
                    <h1 className="font-serif font-light leading-[0.9] mb-6 sm:mb-8"
                        style={{ fontSize: 'clamp(34px, 6vw, 80px)' }}>
                        Galeri <span className="italic text-white/30">Foto</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-16" />
                </div>
                <MinimalistTooltip text="Unggah foto baru">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-transparent border border-[#CEB175]/30 text-[#CEB175] px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-light hover:bg-[#CEB175]/10 transition-all duration-400 group shrink-0 mb-1"
                    >
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah Foto
                    </button>
                </MinimalistTooltip>
            </motion.div>

            {/* Search & Filter Bar */}
            {!loading && photos.length > 0 && (
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari foto..."
                            className="w-full sm:w-64 bg-white/[0.03] border border-white/[0.06] pl-10 pr-4 py-2.5 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#CEB175]/30 transition-colors tracking-wider"
                        />
                    </div>
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {['Semua', ...new Set(photos.map(p => p.category).filter(Boolean))].map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                                    filter === cat
                                        ? 'bg-[#CEB175] text-black border-[#CEB175] font-semibold'
                                        : 'bg-transparent text-white/30 border-white/[0.06] hover:text-white/60 hover:border-white/[0.12]'
                                }`}>
                                {cat}
                            </button>
                        ))}
                        <span className="text-[8px] text-white/20 tracking-wider ml-2">
                            {(() => {
                                const f = photos.filter(p =>
                                    (filter === 'Semua' || p.category === filter) &&
                                    (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
                                );
                                return `${f.length} foto`;
                            })()}
                        </span>
                    </div>
                </motion.div>
            )}
            {/* Grid */}
            <div className="mt-12">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.03] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/[0.05]">
                        <ImageIcon className="w-10 h-10 text-white/25 mx-auto mb-4" />
                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/25">Belum ada foto</p>
                    </div>
                ) : (() => {
                    const filtered = photos.filter(p =>
                        (filter === 'Semua' || p.category === filter) &&
                        (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
                    );
                    return filtered.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/[0.05]">
                            <Search className="w-8 h-8 text-white/15 mx-auto mb-4" />
                            <p className="text-[8px] uppercase tracking-[0.4em] text-white/25">Tidak ditemukan</p>
                        </div>
                    ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((photo, i) => (
                            <motion.div
                                key={photo.id}
                                custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                className="group relative bg-white/[0.02] border border-white/[0.05] overflow-hidden hover:border-[#CEB175]/20 transition-colors duration-500"
                            >
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={photo.image_url}
                                        alt={photo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-4 pb-5 text-center gap-3">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#CEB175] mb-1">{photo.category}</p>
                                        <p className="font-serif text-base text-white italic leading-tight">{photo.title}</p>
                                    </div>
                                    <MinimalistTooltip text="Hapus Foto">
                                        <button
                                            onClick={() => handleDelete(photo.id, photo.image_url)}
                                            className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </MinimalistTooltip>
                                </div>

                                {/* Category label (static) */}
                                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/40">{photo.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    );
                })()}
            </div>

            {/* Upload Modal via Portal */}
            <AnimatePresence>
                {showModal && (
                    <UploadModal
                        onClose={() => setShowModal(false)}
                        onSuccess={() => { fetchPhotos(); toast('Foto berhasil diunggah!', 'success'); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
