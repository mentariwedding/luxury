-- 1. Tabel untuk Pengaturan Kontak & Sosial Media
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabel untuk Konten Teks di Setiap Section (Hero, Signature, dll)
CREATE TABLE IF NOT EXISTS public.section_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT,
    cta_link TEXT,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabel untuk Item/List di Setiap Section (Approach Steps, Philosophy Features, Atelier Pillars, Partners)
CREATE TABLE IF NOT EXISTS public.section_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    tag TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabel untuk Galeri Portfolio (Momen Abadi)
CREATE TABLE IF NOT EXISTS public.portfolio_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabel Profil Admin
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AKTIFKAN RLS (Row Level Security)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- BUAT POLICY: Publik bisa baca, hanya Admin (Authenticated) yang bisa edit
-- Policy untuk Read (Semua orang)
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read section_content" ON public.section_content FOR SELECT USING (true);
CREATE POLICY "Public can read section_items" ON public.section_items FOR SELECT USING (true);
CREATE POLICY "Public can read portfolio_gallery" ON public.portfolio_gallery FOR SELECT USING (true);

-- Policy untuk Write/Update (Hanya Admin terautentikasi)
CREATE POLICY "Admins can manage site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage section_content" ON public.section_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage section_items" ON public.section_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage portfolio_gallery" ON public.portfolio_gallery FOR ALL USING (auth.role() = 'authenticated');

-- INSERT DATA AWAL (SEEDING)
-- Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
('whatsapp_number', '628123456789', 'Nomor WhatsApp untuk konsultasi'),
('instagram_url', 'https://instagram.com/mentariwedding', 'Link profil Instagram'),
('pinterest_url', '#', 'Link profil Pinterest'),
('map_coordinates', '-6.887298081773353, 106.77632655353484', 'Koordinat Google Maps'),
('office_address', 'Jl. Kebon Pala 2 Cibadak, Sukabumi, Jawa Barat, 43351.', 'Alamat kantor fisik');

-- Section Content
INSERT INTO public.section_content (section_name, title, subtitle, description, image_url) VALUES
('hero', 'Rayakan Cinta, Penuh Makna.', 'Merangkai Momen dengan Ketulusan', 'Kami percaya setiap pernikahan adalah cerita unik yang layak dirayakan dengan sempurna.', '/images/hero.JPG'),
('signature', 'Sentuhan yang Abadi & Timeless.', 'Karakter Kami', 'Di Mentari Wedding, kami tidak mengejar tren yang cepat hilang. Kami berfokus pada estetika yang akan tetap terlihat indah puluhan tahun dari sekarang.', '/images/signature.JPG'),
('approach', 'Cara Kami Bekerja.', 'Metode Kami', 'Kami percaya kemewahan sejati ada pada detail yang mencerminkan kejujuran perasaan Anda.', '/images/pendekatan.JPG'),
('philosophy', 'Dedikasi untuk Hari Anda', 'Filosofi Mentari Wedding', NULL, NULL),
('atelier', 'Estetika Kami.', 'The Atelier', 'Keindahan sejati lahir dari detail yang sederhana namun bermakna.', NULL),
('partners', NULL, NULL, NULL, NULL);

-- Section Items: Approach Steps
INSERT INTO public.section_items (section_name, title, icon_name, description, display_order) VALUES
('approach', 'Visi', 'Compass', 'Kami mendengar cerita Anda untuk menciptakan konsep yang benar-benar pribadi.', 0),
('approach', 'Detail', 'PenTool', 'Semua elemen, dari warna hingga alur acara, kami susun dengan rapi dan teliti.', 1),
('approach', 'Eksekusi', 'Heart', 'Kami pastikan semua berjalan lancar agar Anda bisa menikmati momen tanpa beban.', 2);

-- Section Items: Philosophy Features
INSERT INTO public.section_items (section_name, title, icon_name, description, display_order) VALUES
('philosophy', 'Eksklusif', 'Diamond', 'Kami hanya melayani sedikit klien untuk memastikan setiap pernikahan mendapatkan perhatian penuh.', 0),
('philosophy', 'Personal', 'Feather', 'Setiap dekorasi dan alur acara kami buat khusus sesuai dengan karakter unik Anda.', 1),
('philosophy', 'Tenang', 'ShieldCheck', 'Kami menjaga semua detail teknis agar Anda bisa menikmati hari bahagia dengan tenang.', 2);

-- Section Items: Atelier Pillars
INSERT INTO public.section_items (section_name, title, tag, description, image_url, display_order) VALUES
('atelier', 'Sentuhan Halus', 'Material', 'Kami memilih material berkualitas—dari kain sutra hingga detail terkecil—untuk memberikan kenyamanan yang elegan.', '/images/sentuhan.JPG', 0),
('atelier', 'Ruang yang Seimbang', 'Harmoni', 'Setiap elemen ditata dengan rapi agar menciptakan suasana yang indah dan menenangkan mata.', '/images/ruang.JPG', 1),
('atelier', 'Suasana Hangat', 'Cahaya', 'Pencahayaan yang diatur dengan tepat untuk membangun emosi dan kehangatan di setiap sudut acara.', '/images/suasana.JPG', 2);

-- Section Items: Partners
INSERT INTO public.section_items (section_name, title, display_order) VALUES
('partners', 'BVLGARI', 0),
('partners', 'VERA WANG', 1),
('partners', 'RITZ-CARLTON', 2),
('partners', 'CARTIER', 3),
('partners', 'DIOR', 4),
('partners', 'VOGUE', 5);

-- Portfolio Gallery: Momen Abadi
INSERT INTO public.portfolio_gallery (title, category, image_url, is_featured, display_order) VALUES
('Pesta Penuh Tawa', 'Tawa Lepas', '/images/tawalepas.JPG', true, 0),
('Detail Penuh Makna', 'Hangat', '/images/hangat.JPG', false, 1),
('Momen Tak Terlupakan', 'Estetik', '/images/estetik.JPG', false, 2);
