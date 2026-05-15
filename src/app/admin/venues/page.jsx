"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, RefreshCw, Eye, EyeOff, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmModal";
import MinimalistTooltip from "@/components/MinimalistTooltip";

export default function VenuesAdmin() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const toast = useToast();
  const confirm = useConfirm();

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("venues")
      .select("*")
      .order("display_order", { ascending: true });
    setVenues(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("venues")
      .insert([
        {
          name: "A New Venue",
          cryptic_caption: "A poetic caption.",
          location_hint: "A private location.",
          image_url: "/images/hero.JPG",
          display_order: venues.length,
          is_active: true,
        },
      ])
      .select();
    if (error) {
      toast("Gagal menambah: " + error.message, "error");
      return;
    }
    setVenues((p) => [...p, data[0]]);
    toast("Venue baru ditambahkan.", "success");
  };

  const handleField = async (id, field, value) => {
    setSaving((p) => ({ ...p, [id]: true }));
    await supabase
      .from("venues")
      .update({ [field]: value })
      .eq("id", id);
    setVenues((p) =>
      p.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
    setSaving((p) => ({ ...p, [id]: false }));
  };

  const handleDelete = async (id) => {
    const ok = await confirm(
      "Hapus Venue",
      "Venue ini akan dihapus permanen. Lanjutkan?",
    );
    if (!ok) return;
    await supabase.from("venues").delete().eq("id", id);
    setVenues((p) => p.filter((v) => v.id !== id));
    toast("Venue dihapus.", "success");
  };

  const moveItem = async (id, direction) => {
    const idx = venues.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= venues.length) return;
    const reordered = [...venues];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    await Promise.all([
      supabase
        .from("venues")
        .update({ display_order: idx })
        .eq("id", reordered[idx].id),
      supabase
        .from("venues")
        .update({ display_order: newIdx })
        .eq("id", reordered[newIdx].id),
    ]);
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
        <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-5">
          Editor
        </p>
        <h1
          className="font-serif font-light leading-[0.9] mb-8"
          style={{ fontSize: "clamp(42px, 6vw, 80px)" }}
        >
          Venues
        </h1>
        <div className="flex items-center gap-6 mb-2">
          <div className="h-px bg-gradient-to-r from-[#CEB175]/30 to-transparent w-16" />
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 italic font-serif">
            Curated locations dengan caption puitis & cryptic
          </p>
        </div>
      </motion.div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
          {loading
            ? "— memuat —"
            : `${venues.length} Venue${venues.length !== 1 ? "s" : ""}`}
        </p>
        <MinimalistTooltip text="Tambah venue baru">
          <button
            onClick={handleAdd}
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-6 py-3 hover:bg-[#CEB175] hover:text-black transition-all duration-500"
          >
            <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
            Tambah Venue
          </button>
        </MinimalistTooltip>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-white/[0.02]" />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white/[0.05]">
          <p className="font-serif italic text-2xl text-white/30 mb-4">
            Belum ada venue.
          </p>
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">
            Klik "Tambah Venue" untuk memulai
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {venues.map((v, idx) => (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group border border-white/[0.05] hover:border-[#CEB175]/15 p-6 md:p-8 transition-colors duration-500 bg-white/[0.01]"
              >
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_auto] gap-6 items-start">
                  {/* Thumb */}
                  <div className="relative w-24 h-24 md:w-24 md:h-32 overflow-hidden border border-white/[0.06] bg-[#0A0A0A]">
                    {v.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="absolute top-1 left-1 text-[8px] uppercase tracking-[0.3em] text-[#CEB175]/80 bg-black/60 px-1.5 py-0.5 rounded">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                      <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                        Nama Venue
                      </p>
                      <input
                        type="text"
                        defaultValue={v.name || ""}
                        onBlur={(e) =>
                          handleField(v.id, "name", e.target.value)
                        }
                        placeholder="The Cliff Pavilion"
                        className="w-full bg-transparent text-base md:text-lg text-white font-serif italic focus:outline-none placeholder:text-white/10"
                      />
                    </div>

                    {/* Cryptic caption */}
                    <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                      <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                        Cryptic Caption
                      </p>
                      <textarea
                        rows={2}
                        defaultValue={v.cryptic_caption || ""}
                        onBlur={(e) =>
                          handleField(v.id, "cryptic_caption", e.target.value)
                        }
                        placeholder="Where the ocean answers your vows..."
                        className="w-full bg-transparent text-sm text-white/90 font-serif italic leading-relaxed resize-none focus:outline-none placeholder:text-white/10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Location hint */}
                      <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                        <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                          Location Hint
                        </p>
                        <input
                          type="text"
                          defaultValue={v.location_hint || ""}
                          onBlur={(e) =>
                            handleField(v.id, "location_hint", e.target.value)
                          }
                          placeholder="A private estate."
                          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                        <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                          URL Gambar
                        </p>
                        <input
                          type="text"
                          defaultValue={v.image_url || ""}
                          onBlur={(e) =>
                            handleField(v.id, "image_url", e.target.value)
                          }
                          placeholder="/images/..."
                          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10"
                        />
                      </div>
                    </div>

                    {/* Map Coordinates */}
                    <div className="border-b border-white/[0.05] pb-3 focus-within:border-[#CEB175]/25 transition-colors">
                      <p className="text-[7px] uppercase tracking-[0.4em] text-white/25 mb-2">
                        Koordinat Peta{" "}
                        <span className="normal-case tracking-normal text-white/10">
                          (lat, lng)
                        </span>
                      </p>
                      <input
                        type="text"
                        defaultValue={v.map_coordinates || ""}
                        onBlur={(e) =>
                          handleField(
                            v.id,
                            "map_coordinates",
                            e.target.value || null,
                          )
                        }
                        placeholder="-6.9177, 107.6191"
                        className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/10 font-mono"
                      />
                      <p className="text-[7px] text-white/10 mt-1">
                        Format: lat, lng · Digunakan untuk link Google Maps
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <button
                        onClick={() =>
                          handleField(v.id, "is_active", !v.is_active)
                        }
                        className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] transition-colors ${
                          v.is_active ? "text-[#CEB175]" : "text-white/20"
                        }`}
                      >
                        {v.is_active ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {v.is_active ? "Tampil" : "Disembunyikan"}
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItem(v.id, "up")}
                          disabled={idx === 0}
                          className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1"
                        >
                          ▲ Up
                        </button>
                        <button
                          onClick={() => moveItem(v.id, "down")}
                          disabled={idx === venues.length - 1}
                          className="text-white/15 hover:text-[#CEB175] disabled:opacity-20 transition-colors text-[10px] px-2 py-1"
                        >
                          Down ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col gap-3 items-end pt-2">
                    {saving[v.id] && (
                      <RefreshCw className="w-3 h-3 text-[#CEB175] animate-spin" />
                    )}
                    <MinimalistTooltip text="Hapus venue">
                      <button
                        onClick={() => handleDelete(v.id)}
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
