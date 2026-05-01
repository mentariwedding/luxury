'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';
import InstagramFeed from './InstagramFeed';

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

const PinterestIcon = ({ className }) => (
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
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.994.499 1.806 1.476 1.806 1.772 0 3.135-1.868 3.135-4.561 0-2.386-1.716-4.054-4.163-4.054-2.838 0-4.503 2.128-4.503 4.328 0 .857.33 1.776.742 2.278a.3.3 0 0 1 .069.286c-.076.314-.244.994-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
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
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-[#CEB175] flex-shrink-0"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1" />
                                    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                </svg>
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
                                <p className="font-serif text-3xl md:text-7xl font-light mb-8 max-w-4xl mx-auto leading-tight px-4">
                                    Mari merangkai <span className="italic text-[#CEB175]">cerita abadi</span> Anda bersama kami.
                                </p>
                            </Reveal>
                            <Reveal delay={600}>
                                <p className="text-[10px] uppercase tracking-[0.6em] text-[#CEB175]/60 italic font-serif">
                                    — by inquiry only —
                                </p>
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
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 transition-colors">
                                    <InstagramIcon className="w-4 h-4" />
                                </div>
                                <span className="tracking-[0.2em] uppercase text-[11px]">Instagram</span>
                            </a>
                            <a href={settings.pinterest_url} className="group flex items-center gap-4 text-sm font-light text-[#A3A3A3] hover:text-[#CEB175] transition-all duration-500">
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 transition-colors">
                                    <PinterestIcon className="w-4 h-4" />
                                </div>
                                <span className="tracking-[0.2em] uppercase text-[11px]">Pinterest</span>
                            </a>
                            <a href={`https://www.google.com/maps?q=${settings.map_coordinates}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-sm font-light text-[#A3A3A3] hover:text-[#CEB175] transition-all duration-500">
                                <div className="w-10 h-10 border border-[#CEB175]/10 flex items-center justify-center group-hover:border-[#CEB175]/40 transition-colors">
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
                                { label: 'Whisper', num: '01', href: '#manifesto' },
                                { label: 'Editorial', num: '02', href: '/portfolio' },
                                { label: 'Kisah', num: '03', href: '/kisah' },
                                { label: 'Atelier', num: '04', href: '#atelier' },
                                { label: 'Venues', num: '05', href: '#venues' },
                                { label: 'Tentang', num: '06', href: '/tentang' },
                                { label: 'Inquiry', num: '07', href: '#manifesto' },
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

                {/* Instagram Feed */}
                <InstagramFeed />

                {/* Minimalist Bottom */}
                <Reveal delay={800}>
                    <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-[#CEB175]/5 pt-12">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-[#525252]">Mentari Wedding © 2026 — All Rights Reserved</p>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}

