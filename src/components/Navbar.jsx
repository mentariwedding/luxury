'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const isAdmin    = pathname?.startsWith('/admin');
    const isHomepage = pathname === '/';

    // Always declare hooks before any conditional return (Rules of Hooks)
    const [scrolled, setScrolled] = useState(!isHomepage && !isAdmin);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isHomepage) return;
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomepage]);

    // Don't render on admin routes — admin has its own sidebar nav
    if (isAdmin) return null;

    const isScrolled = scrolled;

    // Smart href: on subpages, anchor links must go to /#section not just #section
    const resolveHref = (href) => {
        if (href.startsWith('#') && !isHomepage) return `/${href}`;
        return href;
    };

    const navItems = [
        { label: 'Editorial', href: '/portfolio' },
        { label: 'Kisah',     href: '/kisah' },
        { label: 'Atelier',   href: '#atelier' },
        { label: 'Venues',    href: '#venues' },
        { label: 'Tentang',   href: '/tentang' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'dark-glass-nav py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo & Tagline */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Artisanal sun mark — bespoke, not a dashboard icon */}
                            <svg
                                width="22"
                                height="22"
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
                                {/* Diagonal accent rays — heritage touch */}
                                <line x1="12" y1="6.5" x2="12" y2="7.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
                                <line x1="12" y1="16.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
                                <line x1="6.5" y1="12" x2="7.5" y2="12" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
                                <line x1="16.5" y1="12" x2="17.5" y2="12" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
                            </svg>
                            <span className="font-serif text-2xl md:text-3xl font-medium tracking-wider text-white leading-none">Mentari Wedding</span>
                        </div>
                        <span className="text-[6px] md:text-[7px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#CEB175] mt-1.5 ml-7 md:ml-[2.25rem]">Planned to Perfection</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.4em] font-light text-[#A3A3A3]">
                        {navItems.map((item) => (
                            <a 
                                key={item.label}
                                href={resolveHref(item.href)} 
                                className="relative py-2 group"
                            >
                                <span className="group-hover:text-white transition-colors duration-500">{item.label}</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#CEB175] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <a href={resolveHref('#manifesto')} className="relative inline-block px-8 py-3 group overflow-hidden border border-[#CEB175]/30 transition-all duration-500 hover:border-[#CEB175]">
                            <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] font-light text-white group-hover:text-black transition-colors duration-500">Mulai Cerita</span>
                            <div className="absolute inset-0 bg-[#CEB175] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6 text-[#CEB175]" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <div className={`fixed inset-0 bg-[#050505] z-40 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                 {/* Decorative background for mobile menu */}
                 <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                     <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#CEB175]/20 rounded-full animate-float-slow"></div>
                     <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-[#CEB175]/10 rounded-full animate-float-slower"></div>
                 </div>

                 <div className="relative z-10 flex flex-col items-center gap-10 font-serif text-4xl text-white text-center">
                     {navItems.map((item, index) => (
                         <a 
                            key={item.label}
                            href={resolveHref(item.href)} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={`hover:text-[#CEB175] transition-all duration-500 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                         >
                            {item.label}
                         </a>
                     ))}
                     <a 
                        href={resolveHref('#manifesto')} 
                        onClick={() => setMobileMenuOpen(false)} 
                        className={`mt-10 text-xs uppercase tracking-[0.4em] text-black bg-[#CEB175] px-12 py-5 transition-all duration-700 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${navItems.length * 100}ms` }}
                    >
                        Mulai Cerita
                    </a>
                 </div>
            </div>
        </>
    );
}
