"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Image,
  MapPin,
  BookOpen,
  MessageCircle,
  Star,
  Palette,
  Globe,
  Settings,
  LogOut,
  X,
  Menu,
  SunMedium,
  Quote,
  Layers,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmModal";

/* ── Navigation Groups ──────────────────────────────── */
const NAV_GROUPS = [
  {
    label: null,
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        exact: true,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Konten",
    items: [
      { label: "Konten", href: "/admin/content", icon: FileText },
      { label: "Galeri", href: "/admin/gallery", icon: Image },
      { label: "Venues", href: "/admin/venues", icon: MapPin },
      { label: "Kisah", href: "/admin/journal", icon: BookOpen },
      { label: "Packages", href: "/admin/packages", icon: Layers },
      { label: "Whispers", href: "/admin/whispers", icon: Quote },
    ],
  },
  {
    label: "Bisnis",
    items: [
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageCircle },
      { label: "Testimonial", href: "/admin/testimonials", icon: Star },
      { label: "Mood Board", href: "/admin/moodboard", icon: Palette },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Instagram", href: "/admin/instagram", icon: Globe },
      { label: "Pengaturan", href: "/admin/settings", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/* ── NavItem component ──────────────────────────────── */
function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-2.5 relative transition-all duration-300 ${
        active
          ? "text-[#CEB175] bg-[#CEB175]/5"
          : "text-white/55 hover:text-white/90 hover:bg-white/[0.03]"
      }`}
    >
      {/* Active left bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#CEB175] transition-all duration-300 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        }`}
      />
      <Icon className="w-[14px] h-[14px] flex-shrink-0" strokeWidth={1.5} />
      <span className="text-[10px] uppercase tracking-[0.4em] font-light">
        {item.label}
      </span>
    </Link>
  );
}

/* ── Main Layout ────────────────────────────────────── */
export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user && pathname !== "/admin/login") router.push("/admin/login");
      else setUser(user);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session && pathname !== "/admin/login") router.push("/admin/login");
      else setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobile(false);
  }, [pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };
  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const activeItem = ALL_ITEMS.find((item) => isActive(item));

  if (pathname === "/admin/login")
    return (
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    );

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div
          className="min-h-screen bg-[#040404] text-white flex"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {/* ══ DESKTOP SIDEBAR ══ */}
          <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] bg-[#040404] border-r border-white/[0.04] z-50">
            {/* Gold top line */}
            <div className="h-px bg-gradient-to-r from-[#CEB175]/60 via-[#CEB175]/20 to-transparent" />

            {/* Brand */}
            <Link
              href="/admin"
              className="flex items-center gap-3 px-6 py-6 group border-b border-white/[0.04]"
            >
              <div className="w-7 h-7 flex items-center justify-center border border-[#CEB175]/20 group-hover:border-[#CEB175]/50 transition-all duration-500 flex-shrink-0">
                <SunMedium className="w-3.5 h-3.5 text-[#CEB175]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-[15px] tracking-[0.15em] text-white leading-none">
                  Mentari
                </span>
                <span className="text-[7px] uppercase tracking-[0.5em] text-[#CEB175]/40 mt-1">
                  Admin Suite
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi}>
                  {group.label && (
                    <p className="text-[7px] uppercase tracking-[0.5em] text-white/35 px-4 mb-2 font-light">
                      {group.label}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavItem
                        key={item.href}
                        item={item}
                        active={isActive(item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-4 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-white/45 hover:text-[#CEB175] transition-colors duration-300 px-2 py-2"
              >
                ↗ Lihat Website
              </Link>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-2 py-2 text-[8px] uppercase tracking-[0.4em] text-white/45 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="w-3 h-3" />
                Keluar
              </button>
            </div>
          </aside>

          {/* ══ MOBILE TOPBAR ══ */}
          <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#040404]/95 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="h-px bg-gradient-to-r from-[#CEB175]/60 via-[#CEB175]/20 to-transparent" />
            <div className="flex items-center justify-between px-5 h-[56px]">
              <Link href="/admin" className="flex items-center gap-2.5">
                <SunMedium className="w-4 h-4 text-[#CEB175]" />
                <span className="font-serif text-[15px] tracking-[0.15em]">
                  Mentari
                </span>
              </Link>
              <div className="flex items-center gap-3">
                {/* Active page label */}
                {activeItem && (
                  <span className="text-[8px] uppercase tracking-[0.4em] text-[#CEB175]/60 font-light">
                    {activeItem.label}
                  </span>
                )}
                <button
                  onClick={() => setMobile(true)}
                  className="w-8 h-8 flex items-center justify-center border border-white/[0.08] hover:border-[#CEB175]/30 transition-colors duration-300"
                >
                  <Menu className="w-4 h-4 text-white/50" />
                </button>
              </div>
            </div>
          </header>

          {/* ══ MOBILE MENU OVERLAY ══ */}
          <AnimatePresence>
            {mobile && (
              <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[200] bg-[#040404] flex flex-col md:hidden"
              >
                <div className="h-px bg-gradient-to-r from-[#CEB175]/60 via-[#CEB175]/20 to-transparent" />

                {/* Mobile Header */}
                <div className="flex items-center justify-between px-6 h-[56px] border-b border-white/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <SunMedium className="w-4 h-4 text-[#CEB175]" />
                    <span className="font-serif text-[15px] tracking-[0.15em]">
                      Mentari
                    </span>
                    <span className="text-[7px] uppercase tracking-[0.4em] text-[#CEB175]/30 mt-0.5">
                      Admin Suite
                    </span>
                  </div>
                  <button
                    onClick={() => setMobile(false)}
                    className="w-8 h-8 flex items-center justify-center border border-white/[0.08]"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                </div>

                {/* Mobile Nav — Grouped */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                  {NAV_GROUPS.map((group, gi) => (
                    <motion.div
                      key={gi}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: gi * 0.08,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {group.label && (
                        <p className="text-[7px] uppercase tracking-[0.5em] text-white/35 mb-4 font-light">
                          — {group.label} —
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobile(false)}
                              className={`flex flex-col gap-2 p-4 border transition-all duration-300 ${
                                active
                                  ? "border-[#CEB175]/30 bg-[#CEB175]/5 text-[#CEB175]"
                                  : "border-white/[0.08] text-white/55 hover:border-white/25 hover:text-white/85"
                              }`}
                            >
                              <Icon className="w-4 h-4" strokeWidth={1.5} />
                              <span className="text-[9px] uppercase tracking-[0.4em] font-light">
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Footer */}
                <div className="border-t border-white/[0.06] px-6 py-5 flex items-center justify-between">
                  <Link
                    href="/"
                    target="_blank"
                    className="text-[8px] uppercase tracking-[0.4em] text-white/45 hover:text-[#CEB175] transition-colors"
                  >
                    ↗ Website
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-white/45 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 md:ml-[220px] min-h-screen flex flex-col">
            <main className="flex-1 px-5 sm:px-8 lg:px-12 pt-[72px] md:pt-10 pb-10 sm:pb-16 max-w-[1200px] w-full mx-auto">
              {!user && loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="w-5 h-5 border border-[#CEB175]/20 border-t-[#CEB175] rounded-full animate-spin" />
                </div>
              ) : user ? (
                children
              ) : null}
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
