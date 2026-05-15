"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Eye, EyeOff, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmModal";

const EMPTY = {
  title: "",
  slug: "",
  tagline: "",
  content: "",
  cover_image: "",
  aesthetic_tag: "",
  venue_hint: "",
  season: "",
  is_published: false,
  display_order: 0,
};

const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

/* ── Underline Input ── */
function Field({ label, children }) {
  return (
    <div className="border-b border-white/[0.08] focus-within:border-[#CEB175]/40 transition-colors duration-300 pb-2">
      <label className="text-[7px] uppercase tracking-[0.5em] text-white/20 block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
const inputCls =
  "w-full bg-transparent text-white/80 text-[13px] font-light outline-none placeholder:text-white/10";
const areaCls = `${inputCls} resize-none leading-[1.8] min-h-[160px]`;

export default function JournalAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("display_order", { ascending: true });
    setEntries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const startNew = () => {
    setForm(EMPTY);
    setEditing("new");
    setGalleryImages([]);
  };
  const startEdit = (e) => {
    setForm({ ...e });
    setEditing(e);
    // Fetch gallery images for this entry
    setGalleryLoading(true);
    supabase
      .from("journal_images")
      .select("*")
      .eq("journal_entry_id", e.id)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setGalleryImages(data || []);
        setGalleryLoading(false);
      });
  };
  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const handleForm = (k, v) =>
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "title" && (!prev.slug || prev.slug === slugify(prev.title)))
        next.slug = slugify(v);
      return next;
    });

  const handleSave = async () => {
    if (!form.title || !form.slug) return;
    setSaving(true);
    if (editing === "new") {
      const { error } = await supabase
        .from("journal_entries")
        .insert([{ ...form }]);
      if (error) {
        toast("Gagal menyimpan: " + error.message, "error");
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("journal_entries")
        .update({ ...form })
        .eq("id", editing.id);
      if (error) {
        toast("Gagal memperbarui: " + error.message, "error");
        setSaving(false);
        return;
      }
    }
    toast(
      editing === "new" ? "Cerita baru diterbitkan." : "Cerita diperbarui.",
      "success",
    );
    setSaving(false);
    cancel();
    fetch();
  };

  const togglePublish = async (entry) => {
    await supabase
      .from("journal_entries")
      .update({ is_published: !entry.is_published })
      .eq("id", entry.id);
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, is_published: !e.is_published } : e,
      ),
    );
  };

  const handleDelete = async (id) => {
    const ok = await confirm(
      "Hapus Cerita",
      "Cerita ini akan dihapus permanen. Tindakan tidak bisa dibatalkan.",
    );
    if (!ok) return;
    setDeleting(id);
    await supabase.from("journal_entries").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
    toast("Cerita dihapus.", "success");
  };

  const addGalleryImage = async () => {
    if (!newImageUrl.trim() || editing === "new") return;
    const { data, error } = await supabase
      .from("journal_images")
      .insert([
        {
          journal_entry_id: editing.id,
          image_url: newImageUrl.trim(),
          caption: newImageCaption.trim(),
          display_order: galleryImages.length,
        },
      ])
      .select();
    if (!error && data) {
      setGalleryImages((p) => [...p, data[0]]);
      setNewImageUrl("");
      setNewImageCaption("");
      toast("Foto ditambahkan.", "success");
    }
  };

  const removeGalleryImage = async (imgId) => {
    await supabase.from("journal_images").delete().eq("id", imgId);
    setGalleryImages((p) => p.filter((img) => img.id !== imgId));
    toast("Foto dihapus.", "success");
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">
          Editor
        </p>
        <h1
          className="font-serif font-light leading-[0.9] mb-8"
          style={{ fontSize: "clamp(42px, 6vw, 80px)" }}
        >
          Kisah
        </h1>
        <div className="flex items-center gap-6">
          <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
          <button
            onClick={fetch}
            className="text-white/15 hover:text-white/40 transition-colors duration-300"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={startNew}
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/25 px-5 py-2.5 hover:bg-[#CEB175]/5 transition-all duration-500"
          >
            <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
            Cerita Baru
          </button>
        </div>
      </motion.div>

      {/* ── Entry List ── */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white/[0.05]">
          <p className="font-serif italic text-white/20 text-2xl mb-6">
            Belum ada cerita.
          </p>
          <button
            onClick={startNew}
            className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/50 hover:text-[#CEB175] transition-colors duration-300"
          >
            + Cerita Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-px">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex items-center gap-4 p-4 sm:p-5 border border-white/[0.04] hover:border-[#CEB175]/15 transition-colors duration-500"
            >
              {/* Cover thumb */}
              <div className="w-14 h-10 bg-white/[0.03] border border-white/[0.05] overflow-hidden flex-shrink-0">
                {entry.cover_image && (
                  <img
                    src={entry.cover_image}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-serif italic text-white/80 text-base font-light truncate">
                  {entry.title}
                </p>
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 mt-1">
                  /{entry.slug} · {entry.aesthetic_tag || "—"} ·{" "}
                  {entry.season || "—"}
                </p>
              </div>

              {/* Status */}
              <span
                className={`text-[7px] uppercase tracking-[0.4em] flex-shrink-0 ${
                  entry.is_published ? "text-emerald-400/60" : "text-white/15"
                }`}
              >
                {entry.is_published ? "Live" : "Draft"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => togglePublish(entry)}
                  title={entry.is_published ? "Jadikan Draft" : "Terbitkan"}
                  className={`p-1.5 transition-colors duration-300 ${entry.is_published ? "text-[#CEB175]/60 hover:text-[#CEB175]" : "text-white/15 hover:text-white/50"}`}
                >
                  {entry.is_published ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(entry)}
                  className="p-1.5 text-white/15 hover:text-white/50 transition-colors duration-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleting === entry.id}
                  className="p-1.5 text-white/15 hover:text-red-400/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Editor Modal ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 sm:p-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-[#CEB175]/15 p-8 sm:p-10 relative my-auto"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {/* Close */}
              <button
                onClick={cancel}
                className="absolute top-5 right-5 text-white/20 hover:text-white/60 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-3">
                {editing === "new" ? "Cerita Baru" : "Edit Cerita"}
              </p>
              <h2
                className="font-serif font-light text-white/90 mb-8"
                style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
              >
                {editing === "new"
                  ? "Tulis Cerita Baru"
                  : form.title?.slice(0, 40) || "Edit"}
              </h2>

              {/* Form Fields */}
              <div className="space-y-6">
                <Field label="Judul *">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => handleForm("title", e.target.value)}
                    placeholder="Sebuah Sabtu di Lereng Gunung"
                  />
                </Field>

                <Field label="Slug (URL) *">
                  <input
                    className={`${inputCls} text-[#CEB175]/70 font-mono text-xs`}
                    value={form.slug}
                    onChange={(e) => handleForm("slug", e.target.value)}
                    placeholder="sabtu-di-lereng-gunung"
                  />
                </Field>

                <Field label="Tagline">
                  <input
                    className={inputCls}
                    value={form.tagline}
                    onChange={(e) => handleForm("tagline", e.target.value)}
                    placeholder="Ketika kabut turun tepat saat ijab kabul..."
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Field label="Estetika">
                    <input
                      className={inputCls}
                      value={form.aesthetic_tag}
                      onChange={(e) =>
                        handleForm("aesthetic_tag", e.target.value)
                      }
                      placeholder="Natural / Romantic"
                    />
                  </Field>
                  <Field label="Venue (cryptic)">
                    <input
                      className={inputCls}
                      value={form.venue_hint}
                      onChange={(e) => handleForm("venue_hint", e.target.value)}
                      placeholder="Lereng Gunung, Sukabumi"
                    />
                  </Field>
                  <Field label="Musim / Waktu">
                    <input
                      className={inputCls}
                      value={form.season}
                      onChange={(e) => handleForm("season", e.target.value)}
                      placeholder="Musim Hujan 2024"
                    />
                  </Field>
                </div>

                <Field label="URL Gambar Cover">
                  <input
                    className={inputCls}
                    value={form.cover_image}
                    onChange={(e) => handleForm("cover_image", e.target.value)}
                    placeholder="https://... atau /images/foto.jpg"
                  />
                </Field>

                <Field label="Urutan Tampil">
                  <input
                    className={inputCls}
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      handleForm("display_order", parseInt(e.target.value) || 0)
                    }
                  />
                </Field>

                <Field label="Isi Cerita (paragraf dipisah baris kosong)">
                  <textarea
                    className={areaCls}
                    value={form.content}
                    onChange={(e) => handleForm("content", e.target.value)}
                    placeholder={
                      "Ada pagi-pagi yang terasa berbeda...\n\nParagraf kedua..."
                    }
                  />
                </Field>

                {/* Gallery Images — only for existing entries */}
                {editing !== "new" && (
                  <div className="pt-2">
                    <p className="text-[7px] uppercase tracking-[0.5em] text-[#CEB175]/50 mb-4">
                      Galeri Foto Cerita
                    </p>

                    {/* Existing images */}
                    {galleryLoading ? (
                      <div className="flex gap-2 mb-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 bg-white/[0.02] animate-pulse"
                          />
                        ))}
                      </div>
                    ) : galleryImages.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {galleryImages.map((img) => (
                          <div
                            key={img.id}
                            className="group relative w-16 h-16 overflow-hidden border border-white/[0.06]"
                          >
                            <img
                              src={img.image_url}
                              alt={img.caption || ""}
                              className="w-full h-full object-cover opacity-70"
                            />
                            <button
                              onClick={() => removeGalleryImage(img.id)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[8px] text-white/15 italic mb-4 font-serif">
                        Belum ada foto di galeri cerita ini.
                      </p>
                    )}

                    {/* Add new image */}
                    <div className="space-y-3 border-t border-white/[0.04] pt-4">
                      <div className="border-b border-white/[0.06] pb-2 focus-within:border-[#CEB175]/30 transition-colors">
                        <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 mb-1.5">
                          URL Foto Baru
                        </p>
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://... atau /images/foto.jpg"
                          className="w-full bg-transparent text-white/70 text-[12px] focus:outline-none placeholder:text-white/10"
                        />
                      </div>
                      <div className="border-b border-white/[0.06] pb-2 focus-within:border-[#CEB175]/30 transition-colors">
                        <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 mb-1.5">
                          Caption (opsional)
                        </p>
                        <input
                          type="text"
                          value={newImageCaption}
                          onChange={(e) => setNewImageCaption(e.target.value)}
                          placeholder="Keterangan foto..."
                          className="w-full bg-transparent text-white/60 text-[12px] focus:outline-none placeholder:text-white/10"
                        />
                      </div>
                      <button
                        onClick={addGalleryImage}
                        disabled={!newImageUrl.trim()}
                        className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/60 hover:text-[#CEB175] disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Tambah Foto
                      </button>
                    </div>
                  </div>
                )}

                {/* Publish toggle */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleForm("is_published", !form.is_published)
                    }
                    className={`relative w-9 h-5 border transition-all duration-400 ${
                      form.is_published
                        ? "bg-[#CEB175]/20 border-[#CEB175]/40"
                        : "bg-white/[0.03] border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] w-3 h-3 transition-all duration-300 ${
                        form.is_published
                          ? "left-[18px] bg-[#CEB175]"
                          : "left-[3px] bg-white/20"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-[8px] uppercase tracking-[0.4em] ${
                      form.is_published ? "text-[#CEB175]" : "text-white/20"
                    }`}
                  >
                    {form.is_published ? "Diterbitkan" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={cancel}
                  className="text-[8px] uppercase tracking-[0.5em] text-white/20 hover:text-white/50 transition-colors duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.slug}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#CEB175] text-black text-[8px] uppercase tracking-[0.4em] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D4C090] transition-all duration-400"
                >
                  {saving ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : null}
                  {saving ? "Menyimpan..." : "Simpan Cerita"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
