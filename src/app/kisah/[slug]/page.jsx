"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import GoldSkeleton from "@/components/GoldSkeleton";
import Reveal from "@/components/Reveal";
import Lightbox from "@/components/Lightbox";

export default function KisahDetailPage() {
  const { slug } = useParams();
  const [entry, setEntry] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (data) {
        setEntry(data);
        // Fetch gallery images
        const { data: imgs } = await supabase
          .from("journal_images")
          .select("*")
          .eq("journal_entry_id", data.id)
          .order("display_order", { ascending: true });
        if (imgs && imgs.length > 0) setGallery(imgs);

        // Fetch related stories
        const { data: rel } = await supabase
          .from("journal_entries")
          .select(
            "id, slug, title, tagline, aesthetic_tag, cover_image, season",
          )
          .eq("is_published", true)
          .neq("slug", slug)
          .order("display_order", { ascending: true })
          .limit(2);
        if (rel && rel.length > 0) setRelated(rel);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  return (
    <div
      className="min-h-screen bg-[#050505]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <main>
        {/* Loading */}
        {loading && (
          <div
            className="max-w-[800px] mx-auto px-6 md:px-12 space-y-6"
            style={{
              paddingTop: "clamp(100px, 14vh, 140px)",
              paddingBottom: "clamp(80px, 12vh, 140px)",
            }}
          >
            <GoldSkeleton className="w-1/4 h-3" />
            <GoldSkeleton className="w-full h-12" />
            <GoldSkeleton className="w-3/4 h-8" />
            <GoldSkeleton className="w-full aspect-[16/9]" rounded="md" />
            {[...Array(5)].map((_, i) => (
              <GoldSkeleton
                key={i}
                className={`w-${["full", "5/6", "full", "4/5", "full"][i]} h-4`}
              />
            ))}
          </div>
        )}

        {/* Not found */}
        {notFound && !loading && (
          <div className="text-center py-32 px-6">
            <p className="font-serif italic text-white/30 text-3xl mb-4">
              Kisah ini tidak ditemukan.
            </p>
            <Link
              href="/kisah"
              className="text-[9px] uppercase tracking-[0.5em] text-[#CEB175]/60 hover:text-[#CEB175] transition-colors"
            >
              ← Kembali ke Semua Kisah
            </Link>
          </div>
        )}

        {/* Article */}
        {entry && !loading && (
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Hero ── */}
            <div
              className="relative overflow-hidden bg-[#030303]"
              style={{ height: "clamp(360px, 60vh, 680px)" }}
            >
              {entry.cover_image ? (
                <img
                  src={entry.cover_image}
                  alt={entry.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[#0A0A0A]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />

              {/* Meta overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-16"
                style={{ paddingTop: "clamp(100px, 14vh, 140px)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.0,
                    delay: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {entry.aesthetic_tag && (
                      <span className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-3 py-1 font-light">
                        {entry.aesthetic_tag}
                      </span>
                    )}
                    {entry.season && (
                      <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-light">
                        {entry.season}
                      </span>
                    )}
                    {entry.venue_hint && (
                      <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-light">
                        {entry.venue_hint}
                      </span>
                    )}
                  </div>
                  <h1
                    className="font-serif font-light text-white leading-[1.1]"
                    style={{
                      fontSize: "clamp(28px, 5vw, 64px)",
                      maxWidth: "700px",
                    }}
                  >
                    {entry.title}
                  </h1>
                </motion.div>
              </div>
            </div>

            {/* ── Content area ── */}
            <div
              className="max-w-[780px] mx-auto px-6 md:px-12"
              style={{
                paddingTop: "clamp(48px, 8vh, 80px)",
                paddingBottom: "clamp(80px, 12vh, 140px)",
              }}
            >
              {/* Gold divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ originX: 0 }}
                className="h-px bg-gradient-to-r from-[#CEB175]/50 to-transparent w-20 mb-12"
              />

              {/* Tagline as pull quote */}
              {entry.tagline && (
                <Reveal>
                  <blockquote className="mb-14 border-l-2 border-[#CEB175]/30 pl-8">
                    <p
                      className="font-serif italic text-[#CEB175]/80 leading-relaxed"
                      style={{ fontSize: "clamp(18px, 2.5vw, 26px)" }}
                    >
                      &ldquo;{entry.tagline}&rdquo;
                    </p>
                  </blockquote>
                </Reveal>
              )}

              {/* Body paragraphs */}
              <Reveal delay={100}>
                <div
                  className="space-y-7 font-serif font-light text-[#A3A3A3] leading-[1.9]"
                  style={{ fontSize: "clamp(15px, 1.8vw, 18px)" }}
                >
                  {(entry.content || "")
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, i) => {
                      // Every ~3rd paragraph, show an elegant separator
                      const showMark = i > 0 && i % 4 === 0;
                      return (
                        <div key={i}>
                          {showMark && (
                            <div className="flex items-center justify-center gap-4 my-10">
                              <span className="w-8 h-px bg-[#CEB175]/20" />
                              <span className="text-[#CEB175]/30 text-xs">
                                ✦
                              </span>
                              <span className="w-8 h-px bg-[#CEB175]/20" />
                            </div>
                          )}
                          <p>{para}</p>
                        </div>
                      );
                    })}
                </div>
              </Reveal>

              {/* Gallery Grid */}
              {gallery.length > 0 && (
                <Reveal delay={200}>
                  <div className="mt-16 md:mt-20">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="w-6 h-px bg-[#CEB175]/40" />
                      <p className="text-[8px] uppercase tracking-[0.5em] text-[#CEB175]/50 font-light">
                        Gallery
                      </p>
                    </div>
                    <div
                      className={`grid gap-2 md:gap-3 ${
                        gallery.length === 1
                          ? "grid-cols-1"
                          : gallery.length === 2
                            ? "grid-cols-2"
                            : gallery.length >= 3
                              ? "grid-cols-2 md:grid-cols-3"
                              : ""
                      }`}
                    >
                      {gallery.map((img, i) => (
                        <motion.div
                          key={img.id || i}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={`group relative overflow-hidden cursor-pointer border border-[#CEB175]/8 bg-[#0A0A0A] ${
                            gallery.length >= 3 && i === 0
                              ? "col-span-2 md:col-span-1 aspect-[4/3]"
                              : "aspect-[4/3]"
                          }`}
                          onClick={() => {
                            setLightboxIndex(i);
                            setLightboxOpen(true);
                          }}
                        >
                          <img
                            src={img.image_url}
                            alt={img.caption || `Gallery ${i + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[1000ms]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          {img.caption && (
                            <p className="absolute bottom-3 left-3 right-3 font-serif italic text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              {img.caption}
                            </p>
                          )}
                          <div className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-0 right-0 w-full h-px bg-[#CEB175]/60" />
                            <div className="absolute top-0 right-0 w-px h-full bg-[#CEB175]/60" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Closing divider */}
              <div className="flex items-center justify-center gap-4 my-16">
                <span className="w-12 h-px bg-[#CEB175]/15" />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#CEB175]/25"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="22"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="12"
                    x2="5"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="12"
                    x2="22"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="w-12 h-px bg-[#CEB175]/15" />
              </div>

              <p className="text-center text-[8px] uppercase tracking-[0.6em] text-white/10 font-light mb-12">
                — Ditulis oleh Mentari Wedding —
              </p>

              {/* CTA */}
              <div className="text-center mb-6">
                <a
                  href="/#manifesto"
                  className="group inline-flex items-center gap-5 border border-[#CEB175]/40 px-10 py-4 hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700"
                >
                  <span className="text-[9px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">
                    Mulai Cerita Anda
                  </span>
                  <span className="w-5 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700" />
                </a>
              </div>
              <div className="text-center">
                <Link
                  href="/kisah"
                  className="text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white/50 transition-colors duration-500"
                >
                  ← Semua Kisah
                </Link>
              </div>

              {/* Related Stories */}
              {related.length > 0 && (
                <Reveal delay={300}>
                  <div className="mt-20 pt-16 border-t border-[#CEB175]/8">
                    <p className="text-[9px] uppercase tracking-[0.6em] text-[#CEB175]/40 mb-10 font-light">
                      Kisah Lainnya
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {related.map((rel) => (
                        <Link
                          key={rel.id}
                          href={`/kisah/${rel.slug}`}
                          className="group flex flex-col gap-4"
                        >
                          {rel.cover_image && (
                            <div className="aspect-[16/9] overflow-hidden border border-[#CEB175]/8">
                              <img
                                src={rel.cover_image}
                                alt={rel.title}
                                loading="lazy"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[1000ms]"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/50 mb-2">
                              {rel.aesthetic_tag}
                            </p>
                            <h3 className="font-serif font-light text-white/80 group-hover:text-white transition-colors duration-500 leading-tight text-lg">
                              {rel.title}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </motion.article>
        )}
      </main>

      {/* Lightbox for gallery */}
      <Lightbox
        images={gallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(i) => setLightboxIndex(i)}
      />
    </div>
  );
}
