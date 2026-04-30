'use client';

/**
 * GoldSkeleton — Reusable shimmer placeholder.
 * Dipakai saat komponen menunggu data dari Supabase.
 * 
 * Props:
 *   className  — Tailwind classes untuk ukuran dan bentuk
 *   rounded    — 'sm' | 'md' | 'full' (default: 'sm')
 */
export default function GoldSkeleton({ className = '', rounded = 'sm' }) {
    const radius = { sm: '4px', md: '8px', full: '9999px' }[rounded] ?? '4px';
    return (
        <div
            className={`${className} gold-shimmer`}
            style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: radius,
                overflow: 'hidden',
                position: 'relative',
            }}
        />
    );
}

/**
 * TestimonialSkeleton — skeleton layout untuk Testimonial carousel
 */
export function TestimonialSkeleton() {
    return (
        <div className="flex flex-col items-center gap-8 px-6 py-12 max-w-3xl mx-auto">
            <GoldSkeleton className="w-24 h-1" />
            <GoldSkeleton className="w-full h-8" />
            <GoldSkeleton className="w-4/5 h-8" />
            <GoldSkeleton className="w-3/5 h-6" />
            <div className="flex gap-3 mt-4">
                <GoldSkeleton className="w-2 h-2" rounded="full" />
                <GoldSkeleton className="w-2 h-2" rounded="full" />
                <GoldSkeleton className="w-2 h-2" rounded="full" />
            </div>
        </div>
    );
}

/**
 * MoodBoardSkeleton — skeleton layout untuk MoodBoard palette cards
 */
export function MoodBoardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 border border-white/[0.04] rounded-lg">
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, j) => (
                            <GoldSkeleton key={j} className="w-8 h-8" rounded="full" />
                        ))}
                    </div>
                    <GoldSkeleton className="w-3/4 h-5" rounded="md" />
                    <GoldSkeleton className="w-1/2 h-3" rounded="md" />
                    <GoldSkeleton className="w-full h-3" rounded="md" />
                </div>
            ))}
        </div>
    );
}

/**
 * VenuesSkeleton — skeleton untuk venue cards
 */
export function VenuesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <GoldSkeleton className="w-full aspect-[4/3]" rounded="md" />
                    <GoldSkeleton className="w-3/4 h-5" rounded="sm" />
                    <GoldSkeleton className="w-full h-3" rounded="sm" />
                    <GoldSkeleton className="w-2/3 h-3" rounded="sm" />
                </div>
            ))}
        </div>
    );
}

/**
 * PortfolioSkeleton — skeleton untuk magazine grid
 */
export function PortfolioSkeleton() {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3">
                <GoldSkeleton className="col-span-12 lg:col-span-7 h-[500px]" rounded="sm" />
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">
                    <GoldSkeleton className="flex-1 h-[300px]" rounded="sm" />
                    <GoldSkeleton className="flex-1 h-[190px]" rounded="sm" />
                </div>
            </div>
        </div>
    );
}
