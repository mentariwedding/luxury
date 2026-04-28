-- ============================================================
-- MENTARI WEDDING — TOTAL RESET & SETUP
-- Jalankan ini di SQL Editor untuk menyamakan database dengan kode terbaru.
-- ============================================================

-- 1. BERSIHKAN SEMUA (Hapus tabel lama jika ada agar benar-benar fresh)
DROP TABLE IF EXISTS public.inquiry_clicks CASCADE;
DROP TABLE IF EXISTS public.venues CASCADE;
DROP TABLE IF EXISTS public.whispers CASCADE;
DROP TABLE IF EXISTS public.portfolio_gallery CASCADE;
DROP TABLE IF EXISTS public.section_items CASCADE;
DROP TABLE IF EXISTS public.section_content CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. TABEL PENGATURAN (Site Settings)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. TABEL KONTEN SECTION (Hero, Signature, dll)
CREATE TABLE public.section_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT,
    cta_link TEXT,
    image_url TEXT,
    video_url TEXT, -- Untuk video background Hero
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. TABEL WHISPERS (Poetic Quotes)
CREATE TABLE public.whispers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author TEXT,
    accent_word TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. TABEL VENUES (Curated Locations)
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cryptic_caption TEXT,
    location_hint TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. TABEL PORTFOLIO (Gallery)
CREATE TABLE public.portfolio_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. STORAGE SETUP (Bucket 'photos')
-- Membuat bucket jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. AKTIFKAN RLS & POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whispers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_gallery ENABLE ROW LEVEL SECURITY;

-- Read Access (Public)
CREATE POLICY "Public Read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.section_content FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.whispers FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.portfolio_gallery FOR SELECT USING (true);
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'photos');

-- Write Access (Admin Authenticated)
CREATE POLICY "Admin Manage Settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Content" ON public.section_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Whispers" ON public.whispers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Venues" ON public.venues FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Gallery" ON public.portfolio_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Storage" ON storage.objects FOR ALL USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- 9. SEED DATA AWAL (Konten Luxury)
INSERT INTO public.site_settings (key, value, description) VALUES
('whatsapp_number', '628123456789', 'WhatsApp Konsultasi'),
('instagram_url', 'https://instagram.com/mentariwedding', 'Instagram'),
('office_address', 'Jl. Kebon Pala 2 Cibadak, Sukabumi.', 'Alamat Kantor');

INSERT INTO public.section_content (section_name, title, subtitle, description, image_url, video_url) VALUES
('hero', 'Rayakan Cinta, Penuh Makna.', 'Merangkai Momen', 'Cerita unik yang layak dirayakan.', '/images/hero.JPG', '/images/hero.mp4'),
('whisper', 'Some moments are not planned, they are summoned.', 'A Whisper', 'Keheningan di balik setiap kemewahan.', NULL, NULL),
('manifesto', 'By Inquiry Only.', 'Selectively Curated', 'Setiap cerita layak mendapatkan ruang yang utuh.', NULL, NULL);

INSERT INTO public.whispers (quote, accent_word, display_order) VALUES
('In the silence between vows, we craft memories.', 'silence', 0),
('We do not chase trends. We invite timelessness.', 'timelessness', 1);

INSERT INTO public.venues (name, cryptic_caption, image_url, display_order) VALUES
('The Cliff Pavilion', 'Where the ocean answers your vows.', '/images/hero.JPG', 0),
('The Garden Estate', 'Beneath century-old trees.', '/images/hangat.JPG', 1);
