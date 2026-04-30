-- ============================================================
-- MENTARI WEDDING — MIGRATION V5
-- inquiry_submissions table untuk Smart Inquiry Form
-- Jalankan SETELAH supabase-v4.sql
-- AMAN dijalankan berkali-kali (idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inquiry_submissions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initials      TEXT NOT NULL,                        -- e.g. "A & B"
    wedding_date  DATE,
    guest_range   TEXT DEFAULT '',                      -- e.g. "100 – 200 tamu"
    aesthetic     TEXT DEFAULT '',                      -- pilihan estetika
    message       TEXT DEFAULT '',                      -- pesan optional
    status        TEXT DEFAULT 'new'
                  CHECK (status IN ('new','contacted','booked','declined')),
    source        TEXT DEFAULT 'inquiry_form',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast status filtering in admin
CREATE INDEX IF NOT EXISTS idx_inquiry_status ON public.inquiry_submissions(status);
CREATE INDEX IF NOT EXISTS idx_inquiry_created ON public.inquiry_submissions(created_at DESC);

-- RLS
ALTER TABLE public.inquiry_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiry_submissions;
CREATE POLICY "Public can insert inquiries" ON public.inquiry_submissions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read and manage inquiries" ON public.inquiry_submissions;
CREATE POLICY "Admins can read and manage inquiries" ON public.inquiry_submissions
    FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_inquiry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_inquiry_updated_at ON public.inquiry_submissions;
CREATE TRIGGER set_inquiry_updated_at
    BEFORE UPDATE ON public.inquiry_submissions
    FOR EACH ROW EXECUTE FUNCTION update_inquiry_timestamp();
