-- ============================================================
-- MENTARI WEDDING — MIGRATION V8 (Partners / Vendor Marquee)
-- Jalankan SETELAH supabase-v7.sql
-- File ini AMAN di-run berkali-kali (idempotent)
-- TIDAK menghapus data yang sudah ada!
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Tambah kolom is_active ke section_items
--    (dibutuhkan oleh Marquee.jsx untuk filter partner aktif)
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.section_items
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ──────────────────────────────────────────────────────────
-- 2. Daftarkan "Partners" di section_content
--    agar muncul sebagai menu di Admin → Manajemen Konten
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_content (section_name, title, subtitle, description)
SELECT 'partners', 'Vendor & Mitra Pilihan', 'Trusted Collaborators',
       'Nama-nama vendor dan mitra yang ditampilkan di marquee strip homepage. Hanya nama (kolom Judul) yang digunakan — tambah, urutkan, atau nonaktifkan kapan saja.'
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'partners');

-- ──────────────────────────────────────────────────────────
-- 3. Seed data partners awal
--    Hanya insert jika belum ada data partners sama sekali
--    Ganti/tambah nama vendor sesuai mitra Mentari yang nyata
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_items (section_name, title, is_active, display_order)
SELECT v.section_name, v.title, v.is_active, v.display_order
FROM (VALUES
    ('partners', 'Sabila Catering',        true, 0),
    ('partners', 'Bloom & Fern Florist',   true, 1),
    ('partners', 'Surya Sound System',     true, 2),
    ('partners', 'Cahaya Studio',          true, 3),
    ('partners', 'Lentera Dekorasi',       true, 4),
    ('partners', 'Gracia Bridal',          true, 5),
    ('partners', 'Mentari Wedding',        true, 6)
) AS v(section_name, title, is_active, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.section_items WHERE section_name = 'partners');

-- ============================================================
-- SELESAI — Cara penggunaan:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Paste seluruh isi file ini → Klik "Run"
-- 3. Refresh aplikasi — marquee akan otomatis menampilkan
--    vendor dari database, bukan tagline statis
--
-- Untuk mengelola vendor:
-- Admin Panel → Manajemen Konten → Vendor & Mitra
-- Hanya kolom "Judul" yang digunakan untuk marquee.
-- ============================================================
