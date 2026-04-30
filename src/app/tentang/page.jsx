'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GoldDivider from '@/components/GoldDivider';

const MILESTONES = [
    { year: '2019', title: 'Awal Mula', desc: 'Mentari lahir dari sebuah keyakinan sederhana — bahwa setiap pernikahan adalah karya seni yang layak dirawat dengan sepenuh hati.' },
    { year: '2020', title: 'Menemukan Suara', desc: 'Di tengah keheningan yang tak terduga, kami menemukan cara baru untuk merangkai cerita — lebih intim, lebih personal, lebih bermakna.' },
    { year: '2022', title: 'Filosofi Terbentuk', desc: 'Kami memilih untuk menolak volume. Setiap tahun, hanya sejumlah kecil perayaan yang kami terima — agar setiap detail mendapat perhatian penuh.' },
    { year: '2024', title: 'Lebih dari 60 Cerita', desc: 'Enam puluh lebih pasangan telah mempercayakan hari paling istimewa mereka kepada kami. Setiap satu adalah kehormatan yang tidak kami anggap ringan.' },
    { year: 'Kini', title: 'By Inquiry Only', desc: 'Mentari bukan untuk semua orang — dan itu bukan kesombongan. Itu adalah komitmen kami bahwa Anda mendapatkan yang terbaik dari kami.' },
];

const VALUES = [
    {
        num: '01',
        title: 'Keheningan di Balik Kemewahan',
        desc: 'Kami tidak percaya pada keramaian yang dipaksakan. Kemewahan sejati adalah ketika semuanya terasa pas — tidak berlebihan, tidak kurang.',
    },
    {
        num: '02',
        title: 'Detail sebagai Bahasa Cinta',
        desc: 'Dari lipatan kain di meja makan hingga arah cahaya saat janji diucapkan — setiap detail adalah cara kami berbicara kepada pasangan.',
    },
    {
        num: '03',
        title: 'Sedikit, Tapi Utuh',
        desc: 'Kami sengaja membatasi jumlah perayaan yang kami terima. Bukan karena terbatas, tetapi karena setiap cerita layak mendapatkan versi terbaik dari kami.',
    },
];

export default function TentangPage() {
    return (
        <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="grain-overlay" />

            <main>
                {/* ── Hero ── */}
                <section className="relative overflow-hidden" style={{ paddingTop: 'clamp(100px, 16vh, 180px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CEB175] rounded-full blur-[250px] opacity-[0.025] pointer-events-none" />
                    <div className="container mx-auto px-6 md:px-12 max-w-[1200px] relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175] mb-6 font-light"
                                >
                                    — Tentang Kami —
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-serif font-light text-white leading-[1.05] mb-8"
                                    style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
                                >
                                    Kami Merangkai{' '}
                                    <span className="italic gold-gradient-text">Momen,</span>
                                    <br />Bukan Sekadar Acara.
                                </motion.h1>
                                <GoldDivider delay={0.4} width="w-20" />
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className="font-serif italic text-[#A3A3A3] leading-relaxed text-base md:text-lg max-w-lg"
                                >
                                    Mentari Wedding adalah studio pernikahan eksklusif di Sukabumi — didirikan atas keyakinan bahwa setiap pernikahan berhak atas perhatian yang utuh, bukan sekadar eksekusi daftar tugas.
                                </motion.p>
                            </div>

                            {/* Stats — right */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="grid grid-cols-3 gap-px border border-[#CEB175]/10"
                            >
                                {[
                                    { num: '60+', label: 'Cerita\nDirangkai' },
                                    { num: '5+', label: 'Tahun\nPengalaman' },
                                    { num: '100%', label: 'Dedikasi\nPenuh Hati' },
                                ].map((s, i) => (
                                    <div key={i} className="py-10 px-6 text-center border-r border-[#CEB175]/10 last:border-0">
                                        <p className="font-serif font-light text-white mb-2 leading-none" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                                            <span className="gold-gradient-text italic">{s.num}</span>
                                        </p>
                                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-light leading-relaxed whitespace-pre-line">{s.label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Pull Quote ── */}
                <section className="border-y border-[#CEB175]/8 bg-[#080808]" style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
                    <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
                        <Reveal>
                            <p className="font-serif font-light text-white leading-[1.2]" style={{ fontSize: 'clamp(22px, 4vw, 48px)' }}>
                                &ldquo;Bukan sekadar pesta. Bukan sekadar dekorasi.{' '}
                                <span className="italic gold-gradient-text">Ada keheningan di balik setiap kemewahan</span>
                                {' '}— dan di sanalah kami bekerja.&rdquo;
                            </p>
                        </Reveal>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#CEB175]/30 to-transparent w-24 mx-auto mt-10" />
                    </div>
                </section>

                {/* ── Timeline ── */}
                <section className="container mx-auto px-6 md:px-12 max-w-[1200px]" style={{ paddingTop: 'clamp(80px, 12vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
                    <Reveal>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-4 font-light">— Perjalanan Kami —</p>
                        <h2 className="font-serif font-light text-white mb-16 md:mb-20" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                            Dari Mimpi Kecil ke <span className="italic gold-gradient-text">Kepercayaan Besar</span>
                        </h2>
                    </Reveal>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[60px] md:left-[80px] top-0 bottom-0 w-px bg-gradient-to-b from-[#CEB175]/20 via-[#CEB175]/10 to-transparent hidden md:block" />

                        <div className="space-y-12 md:space-y-16">
                            {MILESTONES.map((m, i) => (
                                <Reveal key={i} delay={i * 100}>
                                    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12 items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-[#CEB175] flex-shrink-0 hidden md:block" />
                                            <span className="font-serif italic text-[#CEB175] text-lg md:text-xl">{m.year}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-white font-light text-xl md:text-2xl mb-3">{m.title}</h3>
                                            <p className="text-[#A3A3A3] font-light text-sm md:text-base leading-relaxed">{m.desc}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Nilai / Values ── */}
                <section className="bg-[#070707] border-t border-[#CEB175]/8" style={{ paddingTop: 'clamp(80px, 12vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
                    <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
                        <Reveal>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-[#CEB175] mb-4 font-light">— Nilai Kami —</p>
                            <h2 className="font-serif font-light text-white mb-16 md:mb-20" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                                Yang Kami Percayai, <span className="italic gold-gradient-text">Setiap Hari</span>
                            </h2>
                        </Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-[#CEB175]/8">
                            {VALUES.map((v, i) => (
                                <Reveal key={i} delay={i * 150}>
                                    <div className="p-8 md:p-10 border-r border-[#CEB175]/8 last:border-0 h-full">
                                        <span className="font-serif italic text-[#CEB175]/30 text-4xl block mb-6">{v.num}</span>
                                        <h3 className="font-serif font-light text-white text-lg md:text-xl mb-4 leading-snug">{v.title}</h3>
                                        <p className="text-[#A3A3A3] font-light text-sm leading-relaxed">{v.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="text-center" style={{ paddingTop: 'clamp(80px, 12vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
                    <div className="container mx-auto px-6 md:px-12">
                        <Reveal>
                            <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175]/50 mb-6">Siap Memulai Percakapan?</p>
                            <h2 className="font-serif font-light text-white mb-10 leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
                                Ceritakan <span className="italic gold-gradient-text">Hari Istimewa</span> Anda.
                            </h2>
                        </Reveal>
                        <Reveal delay={200}>
                            <a
                                href="/#manifesto"
                                className="group inline-flex items-center gap-5 border border-[#CEB175]/40 px-12 py-5 rounded-full hover:bg-[#CEB175] hover:border-[#CEB175] transition-all duration-700"
                            >
                                <span className="text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black font-light transition-colors duration-700">
                                    Mulai Inquiry
                                </span>
                                <span className="w-6 h-px bg-[#CEB175] group-hover:bg-black transition-colors duration-700" />
                            </a>
                        </Reveal>
                        <Reveal delay={400}>
                            <p className="mt-14 text-[9px] uppercase tracking-[0.5em] text-white/15 font-serif italic">
                                Mentari Wedding · Est. 2019 · Sukabumi, Jawa Barat
                            </p>
                        </Reveal>
                    </div>
                </section>
            </main>
        </div>
    );
}
