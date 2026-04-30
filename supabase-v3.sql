-- ============================================================
-- MENTARI WEDDING — MIGRATION V3 (New Features)
-- Jalankan SETELAH supabase-v2.sql
-- File ini AMAN di-run berkali-kali (idempotent)
-- TIDAK menghapus data yang sudah ada!
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Tabel INSTAGRAM_FEED — Foto Instagram untuk ditampilkan di footer
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.instagram_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    post_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.instagram_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read instagram_feed" ON public.instagram_feed;
CREATE POLICY "Public can read instagram_feed" ON public.instagram_feed
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage instagram_feed" ON public.instagram_feed;
CREATE POLICY "Admins can manage instagram_feed" ON public.instagram_feed
    FOR ALL USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────
-- 2. SEED SECTION_ITEMS — Social Proof counter data
--    Hanya seed jika belum ada data social_proof
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_items (section_name, title, tag, description, display_order)
SELECT v.section_name, v.title, v.tag, v.description, v.display_order FROM (VALUES
    ('social_proof', '60',  '+',  E'Cerita\nDirangkai',     0),
    ('social_proof', '5',   '+',  E'Tahun\nPengalaman',     1),
    ('social_proof', '100', '%',  E'Dedikasi\nPenuh Hati',  2)
) AS v(section_name, title, tag, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.section_items WHERE section_name = 'social_proof');

-- ──────────────────────────────────────────────────────────
-- 2b. SEED SECTION_CONTENT — Social Proof parent record
--     Agar tampil di Admin Panel -> Konten
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_content (section_name, title, subtitle, description)
SELECT 'social_proof', 'Social Proof', 'Credibility', 'Statistik dan pencapaian Mentari.'
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'social_proof');

-- ──────────────────────────────────────────────────────────
-- 3. SEED INSTAGRAM_FEED — Fallback photos
--    Hanya seed jika tabel masih kosong
-- ──────────────────────────────────────────────────────────
INSERT INTO public.instagram_feed (image_url, caption, display_order)
SELECT v.image_url, v.caption, v.display_order FROM (VALUES
    ('/images/tawalepas.JPG', 'Tawa yang tak bisa diulang.',       0),
    ('/images/hangat.JPG',    'Detail kecil, makna besar.',        1),
    ('/images/estetik.JPG',   'Estetika dalam kesederhanaan.',     2),
    ('/images/suasana.JPG',   'Suasana yang dirancang khusus.',    3)
) AS v(image_url, caption, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.instagram_feed);

-- ──────────────────────────────────────────────────────────
-- 4. Tambah SITE_SETTINGS — Instagram URL
--    Hanya insert jika belum ada
-- ──────────────────────────────────────────────────────────
INSERT INTO public.site_settings (key, value)
SELECT 'instagram_url', 'https://instagram.com/mentariwedding'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'instagram_url');

-- ============================================================
-- SELESAI. Refresh aplikasi setelah menjalankan migration ini.
-- Data whispers & venues TIDAK diubah — tetap seperti semula.
-- ============================================================
