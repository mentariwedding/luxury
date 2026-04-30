-- ============================================================
-- MENTARI WEDDING — RESTORE DATA
-- Mengembalikan whispers & venues ke data ORIGINAL (English)
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- ── 1. Hapus data Indonesia yang masuk dari V3 lama ──
DELETE FROM public.whispers;
DELETE FROM public.venues;

-- ── 2. Restore Whispers (data asli English) ──
INSERT INTO public.whispers (quote, accent_word, display_order) VALUES
    ('Some moments are not planned. They are summoned.',           'summoned',     0),
    ('In the silence between vows, we craft the loudest memories.','silence',      1),
    ('We do not chase trends. We invite timelessness.',            'timelessness', 2),
    ('Every flame, every fold, every footstep—intentional.',       'intentional',  3),
    ('A celebration is a sentence written in candlelight.',        'candlelight',  4);

-- ── 3. Restore Venues (data asli English) ──
INSERT INTO public.venues (name, cryptic_caption, location_hint, image_url, display_order) VALUES
    ('The Cliff Pavilion',  'Where the ocean answers your vows.',          'A coastline in the south.', '/images/hero.JPG',     0),
    ('The Garden Estate',   'Beneath century-old trees, time pauses.',     'A private estate.',          '/images/hangat.JPG',   1),
    ('The Heritage Hall',   'Walls that have witnessed dynasties.',        'A palatial residence.',      '/images/estetik.JPG',  2),
    ('The Rooftop Atrium',  'A celebration written across the skyline.',   'High above the city.',       '/images/tawalepas.JPG',3);

-- ── 4. Restore section_content (jika subtitle/desc ikut berubah) ──
UPDATE public.section_content SET
    subtitle = 'A Whisper',
    description = 'Bukan sekadar pesta. Bukan sekadar dekorasi. Ada keheningan di balik setiap kemewahan—dan di sanalah kami bekerja.'
WHERE section_name = 'whisper';

UPDATE public.section_content SET
    title = 'A Curated Atlas.',
    subtitle = 'Selected Locations',
    description = 'Setiap pernikahan memiliki tempatnya sendiri—dan setiap tempat memiliki ceritanya. Berikut beberapa lokasi pilihan yang pernah kami rangkai.'
WHERE section_name = 'venues';

-- ============================================================
-- SELESAI. Homepage kembali ke bahasa campuran (English branding + Indo narasi).
-- ============================================================
