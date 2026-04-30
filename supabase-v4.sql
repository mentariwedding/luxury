-- ============================================================
-- MENTARI WEDDING — MIGRATION V4 (Luxury Upgrade Session)
-- Jalankan SETELAH supabase-v3.sql sudah ada
-- File ini AMAN di-run berkali-kali (idempotent)
-- TIDAK menghapus data yang sudah ada!
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Tabel TESTIMONIALS — "Whisper from Our Couples"
--    Query oleh: src/components/Testimonial.jsx
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote         TEXT NOT NULL,
    initials      TEXT NOT NULL,                     -- contoh: "R & D"
    year          TEXT DEFAULT '2024',
    venue_hint    TEXT DEFAULT '',                   -- contoh: "Taman pribadi Sukabumi"
    is_active     BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read testimonials" ON public.testimonials;
CREATE POLICY "Public can read testimonials" ON public.testimonials
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
    FOR ALL USING (auth.role() = 'authenticated');

-- SEED testimonials — Hanya insert jika tabel masih kosong
INSERT INTO public.testimonials (quote, initials, year, venue_hint, display_order)
SELECT v.quote, v.initials, v.year, v.venue_hint, v.display_order
FROM (VALUES
    (
        'Mentari memahami apa yang kami inginkan bahkan sebelum kami bisa menjelaskannya.',
        'R & D', '2024', 'Sebuah taman pribadi di Sukabumi', 0
    ),
    (
        'Bukan sekadar event organizer. Mereka adalah penjaga momen yang paling berharga dalam hidup kami.',
        'A & F', '2024', 'Pavilion tepi danau, Bogor', 1
    ),
    (
        'Setiap detail terasa seperti surat cinta yang tersembunyi—hanya untuk kami berdua.',
        'S & M', '2023', 'Kediaman keluarga, Sukabumi Selatan', 2
    )
) AS v(quote, initials, year, venue_hint, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);

-- ──────────────────────────────────────────────────────────
-- 2. Tabel MOOD_PALETTES — Inspirasi Estetika (MoodBoard)
--    Query oleh: src/components/MoodBoard.jsx
--    Kolom colors & keywords: disimpan sebagai TEXT (JSON array string)
--    Format: '["#E8D0C0","#F5EDE6","#C9A9A6","#8B6B5D"]'
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mood_palettes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    keywords      JSONB DEFAULT '[]',               -- ["Romantic","Soft","Garden"]
    colors        JSONB DEFAULT '[]',               -- ["#hex1","#hex2","#hex3","#hex4"]
    mood          TEXT DEFAULT '',
    image_url     TEXT DEFAULT '/images/hero.JPG',
    is_active     BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mood_palettes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read mood_palettes" ON public.mood_palettes;
CREATE POLICY "Public can read mood_palettes" ON public.mood_palettes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage mood_palettes" ON public.mood_palettes;
CREATE POLICY "Admins can manage mood_palettes" ON public.mood_palettes
    FOR ALL USING (auth.role() = 'authenticated');

-- SEED mood_palettes — Hanya insert jika tabel masih kosong
INSERT INTO public.mood_palettes (name, keywords, colors, mood, image_url, display_order)
SELECT v.name, v.keywords::jsonb, v.colors::jsonb, v.mood, v.image_url, v.display_order
FROM (VALUES
    (
        'Dusty Rose & Ivory',
        '["Romantic","Soft","Garden"]',
        '["#E8D0C0","#F5EDE6","#C9A9A6","#8B6B5D"]',
        'Untuk cerita yang berbisik lembut di antara kelopak bunga.',
        '/images/sentuhan.JPG',
        0
    ),
    (
        'Midnight & Gold',
        '["Bold","Timeless","Formal"]',
        '["#1A1A2E","#2D2B55","#CEB175","#E8D399"]',
        'Untuk perayaan yang memanggil bintang turun ke bumi.',
        '/images/ruang.JPG',
        1
    ),
    (
        'Sage & Cream',
        '["Natural","Earthy","Serene"]',
        '["#87A878","#C8CDA0","#F0EAD6","#D4C5A9"]',
        'Untuk momen yang terasa seperti napas panjang di pagi hari.',
        '/images/suasana.JPG',
        2
    )
) AS v(name, keywords, colors, mood, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.mood_palettes);

-- ──────────────────────────────────────────────────────────
-- 3. SEED SECTION_CONTENT — Tambah rows untuk section baru
--    agar tampil di Admin Panel -> Manajemen Konten
-- ──────────────────────────────────────────────────────────

-- Testimonial section content record
INSERT INTO public.section_content (section_name, title, subtitle, description)
SELECT 'testimonial', 'Whisper from Our Couples', 'Voices', 'Kata-kata dari pasangan yang telah mempercayakan hari istimewa mereka kepada Mentari.'
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'testimonial');

-- MoodBoard section content record
INSERT INTO public.section_content (section_name, title, subtitle, description)
SELECT 'moodboard', 'Temukan Gaya Anda', 'Inspirasi Estetika', 'Setiap pasangan membawa warna mereka sendiri. Kami membantu menemukan mana yang paling berbicara untuk hari Anda.'
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'moodboard');

-- ──────────────────────────────────────────────────────────
-- 4. HAPUS section_content yang tidak lagi digunakan di frontend
--    (whisper & social_proof sudah dihapus dari page.jsx)
--    AMAN: data tidak akan hilang, hanya hidden dari admin list
--    Uncomment baris di bawah jika ingin benar-benar menghapus:
-- ──────────────────────────────────────────────────────────
-- DELETE FROM public.section_content WHERE section_name IN ('whisper', 'social_proof');
-- DELETE FROM public.section_items WHERE section_name = 'social_proof';

-- ──────────────────────────────────────────────────────────
-- 5. Tambah kolom inquiry_source baru ke inquiry_clicks
--    agar source dari MoodBoard & Atelier Lookbook bisa di-track
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.inquiry_clicks
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- ============================================================
-- SELESAI — Cara penggunaan:
-- 1. Buka Supabase Dashboard -> SQL Editor
-- 2. Paste seluruh isi file ini
-- 3. Klik "Run"
-- 4. Refresh aplikasi
--
-- Catatan: Tabel testimonials & mood_palettes memiliki
-- fallback defaults di komponen React jika tabel kosong,
-- jadi aplikasi tetap berjalan normal meski sebelum migration.
-- ============================================================
