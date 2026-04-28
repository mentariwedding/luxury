'use client';

import React, { useEffect, useState } from 'react';
import { SunMedium } from 'lucide-react';

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-all duration-1000 ease-in-out ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <SunMedium className="w-12 h-12 text-[#CEB175]" />
                <div className="flex flex-col items-center">
                    <span className="font-serif text-2xl tracking-[0.3em] text-white uppercase">Mentari Wedding</span>
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#CEB175]/50 to-transparent mt-4"></div>
                </div>
            </div>
        </div>
    );
}
