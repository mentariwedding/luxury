"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const FALLBACK_AESTHETICS = [
  {
    name: "Dusty Rose & Ivory",
    colors: ["#E8D0C0", "#F5EDE6", "#C9A9A6", "#8B6B5D"],
    tag: "Romantic · Soft · Garden",
  },
  {
    name: "Midnight & Gold",
    colors: ["#1A1A2E", "#2D2B55", "#CEB175", "#E8D399"],
    tag: "Bold · Timeless · Formal",
  },
  {
    name: "Sage & Cream",
    colors: ["#87A878", "#C8CDA0", "#F0EAD6", "#D4C5A9"],
    tag: "Natural · Earthy · Serene",
  },
  {
    name: "Pure White",
    colors: ["#F8F8F6", "#EDEDE8", "#D9D9D4", "#C4C4BE"],
    tag: "Classic · Timeless · Pure",
  },
  {
    name: "Mauve & Blush",
    colors: ["#C9A6B5", "#E5C9D4", "#F2E2E8", "#D4A0B5"],
    tag: "Feminine · Dreamy · Soft",
  },
  { name: "Belum yakin", colors: [], tag: "Kami bantu temukan gaya Anda" },
];

const GUEST_RANGES = [
  "< 100 tamu",
  "100 – 200 tamu",
  "200 – 400 tamu",
  "> 400 tamu",
  "Belum tentukan",
];

export default function InquiryForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    guests: "",
    aesthetic: "",
    initials: "",
    message: "",
  });

  // Reset saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setForm({
        date: "",
        guests: "",
        aesthetic: "",
        initials: "",
        message: "",
      });
    }
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const canNext1 = form.date && form.guests;
  const canNext2 = form.aesthetic;
  const canSubmit = form.initials.trim().length >= 2;
  const [submitting, setSubmitting] = useState(false);
  const [waNumber, setWaNumber] = useState("628123456789");
  const [aesthetics, setAesthetics] = useState(FALLBACK_AESTHETICS);

  // Fetch dynamic data (WA number + mood palettes) when modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp_number")
        .single();
      if (data?.value) setWaNumber(data.value);

      const { data: palettes } = await supabase
        .from("mood_palettes")
        .select("name, colors, tag, mood")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (palettes && palettes.length > 0) {
        const formatted = palettes.map((p) => ({
          name: p.name,
          colors: Array.isArray(p.colors)
            ? p.colors
            : p.colors
              ? JSON.parse(p.colors)
              : [],
          tag: p.tag || p.mood || "",
        }));
        // Always add "Belum yakin" option at the end
        formatted.push({
          name: "Belum yakin",
          colors: [],
          tag: "Kami bantu temukan gaya Anda",
        });
        setAesthetics(formatted);
      }
    })();
  }, [isOpen]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await supabase.from("inquiry_submissions").insert([
        {
          initials: form.initials,
          wedding_date: form.date || null,
          guest_range: form.guests,
          aesthetic: form.aesthetic,
          message: form.message,
          status: "new",
          source: "inquiry_form",
        },
      ]);
    } catch (_) {}

    const msg = [
      `Halo Mentari Wedding 🌸`,
      ``,
      `Saya ${form.initials} ingin berdiskusi tentang pernikahan kami.`,
      ``,
      `📅 Tanggal: ${form.date || "—"}`,
      `👥 Tamu: ${form.guests || "—"}`,
      `🎨 Estetika: ${form.aesthetic || "—"}`,
      form.message ? `💬 Pesan: ${form.message}` : "",
      ``,
      `Terima kasih, kami menantikan cerita lebih lanjut bersama Anda.`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setSubmitting(false);
    setStep(4); // Go to thank you step
  };

  const handleClose = () => {
    setStep(1);
    setForm({ date: "", guests: "", aesthetic: "", initials: "", message: "" });
    onClose?.();
  };

  const stepLabels = ["Hari Istimewa", "Estetika", "Cerita Anda"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-xl bg-[#060606] border border-[#CEB175]/15 overflow-hidden"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {/* Gold top line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/60 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175]/60 mb-2">
                    Inquiry
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-white leading-tight">
                    Mulai{" "}
                    <span className="italic gold-gradient-text">
                      Cerita Anda
                    </span>
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/20 hover:text-white/60 transition-colors duration-300 mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step progress — hidden on thank you step */}
              {step <= 3 && (
                <div className="flex items-center gap-0">
                  {stepLabels.map((label, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 flex items-center justify-center transition-all duration-500 ${
                            step > i + 1
                              ? "bg-[#CEB175]"
                              : step === i + 1
                                ? "border border-[#CEB175] bg-transparent"
                                : "border border-white/15 bg-transparent"
                          }`}
                        >
                          {step > i + 1 ? (
                            <Check className="w-2.5 h-2.5 text-black" />
                          ) : (
                            <span
                              className={`text-[8px] ${step === i + 1 ? "text-[#CEB175]" : "text-white/20"}`}
                            >
                              {i + 1}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[8px] uppercase tracking-[0.3em] transition-colors duration-500 ${
                            step === i + 1 ? "text-[#CEB175]" : "text-white/20"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-3 transition-colors duration-500 ${step > i + 1 ? "bg-[#CEB175]/40" : "bg-white/[0.06]"}`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-8 py-8 min-h-[280px]">
              <AnimatePresence mode="wait">
                {/* Step 1 — Hari & Tamu */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-3">
                        Kapan hari istimewa Anda?
                      </p>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, date: e.target.value }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-[#CEB175]/40 pb-2 text-white text-sm focus:outline-none transition-colors duration-500 [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-3">
                        Perkiraan jumlah tamu
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {GUEST_RANGES.map((g) => (
                          <button
                            key={g}
                            onClick={() =>
                              setForm((p) => ({ ...p, guests: g }))
                            }
                            className={`text-[8px] uppercase tracking-[0.3em] px-4 py-2 border transition-all duration-400 ${
                              form.guests === g
                                ? "bg-[#CEB175]/15 border-[#CEB175]/50 text-[#CEB175]"
                                : "border-white/10 text-white/30 hover:border-white/25 hover:text-white/50"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 — Estetika */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-5">
                      Estetika mana yang paling berbicara untuk Anda?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aesthetics.map((a) => (
                        <button
                          key={a.name}
                          onClick={() =>
                            setForm((p) => ({ ...p, aesthetic: a.name }))
                          }
                          className={`text-left p-3.5 border transition-all duration-400 ${
                            form.aesthetic === a.name
                              ? "border-[#CEB175]/50 bg-[#CEB175]/8"
                              : "border-white/[0.06] hover:border-white/15"
                          }`}
                        >
                          {a.colors.length > 0 && (
                            <div className="flex gap-1 mb-2">
                              {a.colors.map((c, ci) => (
                                <div
                                  key={ci}
                                  className="w-4 h-4 border border-white/10 flex-shrink-0"
                                  style={{ background: c }}
                                />
                              ))}
                            </div>
                          )}
                          <p
                            className={`text-xs font-serif italic transition-colors duration-300 ${form.aesthetic === a.name ? "text-[#CEB175]" : "text-white/70"}`}
                          >
                            {a.name}
                          </p>
                          <p className="text-[7px] uppercase tracking-[0.3em] text-white/25 mt-0.5">
                            {a.tag}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Cerita */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-5"
                  >
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-3">
                        Inisial Anda berdua
                      </p>
                      <input
                        type="text"
                        placeholder="contoh: A & B"
                        value={form.initials}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, initials: e.target.value }))
                        }
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-[#CEB175]/40 pb-2 text-white font-serif italic text-lg placeholder:text-white/15 focus:outline-none transition-colors duration-500"
                      />
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-3">
                        Ceritakan sedikit tentang hari istimewa Anda{" "}
                        <span className="normal-case tracking-normal text-white/15">
                          (opsional)
                        </span>
                      </p>
                      <textarea
                        rows={3}
                        placeholder="Kami bermimpi tentang pernikahan yang..."
                        value={form.message}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, message: e.target.value }))
                        }
                        className="w-full bg-transparent border-b border-white/[0.08] focus:border-[#CEB175]/40 pb-2 text-white/80 font-serif italic text-sm placeholder:text-white/10 focus:outline-none resize-none transition-colors duration-500 leading-relaxed"
                      />
                    </div>
                    {/* Summary */}
                    <div className="p-4 border border-white/[0.05] bg-white/[0.01]">
                      <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 mb-2">
                        Ringkasan Inquiry
                      </p>
                      <div className="space-y-1">
                        {[
                          ["Tanggal", form.date || "—"],
                          ["Tamu", form.guests || "—"],
                          ["Estetika", form.aesthetic || "—"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/25">
                              {k}
                            </span>
                            <span className="text-[9px] text-white/60 font-serif italic">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 — Thank You */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center py-6 gap-5"
                  >
                    {/* Sun icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.1,
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#CEB175] mx-auto"
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
                        <line
                          x1="4.93"
                          y1="4.93"
                          x2="7.05"
                          y2="7.05"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <line
                          x1="16.95"
                          y1="16.95"
                          x2="19.07"
                          y2="19.07"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <line
                          x1="19.07"
                          y1="4.93"
                          x2="16.95"
                          y2="7.05"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <line
                          x1="7.05"
                          y1="16.95"
                          x2="4.93"
                          y2="19.07"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="space-y-2"
                    >
                      <p className="text-[8px] uppercase tracking-[0.6em] text-[#CEB175] font-light">
                        Pesan Terkirim
                      </p>
                      <h3 className="font-serif text-2xl text-white font-light">
                        Sampai jumpa,{" "}
                        <span className="italic gold-gradient-text">
                          {form.initials || "pasangan indah"}
                        </span>
                      </h3>
                    </motion.div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 1.0,
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ originX: 0.5 }}
                      className="h-px w-24 bg-gradient-to-r from-transparent via-[#CEB175]/40 to-transparent"
                    />

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="font-serif italic text-[#A3A3A3] text-sm leading-relaxed max-w-xs font-light"
                    >
                      &ldquo;Kami akan segera menghubungi Anda untuk memulai
                      percakapan yang lebih dalam.&rdquo;
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="pt-2"
                    >
                      <p className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-light">
                        WhatsApp kami akan terbuka sebentar · Pastikan pesan
                        terkirim
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="px-8 pb-8 flex items-center justify-between gap-4">
              {step === 4 ? (
                <div className="flex justify-center w-full">
                  <button
                    onClick={handleClose}
                    className="text-[9px] uppercase tracking-[0.5em] text-white/30 hover:text-white/60 transition-colors border-b border-white/10 hover:border-white/30 pb-0.5"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <>
                  {step > 1 ? (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="text-[9px] uppercase tracking-[0.4em] text-white/25 hover:text-white/50 transition-colors"
                    >
                      ← Kembali
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={step === 1 ? !canNext1 : !canNext2}
                      className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[#CEB175] border border-[#CEB175]/30 px-7 py-3 hover:bg-[#CEB175] hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-500"
                    >
                      Lanjut
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] bg-[#CEB175] text-black px-8 py-3.5 hover:bg-[#E8D399] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-500"
                    >
                      {submitting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : null}
                      {submitting ? "Mengirim..." : "Kirim ke WhatsApp"}
                      {!submitting && (
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
