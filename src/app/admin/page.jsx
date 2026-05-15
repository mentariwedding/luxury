"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  ImageIcon,
  FileText,
  MessageCircle,
  Quote,
  MapPin,
  BookOpen,
  Inbox,
  CheckCircle2,
  Clock,
  TrendingUp,
  Layers,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── helpers ──────────────────────────────────────────── */
const timeAgo = (date) => {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j`;
  return `${Math.floor(hrs / 24)}h`;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 19) return "Selamat Sore";
  return "Selamat Malam";
};

const nowLabel = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const STATUS_STYLE = {
  new: {
    dot: "bg-[#CEB175]",
    badge: "text-[#CEB175] bg-[#CEB175]/10",
    label: "Baru",
  },
  contacted: {
    dot: "bg-sky-400",
    badge: "text-sky-400 bg-sky-400/10",
    label: "Dihubungi",
  },
  booked: {
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10",
    label: "Booked",
  },
  declined: {
    dot: "bg-red-400/70",
    badge: "text-red-400/70 bg-red-400/10",
    label: "Ditolak",
  },
};

/* ─── animation variants ──────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    photos: 0,
    testimonials: 0,
    venues: 0,
    inquiries: 0,
    journal: 0,
  });
  const [slots, setSlots] = useState({
    remaining: 3,
    year: new Date().getFullYear(),
  });
  const [newInqs, setNewInqs] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, t, v, iq, j, recentInqs, photos, sections, slotsData] =
        await Promise.all([
          supabase
            .from("portfolio_gallery")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("testimonials")
            .select("*", { count: "exact", head: true }),
          supabase.from("venues").select("*", { count: "exact", head: true }),
          supabase
            .from("inquiry_submissions")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("journal_entries")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("inquiry_submissions")
            .select("id, initials, aesthetic, status, created_at")
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("portfolio_gallery")
            .select("id, title, category, image_url, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("section_content")
            .select("section_name, updated_at")
            .order("updated_at", { ascending: false })
            .limit(5),
          supabase
            .from("site_settings")
            .select("key, value")
            .in("key", ["slots_remaining", "slots_year"]),
        ]);

      setStats({
        photos: p.count || 0,
        testimonials: t.count || 0,
        venues: v.count || 0,
        inquiries: iq.count || 0,
        journal: j.count || 0,
      });
      setNewInqs(recentInqs.data || []);
      setRecentPhotos(photos.data || []);
      setRecentUpdates(sections.data || []);

      if (slotsData.data?.length) {
        const m = Object.fromEntries(
          slotsData.data.map((d) => [d.key, d.value]),
        );
        setSlots({
          remaining: parseInt(m.slots_remaining) || 3,
          year: parseInt(m.slots_year) || new Date().getFullYear(),
        });
      }
      setLoading(false);
    })();
  }, []);

  const newCount = newInqs.filter((i) => i.status === "new").length;
  const SECTION_LABELS = {
    hero: "Hero",
    signature: "Signature",
    approach: "Pendekatan",
    philosophy: "Filosofi",
    atelier: "Atelier",
    venues: "Venues",
    manifesto: "Manifesto",
    moodboard: "Mood Board",
    testimonial: "Testimonial",
    partners: "Vendor & Mitra",
    video_reel: "Highlight Reel",
    packages: "Packages",
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ══ HERO GREETING BANNER ══════════════════════════════ */}
      <motion.div
        {...fadeUp(0)}
        className="relative overflow-hidden border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent p-6 md:p-8"
      >
        {/* Ghost brand watermark */}
        <span className="absolute right-0 bottom-0 font-serif italic text-[80px] md:text-[120px] leading-none text-white/[0.025] select-none pointer-events-none pr-4 pb-2 tracking-tight">
          Mentari
        </span>

        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#CEB175]/60 via-[#CEB175]/20 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[8px] uppercase tracking-[0.6em] text-white/25 mb-3 font-light">
              {nowLabel()}
            </p>
            <h1
              className="font-serif font-light text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}
            >
              {greeting()},<br />
              <span className="italic gold-gradient-text">Admin Suite.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {newCount > 0 && (
                <Link
                  href="/admin/inquiries"
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#CEB175]/10 border border-[#CEB175]/30 text-[#CEB175] hover:bg-[#CEB175]/20 transition-all duration-300 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CEB175] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.4em] font-light">
                    {newCount} inquiry baru
                  </span>
                  <ArrowUpRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              )}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-white/20 hover:text-white/50 transition-colors duration-300"
              >
                <Globe className="w-3 h-3" />
                Lihat Website
              </a>
            </div>
          </div>

          {/* Slots remaining widget */}
          <div className="flex-shrink-0 border border-[#CEB175]/15 px-5 py-4 hidden sm:block">
            <p className="text-[7px] uppercase tracking-[0.5em] text-white/20 mb-3">
              Slot {slots.year}
            </p>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-all duration-300 ${
                    i < 12 - slots.remaining
                      ? "w-2 h-2 bg-white/[0.06]"
                      : "w-2.5 h-2.5 bg-[#CEB175]"
                  }`}
                />
              ))}
            </div>
            <p className="text-[8px] text-white/40">
              <span className="font-serif italic text-[#CEB175] text-sm">
                {slots.remaining}
              </span>{" "}
              <span className="text-white/20">tersisa</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══ STAT STRIP ════════════════════════════════════════ */}
      <motion.div
        {...fadeUp(0.07)}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/[0.04]"
      >
        {[
          {
            label: "Inquiries",
            value: stats.inquiries,
            href: "/admin/inquiries",
            icon: Inbox,
            gold: true,
          },
          {
            label: "Foto",
            value: stats.photos,
            href: "/admin/gallery",
            icon: ImageIcon,
            gold: false,
          },
          {
            label: "Kisah",
            value: stats.journal,
            href: "/admin/journal",
            icon: BookOpen,
            gold: false,
          },
          {
            label: "Testimonial",
            value: stats.testimonials,
            href: "/admin/testimonials",
            icon: Quote,
            gold: false,
          },
          {
            label: "Venues",
            value: stats.venues,
            href: "/admin/venues",
            icon: MapPin,
            gold: false,
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`group flex flex-col justify-between p-4 md:p-5 transition-all duration-400 ${
                s.gold
                  ? "bg-[#CEB175]/[0.04] hover:bg-[#CEB175]/[0.08]"
                  : "bg-[#040404] hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon
                  className={`w-3.5 h-3.5 ${s.gold ? "text-[#CEB175]/70" : "text-white/15"}`}
                  strokeWidth={1.5}
                />
                <ArrowUpRight className="w-3 h-3 text-white/0 group-hover:text-[#CEB175]/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
              <div>
                <p
                  className={`font-serif font-light leading-none mb-1.5 tabular-nums ${s.gold ? "text-[#CEB175]" : "text-white/70"}`}
                  style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
                >
                  {loading ? (
                    <span className="inline-block w-10 h-7 bg-white/[0.04] animate-pulse align-bottom rounded-sm" />
                  ) : (
                    s.value
                  )}
                </p>
                <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-light">
                  {s.label}
                </p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* ══ MAIN GRID ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Recent Inquiries ─────────────────────────── */}
        <motion.div
          {...fadeUp(0.12)}
          className="lg:col-span-7 border border-white/[0.05] bg-white/[0.01]"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#CEB175]/50" />
              <p className="text-[8px] uppercase tracking-[0.5em] text-white/40">
                Inquiry Terbaru
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors flex items-center gap-1"
            >
              Semua <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3.5 animate-pulse"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/[0.06]" />
                  <div className="flex-1 h-3 bg-white/[0.04] rounded-sm" />
                  <div className="w-12 h-3 bg-white/[0.03] rounded-sm" />
                </div>
              ))
            ) : newInqs.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Inbox className="w-6 h-6 text-white/10 mx-auto mb-2" />
                <p className="text-[9px] text-white/20 italic">
                  Belum ada inquiry
                </p>
              </div>
            ) : (
              newInqs.map((inq, i) => {
                const s = STATUS_STYLE[inq.status] || STATUS_STYLE.new;
                return (
                  <motion.div
                    key={inq.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.15 + i * 0.05,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-3.5 px-5 py-3.5 group hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-white/70 font-serif italic font-light truncate">
                          {inq.initials || "—"}
                        </span>
                        {inq.aesthetic && (
                          <span className="text-[7px] uppercase tracking-[0.3em] text-white/20 font-light truncate hidden sm:block">
                            {inq.aesthetic}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span
                        className={`text-[7px] uppercase tracking-[0.3em] px-2 py-0.5 rounded-sm font-light ${s.badge}`}
                      >
                        {s.label}
                      </span>
                      <span className="text-[8px] text-white/20">
                        {timeAgo(inq.created_at)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ── Right Column ─────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Quick Actions */}
          <motion.div {...fadeUp(0.16)} className="border border-white/[0.05]">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
              <TrendingUp className="w-3.5 h-3.5 text-[#CEB175]/50" />
              <p className="text-[8px] uppercase tracking-[0.5em] text-white/40">
                Akses Cepat
              </p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                {
                  label: "Tambah Foto Editorial",
                  href: "/admin/gallery",
                  icon: ImageIcon,
                },
                {
                  label: "Tulis Kisah Baru",
                  href: "/admin/journal",
                  icon: BookOpen,
                },
                {
                  label: "Review Inquiries",
                  href: "/admin/inquiries",
                  icon: Inbox,
                },
                {
                  label: "Edit Konten",
                  href: "/admin/content",
                  icon: FileText,
                },
                {
                  label: "Kelola Testimonial",
                  href: "/admin/testimonials",
                  icon: Quote,
                },
                {
                  label: "Atur Packages",
                  href: "/admin/packages",
                  icon: Layers,
                },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-3 px-5 py-3 group hover:bg-[#CEB175]/[0.03] transition-all duration-300"
                  >
                    <Icon
                      className="w-3 h-3 text-white/15 group-hover:text-[#CEB175]/60 transition-colors duration-300 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-white/30 group-hover:text-white/60 transition-colors duration-300 font-light flex-1">
                      {a.label}
                    </span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-white/0 group-hover:text-[#CEB175]/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Photos strip */}
          <motion.div {...fadeUp(0.2)} className="border border-white/[0.05]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#CEB175]/50" />
                <p className="text-[8px] uppercase tracking-[0.5em] text-white/40">
                  Upload Terbaru
                </p>
              </div>
              <Link
                href="/admin/gallery"
                className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors"
              >
                Galeri →
              </Link>
            </div>
            <div className="p-3 flex gap-2">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 aspect-square bg-white/[0.03] animate-pulse rounded-sm"
                  />
                ))
              ) : recentPhotos.length === 0 ? (
                <p className="text-[9px] text-white/20 italic px-2 py-2">
                  Belum ada foto
                </p>
              ) : (
                recentPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex-1 aspect-square overflow-hidden relative group"
                  >
                    {photo.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[7px] text-white/70 font-light truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {photo.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ CONTENT UPDATES TIMELINE ═══════════════════════ */}
      <motion.div {...fadeUp(0.24)} className="border border-white/[0.05]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-3.5 h-3.5 text-[#CEB175]/50" />
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/40">
              Update Konten
            </p>
          </div>
          <Link
            href="/admin/content"
            className="text-[7px] uppercase tracking-[0.4em] text-white/15 hover:text-[#CEB175]/60 transition-colors"
          >
            Editor →
          </Link>
        </div>
        <div
          className="flex overflow-x-auto scrollbar-none divide-x divide-white/[0.04]"
          style={{ scrollbarWidth: "none" }}
        >
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 p-4 animate-pulse space-y-2"
              >
                <div className="h-2 bg-white/[0.04] rounded-sm w-3/4" />
                <div className="h-2 bg-white/[0.03] rounded-sm w-1/2" />
              </div>
            ))
          ) : recentUpdates.length === 0 ? (
            <p className="text-[9px] text-white/20 italic p-4">
              Belum ada update
            </p>
          ) : (
            recentUpdates.map((sec, i) => (
              <Link
                key={sec.section_name}
                href="/admin/content"
                className="group flex-shrink-0 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-300 min-w-[140px]"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/50 flex-shrink-0" />
                  <span className="text-[8px] uppercase tracking-[0.35em] text-white/50 font-light truncate group-hover:text-white/70 transition-colors">
                    {SECTION_LABELS[sec.section_name] || sec.section_name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/20">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="text-[8px]">{timeAgo(sec.updated_at)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>

      {/* ══ SYSTEM STATUS ════════════════════════════════════ */}
      <motion.div
        {...fadeUp(0.28)}
        className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border border-white/[0.04] bg-white/[0.01]"
      >
        <div className="flex flex-wrap items-center gap-5">
          {["Database", "Storage", "Auth"].map((sys) => (
            <div key={sys} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-light">
                {sys}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[7px] uppercase tracking-[0.5em] text-white/10 font-serif italic">
          Planned to Perfection
        </p>
      </motion.div>
    </div>
  );
}
