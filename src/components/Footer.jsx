'use client';

import React, { useEffect, useState } from 'react';
import { SunMedium, ArrowUpRight, MapPin, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';

const InstagramIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

export default function Footer() {
    const [settings, setSettings] = useState({
        whatsapp_number: '628123456789',
        instagram_url: '#',
        pinterest_url: '#',
        map_coordinates: '-6.887298081773353, 106.77632655353484',
        office_address: 'Jl. Kebon Pala 2 Cibadak, Sukabumi, Jawa Barat, 43351.'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');
            
            if (data && !error) {
                const newSettings = {};
                data.forEach(item => {
                    newSettings[item.key] = item.value;
                });
                setSettings(prev => ({ ...prev, ...newSettings }));
            }
        };

        fetchSettings();
    }, []);

    return (
        <footer className="bg-[#050505] text-white pt-40 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                {/* Big Editorial Branding */}
                <div id="contact" className="relative mb-40">
                    <div className="flex flex-col items-center text-center">
                        <Reveal>
                            <div className="flex items-center gap-4 mb-10 opacity-40">
                                <SunMedium className="w-5 h-5 text-[#CEB175]" />
                                <span className="text-[10px] uppercase tracking-[0.8em] text-[#CEB175]">Planned to Perfection</span>
                            </div>
                        </Reveal>
                        <Reveal delay={200}>
                            <h2 className="font-serif text-[20vw] md:text-[15vw] leading-none uppercase tracking-tighter text-white/[0.03] select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                Mentari Wedding
                            </h2>
                        </Reveal>
                        <div className="relative z-10">
                            <Reveal delay={400}>
                                <p className="font-serif text-3xl md:text-7xl font-light mb-12 max-w-4xl mx-auto leading-tight px-4">
                                    Mari merangkai <span className="italic text-[#CEB175]">cerita abadi</span> Anda bersama kami.
                                </p>
                            </Reveal>
                            <Reveal delay={600}>
                                <a 
                                    href={`https://wa.me/${settings.whatsapp_number}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 group border border-[#CEB175]/30 px-10 py-6 hover:bg-[#CEB175] hover:text-black transition-all duration-700 rounded-full"
                                >
                                    <span className="text-xs uppercase tracking-[0.3em]">Mulai Konsultasi</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                                </a>
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* Unconventional Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t border-[#CEB175]/10 pt-20">
                    {/* Column 1: Socials in vertical style */}
                    <Reveal className="md:col-span-3" delay={200}>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#525252] mb-10">Koneksi Sosial</p>
                        <div className="flex flex-col gap-8">
                            <a href={settings.instagram_url} className="group flex items-center gap-4 text-sm font-light text-[#A3A3A3] hover:text-[#CEB175] transition-all duration-500">
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 rounded-full transition-colors">
                                    <InstagramIcon className="w-4 h-4" />
                                </div>
                                <span className="tracking-[0.2em] uppercase text-[11px]">Instagram</span>
                            </a>
                            <a href={settings.pinterest_url} className="group flex items-center gap-4 text-sm font-light text-[#A3A3A3] hover:text-[#CEB175] transition-all duration-500">
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 rounded-full transition-colors">
                                    <Send className="w-4 h-4" />
                                </div>
                                <span className="tracking-[0.2em] uppercase text-[11px]">Pinterest</span>
                            </a>
                            <a href={`https://www.google.com/maps?q=${settings.map_coordinates}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-sm font-light text-[#A3A3A3] hover:text-[#CEB175] transition-all duration-500">
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 rounded-full transition-colors">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="tracking-[0.2em] uppercase text-[11px]">Lokasi</span>
                            </a>
                        </div>
                    </Reveal>

                    {/* Column 2: Large Navigation Links */}
                    <Reveal className="md:col-span-5 md:col-start-5" delay={400}>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#525252] mb-10">Eksplorasi</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { label: 'Portofolio', num: '01', href: '#portfolio' },
                                { label: 'Pendekatan', num: '02', href: '#approach' },
                                { label: 'Signature', num: '03', href: '#signature' },
                                { label: 'Atelier', num: '04', href: '#atelier' },
                            ].map((item) => (
                                <a key={item.label} href={item.href} className="group flex items-end gap-3 w-fit">
                                    <span className="text-3xl font-serif font-light text-[#A3A3A3] group-hover:text-white transition-all duration-500 group-hover:translate-x-2">{item.label}</span>
                                    <span className="text-[10px] text-[#CEB175] mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500">{item.num}</span>
                                </a>
                            ))}
                        </div>
                    </Reveal>

                    {/* Column 3: Location/Legal */}
                    <Reveal className="md:col-span-3 md:col-start-10" delay={600}>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#525252] mb-10">Studio</p>
                        <div className="space-y-6">
                            <p className="text-sm font-light text-[#A3A3A3] leading-relaxed tracking-wide whitespace-pre-line">
                                {settings.office_address}
                            </p>
                            <p className="text-xs font-light text-[#CEB175] italic opacity-80 border-l border-[#CEB175]/20 pl-4 py-1">
                                Siap melayani perjalanan di seluruh wilayah Sukabumi & sekitarnya.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Minimalist Bottom */}
                <Reveal delay={800}>
                    <div className="mt-40 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-[#CEB175]/5 pt-12">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-[#525252]">Mentari Wedding © 2026 — All Rights Reserved</p>
                        <div className="flex gap-12">
                            <a href="#" className="text-[9px] uppercase tracking-[0.5em] text-[#525252] hover:text-[#CEB175] transition-colors">Privacy</a>
                            <a href="#" className="text-[9px] uppercase tracking-[0.5em] text-[#525252] hover:text-[#CEB175] transition-colors">Legal</a>
                        </div>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}

