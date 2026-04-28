-- ============================================================
-- MENTARI WEDDING — MIGRATION V2 (Branding & Mystique)
-- Jalankan SETELAH supabase.sql
-- File ini AMAN di-run berkali-kali (idempotent)
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Tambah kolom video_url di section_content (untuk Hero video)
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.section_content
    ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ──────────────────────────────────────────────────────────
-- 2. Tabel WHISPERS — Kalimat puitis yang muncul di section Whisper
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.whispers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author TEXT,
    accent_word TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.whispers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read whispers" ON public.whispers;
CREATE POLICY "Public can read whispers" ON public.whispers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage whispers" ON public.whispers;
CREATE POLICY "Admins can manage whispers" ON public.whispers
    FOR ALL USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────
-- 3. Tabel VENUES — Curated venues dengan cryptic captions
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cryptic_caption TEXT,
    location_hint TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read venues" ON public.venues;
CREATE POLICY "Public can read venues" ON public.venues
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage venues" ON public.venues;
CREATE POLICY "Admins can manage venues" ON public.venues
    FOR ALL USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────
-- 4. Tabel INQUIRY_CLICKS — Tracking klik tombol WA
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiry_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.inquiry_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert inquiry_clicks" ON public.inquiry_clicks;
CREATE POLICY "Public can insert inquiry_clicks" ON public.inquiry_clicks
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read inquiry_clicks" ON public.inquiry_clicks;
CREATE POLICY "Admins can read inquiry_clicks" ON public.inquiry_clicks
    FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────
-- 5. Tambah section content untuk Whisper & Manifesto
-- ──────────────────────────────────────────────────────────
INSERT INTO public.section_content (section_name, title, subtitle, description, cta_text, image_url)
VALUES
    ('whisper',   'Some moments are not planned, they are summoned.', 'A Whisper', 'Bukan sekadar pesta. Bukan sekadar dekorasi. Ada keheningan di balik setiap kemewahan—dan di sanalah kami bekerja.', NULL, NULL),
    ('manifesto', 'By Inquiry Only.', 'Selectively Curated', 'Kami memilih untuk merancang hanya sejumlah perayaan dalam setahun. Bukan karena terbatas, tetapi karena setiap cerita layak mendapatkan ruang yang utuh.', 'Begin the Conversation', NULL),
    ('venues',    'A Curated Atlas.', 'Selected Locations', 'Setiap pernikahan memiliki tempatnya sendiri—dan setiap tempat memiliki ceritanya. Berikut beberapa lokasi pilihan yang pernah kami rangkai.', NULL, NULL)
ON CONFLICT (section_name) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 6. SEED DATA — Whispers (poetic quotes)
-- Hanya seed jika tabel masih kosong (aman dijalankan berulang)
-- ──────────────────────────────────────────────────────────
INSERT INTO public.whispers (quote, accent_word, display_order)
SELECT v.quote, v.accent_word, v.display_order FROM (VALUES
    ('Some moments are not planned. They are summoned.',           'summoned',     0),
    ('In the silence between vows, we craft the loudest memories.','silence',      1),
    ('We do not chase trends. We invite timelessness.',            'timelessness', 2),
    ('Every flame, every fold, every footstep—intentional.',       'intentional',  3),
    ('A celebration is a sentence written in candlelight.',        'candlelight',  4)
) AS v(quote, accent_word, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.whispers);

-- ──────────────────────────────────────────────────────────
-- 7. SEED DATA — Venues (curated locations)
-- Hanya seed jika tabel masih kosong
-- ──────────────────────────────────────────────────────────
INSERT INTO public.venues (name, cryptic_caption, location_hint, image_url, display_order)
SELECT v.name, v.cryptic_caption, v.location_hint, v.image_url, v.display_order FROM (VALUES
    ('The Cliff Pavilion',  'Where the ocean answers your vows.',          'A coastline in the south.', '/images/hero.JPG',     0),
    ('The Garden Estate',   'Beneath century-old trees, time pauses.',     'A private estate.',          '/images/hangat.JPG',   1),
    ('The Heritage Hall',   'Walls that have witnessed dynasties.',        'A palatial residence.',      '/images/estetik.JPG',  2),
    ('The Rooftop Atrium',  'A celebration written across the skyline.',   'High above the city.',       '/images/tawalepas.JPG',3)
) AS v(name, cryptic_caption, location_hint, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.venues);

-- ──────────────────────────────────────────────────────────
-- 8. (OPSIONAL) Hapus partners lama jika tidak dipakai
-- Uncomment baris di bawah jika ingin membersihkan data partners
-- ──────────────────────────────────────────────────────────
-- DELETE FROM public.section_items WHERE section_name = 'partners';
-- DELETE FROM public.section_content WHERE section_name = 'partners';

-- ============================================================
-- SELESAI. Refresh aplikasi setelah menjalankan migration ini.
-- ============================================================
