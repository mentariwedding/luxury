-- ============================================================
-- MENTARI WEDDING — MIGRATION V6
-- journal_entries table untuk halaman /kisah
-- Jalankan SETELAH supabase-v5.sql
-- AMAN dijalankan berkali-kali (idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    tagline       TEXT DEFAULT '',              -- 1-2 kalimat intro
    content       TEXT DEFAULT '',              -- cerita panjang (plain text / markdown)
    cover_image   TEXT DEFAULT '',              -- URL gambar cover
    aesthetic_tag TEXT DEFAULT '',              -- Romantic / Natural / Bold / dll
    venue_hint    TEXT DEFAULT '',              -- "Lereng Gunung, Sukabumi"
    season        TEXT DEFAULT '',              -- "Musim Hujan 2024"
    is_published  BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_slug       ON public.journal_entries(slug);
CREATE INDEX IF NOT EXISTS idx_journal_published  ON public.journal_entries(is_published);
CREATE INDEX IF NOT EXISTS idx_journal_order      ON public.journal_entries(display_order);

-- RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published journals" ON public.journal_entries;
CREATE POLICY "Public can read published journals" ON public.journal_entries
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage journals" ON public.journal_entries;
CREATE POLICY "Admins can manage journals" ON public.journal_entries
    FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_journal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_journal_updated_at ON public.journal_entries;
CREATE TRIGGER set_journal_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_journal_timestamp();

-- Seed data — 3 contoh cerita
INSERT INTO public.journal_entries (title, slug, tagline, content, aesthetic_tag, venue_hint, season, is_published, display_order)
SELECT v.title, v.slug, v.tagline, v.content, v.aesthetic_tag, v.venue_hint, v.season, v.is_published, v.display_order
FROM (VALUES
    (
        'Sebuah Sabtu di Lereng Gunung',
        'sabtu-di-lereng-gunung',
        'Ketika kabut turun tepat saat ijab kabul, kami tahu alam pun ikut menjadi saksi.',
        'Ada pagi-pagi yang terasa berbeda. Bukan karena cuacanya cerah — justru karena tidak. Kabut tipis menyelimuti lereng ketika kami tiba, dan para tamu sudah duduk tenang di antara pepohonan pinus yang basah. Tidak ada musik keras. Tidak ada confetti. Hanya suara angin dan doa yang mengalir pelan.

Pasangan ini sudah kami kenal delapan bulan sebelumnya. Mereka tahu persis apa yang mereka inginkan: bukan kemewahan yang mencolok, tapi keintiman yang tidak bisa dibeli. Kami merancang seluruh pernikahan itu di sekitar satu frasa yang mereka berikan kepada kami: "Seperti pulang ke rumah."

Bunga-bunga dipilih dari kebun tetangga — bukan dari florist besar. Meja makan ditutupi kain linen tua yang sudah dicuci berulang kali hingga terasa seperti bagian dari alam. Dan ketika mereka berjanji, kabut itu seolah berhenti sejenak, sebelum kembali memeluk semuanya.',
        'Natural', 'Lereng Gunung, Sukabumi Selatan', 'Musim Hujan 2024', true, 0
    ),
    (
        'Ketika Hujan Menjadi Bagian dari Rencananya',
        'ketika-hujan-menjadi-rencana',
        'Tidak ada yang bisa mengontrol cuaca. Tapi ada yang bisa memilih cara merayakannya.',
        'Prakiraan cuaca di hari itu mengatakan: hujan seharian. Banyak WO yang akan panik. Kami tidak. Kami sudah menyiapkan dua skenario, tapi sebenarnya dalam hati kami berharap hujan itu datang.

Ada sesuatu yang magis ketika pernikahan dirayakan di tengah hujan. Suara rintiknya mengisi jeda percakapan. Refleksinya di lantai marmer menciptakan efek yang tidak ada photographer manapun bisa rencanakan. Dan ketika mempelai wanita berjalan melewati koridor itu, dengan payung transparan dan senyum yang tidak bisa disembunyikan — semua orang di ruangan itu berhenti bernapas sejenak.

Kami belajar dari pernikahan ini bahwa rencana terbaik adalah rencana yang cukup longgar untuk membiarkan kehidupan nyata masuk ke dalamnya.',
        'Elegant', 'Kediaman Keluarga, Bogor', 'Musim Hujan 2023', true, 1
    ),
    (
        'Taman yang Sudah Menunggu Dua Tahun',
        'taman-yang-menunggu',
        'Mereka menunda pernikahannya dua kali. Ketika akhirnya tiba, semuanya terasa sempurna karena memang sudah saatnya.',
        'Dua tahun adalah waktu yang lama untuk menunggu. Tapi ketika pasangan ini akhirnya mengucapkan janji mereka di taman yang sudah mereka pilih sejak awal, tidak ada yang terasa tertunda. Semuanya terasa tepat waktu.

Taman itu berada di belakang kediaman keluarga besar — sebuah ruang hijau yang sudah ada sejak sebelum mereka lahir. Pohon mangga besar di sudut barat menjadi latar foto yang tidak bisa kami rencanakan. Kursi-kursi kayu yang sudah lapuk justru memberikan karakter yang tidak ada furniture sewaan manapun bisa meniru.

Kami hanya mengatur cahaya dan bunga. Sisanya sudah disediakan oleh waktu dan cinta.',
        'Romantic', 'Taman Keluarga, Sukabumi Utara', 'Musim Kemarau 2024', true, 2
    )
) AS v(title, slug, tagline, content, aesthetic_tag, venue_hint, season, is_published, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.journal_entries LIMIT 1);
