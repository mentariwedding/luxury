-- ============================================================
-- MENTARI WEDDING — MIGRATION V7 (Final Sync)
-- instagram_feed table + inquiry_name column fix
-- Jalankan SETELAH supabase-v6.sql
-- AMAN dijalankan berkali-kali (idempotent)
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Tabel INSTAGRAM_FEED
--    Query oleh: src/app/admin/instagram/page.jsx
--    & src/components/Footer.jsx (preview feed di footer)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.instagram_feed (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url     TEXT NOT NULL,
    caption       TEXT DEFAULT '',
    post_url      TEXT DEFAULT '',                 -- link ke post Instagram asli
    is_active     BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instagram_order  ON public.instagram_feed(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_active ON public.instagram_feed(is_active);

-- RLS
ALTER TABLE public.instagram_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active instagram feed" ON public.instagram_feed;
CREATE POLICY "Public can read active instagram feed" ON public.instagram_feed
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage instagram feed" ON public.instagram_feed;
CREATE POLICY "Admins can manage instagram feed" ON public.instagram_feed
    FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_instagram_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_instagram_updated_at ON public.instagram_feed;
CREATE TRIGGER set_instagram_updated_at
    BEFORE UPDATE ON public.instagram_feed
    FOR EACH ROW EXECUTE FUNCTION update_instagram_timestamp();

-- Seed data — 4 placeholder posts
INSERT INTO public.instagram_feed (image_url, caption, display_order)
SELECT v.image_url, v.caption, v.display_order
FROM (VALUES
    ('/images/tawalepas.JPG', 'A Sabtu at the mountain', 0),
    ('/images/hangat.JPG',    'When rain became the plan', 1),
    ('/images/estetik.JPG',   'The garden that waited', 2),
    ('/images/sentuhan.JPG',  'Every detail, a love letter', 3)
) AS v(image_url, caption, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.instagram_feed LIMIT 1);

-- ──────────────────────────────────────────────────────────
-- 2. Kolom NAME di inquiry_submissions (backward compat)
--    InquiryForm.jsx menyimpan field 'name' tapi tabel
--    punya kolom 'initials'. Tambahkan kolom name sebagai alias.
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.inquiry_submissions
    ADD COLUMN IF NOT EXISTS name TEXT GENERATED ALWAYS AS (initials) STORED;

-- ──────────────────────────────────────────────────────────
-- 3. Kolom EVENT_TYPE di inquiry_submissions
--    admin/page.jsx reads event_type tapi kolom belum ada
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.inquiry_submissions
    ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT '';

-- ──────────────────────────────────────────────────────────
-- 4. Storage bucket 'photos' untuk upload gambar
--    (diperlukan oleh instagram admin page upload feature)
-- ──────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS untuk storage bucket photos
DROP POLICY IF EXISTS "Public read photos" ON storage.objects;
CREATE POLICY "Public read photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Auth upload photos" ON storage.objects;
CREATE POLICY "Auth upload photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete photos" ON storage.objects;
CREATE POLICY "Auth delete photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────
-- 5. Section content untuk BehindTheMoment
--    Ditambahkan ke homepage, pastikan ada di section_content
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_content (section_name, title, subtitle, description)
SELECT 'behind_the_moment', 'Behind the Moment', 'The Process', 'Sekilas tentang bagaimana kami bekerja — dalam keheningan, dengan penuh perhatian.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.section_content WHERE section_name = 'behind_the_moment'
);

-- ============================================================
-- SELESAI — Cara penggunaan:
-- 1. Buka Supabase Dashboard -> SQL Editor
-- 2. Paste seluruh isi file ini
-- 3. Klik "Run"
-- 4. Refresh aplikasi
--
-- Catatan penting:
-- - instagram_feed: table baru untuk admin Instagram page
-- - name column: generated column alias dari initials
-- - event_type: kolom baru untuk tracking jenis acara
-- - photos bucket: storage untuk upload gambar admin
-- ============================================================
