'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import {
    Plus, Trash2, Image as ImageIcon,
    Upload, RefreshCw, X, Check, GripVertical, Eye, EyeOff
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

/* ── Add/Edit Modal ── */
function PostModal({ post, onClose, onSuccess }) {
    const [form, setForm] = useState({
        image_url: post?.image_url || '',
        caption: post?.caption || '',
        post_url: post?.post_url || '',
        display_order: post?.display_order || 0,
        is_active: post?.is_active ?? true,
    });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!post?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            let imageUrl = form.image_url;

            // Upload file if selected
            if (file) {
                const ext = file.name.split('.').pop();
                const filePath = `instagram/${Date.now()}.${ext}`;

                const { error: upErr } = await supabase.storage
                    .from('photos')
                    .upload(filePath, file);
                if (upErr) throw upErr;

                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            if (!imageUrl) throw new Error('Pilih gambar atau masukkan URL');

            const payload = { ...form, image_url: imageUrl };

            if (isEdit) {
                const { error: dbErr } = await supabase
                    .from('instagram_feed')
                    .update(payload)
                    .eq('id', post.id);
                if (dbErr) throw dbErr;
            } else {
                const { error: dbErr } = await supabase
                    .from('instagram_feed')
                    .insert([payload]);
                if (dbErr) throw dbErr;
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
             style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{   opacity: 0, scale: 0.96, y: 20  }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0a0a0a] border border-white/[0.07] rounded-3xl p-8"
                >
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <h2 className="font-serif text-2xl font-light text-white italic mb-1">
                                {isEdit ? 'Edit Post' : 'Tambah Post'}
                            </h2>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                                Instagram feed preview
                            </p>
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/35 hover:text-white transition-colors mt-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Caption */}
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Caption</label>
                            <input
                                type="text"
                                value={form.caption}
                                onChange={(e) => setForm(f => ({ ...f, caption: e.target.value }))}
                                placeholder="Deskripsi singkat..."
                                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-[#CEB175]/30 transition-colors"
                            />
                        </div>

                        {/* Image URL or Upload */}
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">URL Gambar</label>
                            <input
                                type="text"
                                value={form.image_url}
                                onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))}
                                placeholder="/images/foto.jpg atau URL external"
                                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-[#CEB175]/30 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Atau Upload File</label>
                            <div className="relative">
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-white/[0.07] rounded-2xl p-6 text-center hover:border-[#CEB175]/25 transition-colors duration-300">
                                    {file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-[#CEB175]" />
                                            <p className="text-white text-xs font-medium">{file.name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-5 h-5 text-white/30" />
                                            <p className="text-white/40 text-xs">Tarik atau klik untuk upload</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Display Order & Active */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Urutan</label>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={(e) => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#CEB175]/30 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/35">Status</label>
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                                    className={`w-full flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                                        form.is_active
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-white/[0.03] border-white/[0.07] text-white/30'
                                    }`}
                                >
                                    {form.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    {form.is_active ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] text-center border border-red-500/15 rounded-xl py-2.5 px-4 bg-red-500/5">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 bg-[#CEB175] text-black py-3.5 rounded-xl text-[10px] uppercase tracking-[0.35em] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(206,177,117,0.2)] transition-all duration-400"
                        >
                            {saving
                                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...</>
                                : <><Check className="w-3.5 h-3.5" /> {isEdit ? 'Perbarui' : 'Simpan'}</>
                            }
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>,
        document.body
    );
}

/* ── Main Page ── */
export default function InstagramAdmin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const toast = useToast();
    const confirm = useConfirm();

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('instagram_feed')
            .select('*')
            .order('display_order', { ascending: true });
        if (!error) setPosts(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleDelete = async (id) => {
        const ok = await confirm('Hapus Post', 'Post ini akan dihapus dari feed Instagram. Lanjutkan?');
        if (!ok) return;

        const { error } = await supabase.from('instagram_feed').delete().eq('id', id);
        if (!error) {
            toast('Post berhasil dihapus.', 'success');
            fetchPosts();
        } else {
            toast('Gagal menghapus post.', 'error');
        }
    };

    const toggleActive = async (id, currentState) => {
        const { error } = await supabase
            .from('instagram_feed')
            .update({ is_active: !currentState })
            .eq('id', id);
        if (!error) {
            fetchPosts();
            toast(!currentState ? 'Post diaktifkan.' : 'Post dinonaktifkan.', 'success');
        }
    };

    const openEdit = (post) => {
        setEditPost(post);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditPost(null);
        setShowModal(true);
    };

    return (
        <div className="luxury-section">
            {/* Header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                <div>
                    <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/70 mb-5">Feed Preview</p>
                    <h1 className="font-serif font-light leading-[0.9] mb-6 sm:mb-8"
                        style={{ fontSize: 'clamp(34px, 6vw, 80px)' }}>
                        Instagram <span className="italic text-white/30">Feed</span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-[#CEB175]/40 to-transparent w-16" />
                </div>
                <MinimalistTooltip text="Tambah post baru">
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-[#CEB175] text-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.3em] font-semibold hover:shadow-[0_0_25px_rgba(206,177,117,0.2)] transition-all duration-400 group shrink-0 mb-1"
                    >
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                        Tambah Post
                    </button>
                </MinimalistTooltip>
            </motion.div>

            {/* Info */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="mb-10 p-5 border border-[#CEB175]/10 rounded-2xl bg-[#CEB175]/[0.02]">
                <p className="text-[10px] text-white/40 leading-relaxed">
                    <span className="text-[#CEB175]">💡</span> Foto-foto ini ditampilkan di bagian bawah footer website.
                    Upload foto yang sama seperti postingan Instagram kamu. Maksimal 4 foto ditampilkan.
                </p>
            </motion.div>

            {/* Grid */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-white/[0.03] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-white/[0.05] rounded-3xl">
                        <ImageIcon className="w-10 h-10 text-white/25 mx-auto mb-4" />
                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/25">Belum ada post</p>
                        <p className="text-[9px] text-white/15 mt-2">Tambahkan foto untuk ditampilkan di footer</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                custom={i} variants={fadeUp} initial="hidden" animate="visible"
                                className={`group relative bg-white/[0.02] border rounded-2xl overflow-hidden transition-colors duration-500 ${
                                    post.is_active ? 'border-white/[0.05] hover:border-[#CEB175]/20' : 'border-red-500/10 opacity-50'
                                }`}
                            >
                                <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => openEdit(post)}>
                                    <img
                                        src={post.image_url}
                                        alt={post.caption || 'Instagram post'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Caption overlay */}
                                {post.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
                                        <p className="text-[8px] text-white/60 truncate">{post.caption}</p>
                                    </div>
                                )}

                                {/* Actions overlay */}
                                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <MinimalistTooltip text={post.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                                        <button
                                            onClick={() => toggleActive(post.id, post.is_active)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                post.is_active
                                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'
                                                    : 'bg-white/10 text-white/40 hover:bg-white/20'
                                            }`}
                                        >
                                            {post.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                    </MinimalistTooltip>
                                    <MinimalistTooltip text="Hapus">
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="w-8 h-8 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </MinimalistTooltip>
                                </div>

                                {/* Order badge */}
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-[8px] bg-black/60 backdrop-blur-sm text-white/50 px-2 py-1 rounded-md">
                                        #{post.display_order}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <PostModal
                        post={editPost}
                        onClose={() => { setShowModal(false); setEditPost(null); }}
                        onSuccess={() => { fetchPosts(); toast(editPost ? 'Post diperbarui!' : 'Post ditambahkan!', 'success'); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
