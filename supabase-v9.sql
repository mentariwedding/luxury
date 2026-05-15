-- ═══════════════════════════════════════════════════════════════
-- Mentari Wedding — Supabase Migration v9
-- Features: Video Testimonials, Venue Maps, Journal Gallery,
--           Package Tiers, Newsletter Subscribers
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Video support for testimonials ───────────────────────
ALTER TABLE testimonials
    ADD COLUMN IF NOT EXISTS video_url       text,
    ADD COLUMN IF NOT EXISTS video_thumbnail text;

COMMENT ON COLUMN testimonials.video_url       IS 'Optional short video from couple (MP4/WebM URL)';
COMMENT ON COLUMN testimonials.video_thumbnail IS 'Poster image for the video player';

-- ─── 2. Map coordinates for venues ───────────────────────────
ALTER TABLE venues
    ADD COLUMN IF NOT EXISTS map_coordinates text;

COMMENT ON COLUMN venues.map_coordinates IS 'GPS coordinates "lat, lng" for Google Maps link';

-- ─── 3. Journal gallery images ────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_images (
    id                 uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
    journal_entry_id   uuid    NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    image_url          text    NOT NULL,
    caption            text    DEFAULT '',
    display_order      integer DEFAULT 0,
    created_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_images_entry
    ON journal_images(journal_entry_id, display_order);

ALTER TABLE journal_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read journal_images"
        ON journal_images FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Auth manage journal_images"
        ON journal_images FOR ALL
        USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 4. Package tiers (uses existing section_items) ──────────
-- Tambah kolom baru ke section_items yang belum ada
ALTER TABLE section_items
    ADD COLUMN IF NOT EXISTS subtitle   text,
    ADD COLUMN IF NOT EXISTS cta_text   text,
    ADD COLUMN IF NOT EXISTS icon_name  text;

COMMENT ON COLUMN section_items.subtitle  IS 'Subtitle opsional untuk item (dipakai oleh Packages, Atelier, dll)';
COMMENT ON COLUMN section_items.cta_text  IS 'Teks CTA / mood / atmosphere per item';
COMMENT ON COLUMN section_items.icon_name IS 'Nama icon (Lucide) atau simbol unicode';

-- Insert default tiers if not already present
INSERT INTO section_items
    (section_name, title, subtitle, tag, description, cta_text, icon_name, display_order, is_active)
SELECT
    'packages', 'Intimate', 'Perayaan yang Berbisik', 'Di bawah 150 tamu',
    E'Untuk mereka yang percaya bahwa kedalaman lebih bermakna dari keramaian.\n\n- Perhatian eksklusif tim Mentari\n- Dekorasi custom setiap sudut\n- Timeline yang sangat personal\n- Koordinasi vendor terpilih',
    'Garden · Intimate Dining · Quiet Grandeur', '◇', 0, true
WHERE NOT EXISTS (
    SELECT 1 FROM section_items WHERE section_name = 'packages' AND title = 'Intimate'
);

INSERT INTO section_items
    (section_name, title, subtitle, tag, description, cta_text, icon_name, display_order, is_active)
SELECT
    'packages', 'Grand Soiree', 'Perayaan yang Berbicara', 'Di atas 150 tamu',
    E'Untuk perayaan yang ingin meninggalkan kesan tak terlupakan.\n\n- Tim Mentari lengkap on-site\n- Statement décor yang memukau\n- Full production management\n- Multi-vendor coordination',
    'Ballroom · Statement Pieces · Timeless Grandeur', '◆', 1, true
WHERE NOT EXISTS (
    SELECT 1 FROM section_items WHERE section_name = 'packages' AND title = 'Grand Soiree'
);

-- ─── 5. Newsletter subscribers ────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id         uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
    email      text    NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow anonymous insert newsletter"
        ON newsletter_subscribers FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Auth read newsletter"
        ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 6. section_content rows yang belum di-seed ─────────────
-- Mencegah 406 error di semua komponen yang pakai .single()

INSERT INTO section_content (section_name, title, subtitle, description)
SELECT 'approach', 'Cara Kami Bekerja.', 'Metode Kami',
    'Kami percaya kemewahan sejati ada pada detail yang mencerminkan kejujuran perasaan Anda.'
WHERE NOT EXISTS (SELECT 1 FROM section_content WHERE section_name = 'approach');

INSERT INTO section_content (section_name, title, subtitle, description)
SELECT 'atelier', 'Estetika Kami.', 'The Atelier',
    'Keindahan sejati lahir dari detail yang sederhana namun bermakna.'
WHERE NOT EXISTS (SELECT 1 FROM section_content WHERE section_name = 'atelier');

INSERT INTO section_content (section_name, title, subtitle, description, image_url)
SELECT 'signature', 'Sentuhan yang Abadi & Timeless.', 'Karakter Kami',
    E'Di Mentari Wedding, kami tidak mengejar tren yang cepat hilang.\n\nSetiap acara yang kami tangani memiliki ciri khas: perpaduan antara kemewahan yang tenang, detail yang rapi, dan suasana yang hangat.',
    '/images/signature.JPG'
WHERE NOT EXISTS (SELECT 1 FROM section_content WHERE section_name = 'signature');

INSERT INTO section_content (section_name, title, subtitle)
SELECT 'philosophy', 'Dedikasi untuk Hari Anda', 'Filosofi Mentari Wedding'
WHERE NOT EXISTS (SELECT 1 FROM section_content WHERE section_name = 'philosophy');

INSERT INTO section_content (section_name, title, subtitle, description)
SELECT 'packages', 'Dua Cara Merayakan Cinta.', 'The Experience',
    'Setiap perayaan adalah sebuah pernyataan. Kami membantu Anda menemukan suara yang paling berbicara untuk cerita Anda.'
WHERE NOT EXISTS (SELECT 1 FROM section_content WHERE section_name = 'packages');

-- ─── 7. Video Reel section_content row ───────────────────
-- Diperlukan agar Highlight Reel bisa dikelola dari Admin → Konten
INSERT INTO section_content (section_name, title, subtitle, description, video_url, image_url)
SELECT
    'video_reel',
    'Highlight Reel',
    'A Glimpse',
    'Cuplikan momen terbaik dari perayaan yang pernah kami rangkai.',
    '/videos/highlight.mp4',
    '/images/hero.JPG'
WHERE NOT EXISTS (
    SELECT 1 FROM section_content WHERE section_name = 'video_reel'
);

-- ─── 7. Dynamic slots settings ──────────────────────────
INSERT INTO site_settings (key, value)
VALUES ('slots_remaining', '3'), ('slots_year', '2026')
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- End of v9 Migration
-- Run this in Supabase SQL Editor > New Query > Run All
-- ═══════════════════════════════════════════════════════════════
