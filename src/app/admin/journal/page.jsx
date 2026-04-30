'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, RefreshCw, X, Check } from 'lucide-react';

const EMPTY = { title: '', slug: '', tagline: '', content: '', cover_image: '', aesthetic_tag: '', venue_hint: '', season: '', is_published: false, display_order: 0 };

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

export default function JournalAdmin() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // null | 'new' | entry object
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('journal_entries').select('*').order('display_order', { ascending: true });
        setEntries(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const startNew = () => { setForm(EMPTY); setEditing('new'); };
    const startEdit = (e) => { setForm({ ...e }); setEditing(e); };
    const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

    const handleForm = (k, v) => {
        setForm(prev => {
            const next = { ...prev, [k]: v };
            if (k === 'title' && (!prev.slug || prev.slug === slugify(prev.title))) {
                next.slug = slugify(v);
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!form.title || !form.slug) return;
        setSaving(true);
        if (editing === 'new') {
            await supabase.from('journal_entries').insert([{ ...form }]);
        } else {
            await supabase.from('journal_entries').update({ ...form }).eq('id', editing.id);
        }
        setSaving(false);
        cancelEdit();
        fetch();
    };

    const togglePublish = async (entry) => {
        await supabase.from('journal_entries').update({ is_published: !entry.is_published }).eq('id', entry.id);
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_published: !e.is_published } : e));
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        await supabase.from('journal_entries').delete().eq('id', id);
        setEntries(prev => prev.filter(e => e.id !== id));
        setDeleting(null);
    };

    const S = { fontFamily: "'Montserrat', sans-serif" };
    const inp = { background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#FAFAFA', outline: 'none', fontSize: 13, padding: '8px 0', width: '100%', fontFamily: "'Montserrat', sans-serif", fontWeight: 300 };
    const label = { fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#525252', marginBottom: 6, display: 'block', fontWeight: 300 };

    return (
        <div style={S}>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CEB175', marginBottom: 8, fontWeight: 300 }}>Admin · Kisah</p>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, color: '#FAFAFA', margin: 0 }}>Jurnal Editorial</h1>
                    <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8, fontWeight: 300 }}>Kelola cerita yang tampil di halaman /kisah.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetch} style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={startNew} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(206,177,117,0.1)', border: '1px solid rgba(206,177,117,0.3)', color: '#CEB175', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 300 }}>
                        <Plus size={14} /> Cerita Baru
                    </button>
                </div>
            </div>

            {/* Editor Modal */}
            {editing && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
                    <div style={{ background: '#0A0A0A', border: '1px solid rgba(206,177,117,0.15)', borderRadius: 16, width: '100%', maxWidth: 680, padding: '40px', position: 'relative' }}>
                        <button onClick={cancelEdit} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                            <X size={16} />
                        </button>
                        <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CEB175', marginBottom: 8 }}>{editing === 'new' ? 'Cerita Baru' : 'Edit Cerita'}</p>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#FAFAFA', margin: '0 0 28px' }}>
                            {editing === 'new' ? 'Tulis Cerita Baru' : 'Edit: ' + (form.title?.slice(0, 30) || '')}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={label}>Judul *</label>
                                <input style={inp} value={form.title} onChange={e => handleForm('title', e.target.value)} placeholder="Sebuah Sabtu di Lereng Gunung" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={label}>Slug (URL) *</label>
                                <input style={{ ...inp, color: '#CEB175', fontFamily: 'monospace', fontSize: 12 }} value={form.slug} onChange={e => handleForm('slug', e.target.value)} placeholder="sabtu-di-lereng-gunung" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={label}>Tagline (1-2 kalimat)</label>
                                <input style={inp} value={form.tagline} onChange={e => handleForm('tagline', e.target.value)} placeholder="Ketika kabut turun tepat saat ijab kabul..." />
                            </div>
                            <div>
                                <label style={label}>Estetika</label>
                                <input style={inp} value={form.aesthetic_tag} onChange={e => handleForm('aesthetic_tag', e.target.value)} placeholder="Natural / Romantic / Elegant" />
                            </div>
                            <div>
                                <label style={label}>Venue (cryptic)</label>
                                <input style={inp} value={form.venue_hint} onChange={e => handleForm('venue_hint', e.target.value)} placeholder="Lereng Gunung, Sukabumi" />
                            </div>
                            <div>
                                <label style={label}>Musim / Waktu</label>
                                <input style={inp} value={form.season} onChange={e => handleForm('season', e.target.value)} placeholder="Musim Hujan 2024" />
                            </div>
                            <div>
                                <label style={label}>Urutan Tampil</label>
                                <input style={inp} type="number" value={form.display_order} onChange={e => handleForm('display_order', parseInt(e.target.value) || 0)} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={label}>URL Gambar Cover</label>
                                <input style={inp} value={form.cover_image} onChange={e => handleForm('cover_image', e.target.value)} placeholder="https://... atau /images/foto.jpg" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={label}>Isi Cerita (paragraf dipisah dengan baris kosong)</label>
                                <textarea style={{ ...inp, resize: 'vertical', minHeight: 200, paddingTop: 12, lineHeight: 1.8 }}
                                    value={form.content} onChange={e => handleForm('content', e.target.value)}
                                    placeholder="Ada pagi-pagi yang terasa berbeda...&#10;&#10;Paragraf kedua..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button onClick={() => handleForm('is_published', !form.is_published)}
                                    style={{ width: 40, height: 20, borderRadius: 10, background: form.is_published ? '#CEB175' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', transition: 'background 0.3s', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: 2, left: form.is_published ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: form.is_published ? '#000' : '#555', transition: 'left 0.3s' }} />
                                </button>
                                <label style={{ ...label, margin: 0, color: form.is_published ? '#CEB175' : '#525252' }}>
                                    {form.is_published ? 'Diterbitkan' : 'Draft'}
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
                            <button onClick={cancelEdit} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#525252', borderRadius: 20, padding: '8px 20px', cursor: 'pointer', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Batal</button>
                            <button onClick={handleSave} disabled={saving || !form.title || !form.slug}
                                style={{ background: '#CEB175', border: 'none', color: '#000', borderRadius: 20, padding: '8px 24px', cursor: 'pointer', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: saving || !form.title ? 0.5 : 1 }}>
                                {saving ? 'Menyimpan...' : '✓ Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#525252', fontSize: 12 }}>Memuat...</div>
            ) : entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', color: '#525252' }}>Belum ada cerita.</p>
                    <button onClick={startNew} style={{ marginTop: 16, background: 'none', border: '1px solid rgba(206,177,117,0.3)', color: '#CEB175', borderRadius: 20, padding: '8px 20px', cursor: 'pointer', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase' }}>+ Cerita Pertama</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {entries.map(entry => (
                        <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8 }}>
                            {/* Cover thumb */}
                            <div style={{ width: 60, height: 40, borderRadius: 4, background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                                {entry.cover_image && <img src={entry.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />}
                            </div>
                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#FAFAFA', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 300 }}>{entry.title}</p>
                                <p style={{ fontSize: 9, color: '#525252', margin: '3px 0 0', letterSpacing: '0.3em', textTransform: 'uppercase' }}>/{entry.slug} · {entry.aesthetic_tag || '—'} · {entry.season || '—'}</p>
                            </div>
                            {/* Published badge */}
                            <span style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: entry.is_published ? '#7CAE7A' : '#525252', flexShrink: 0 }}>
                                {entry.is_published ? 'Published' : 'Draft'}
                            </span>
                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button onClick={() => togglePublish(entry)} title={entry.is_published ? 'Jadikan Draft' : 'Terbitkan'}
                                    style={{ background: 'none', border: 'none', color: entry.is_published ? '#CEB175' : '#525252', cursor: 'pointer', padding: 6 }}>
                                    {entry.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                                </button>
                                <button onClick={() => startEdit(entry)} style={{ background: 'none', border: 'none', color: '#525252', cursor: 'pointer', padding: 6 }}>
                                    <Edit2 size={15} />
                                </button>
                                <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}
                                    style={{ background: 'none', border: 'none', color: '#525252', cursor: 'pointer', padding: 6, opacity: deleting === entry.id ? 0.4 : 1 }}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
