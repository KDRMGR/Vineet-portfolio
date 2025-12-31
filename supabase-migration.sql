-- Migration: Add gallery_settings table for layout preferences
-- This file can be run in Supabase SQL Editor

-- Create gallery_settings table
CREATE TABLE IF NOT EXISTS gallery_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT UNIQUE NOT NULL,
  layout_type TEXT NOT NULL DEFAULT 'grid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster lookups
CREATE INDEX IF NOT EXISTS idx_gallery_settings_category ON gallery_settings(category);

-- Add RLS policies
ALTER TABLE gallery_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON gallery_settings
  FOR SELECT
  USING (true);

-- Allow insert/update/delete for authenticated users only
CREATE POLICY "Allow authenticated insert" ON gallery_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON gallery_settings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete" ON gallery_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default settings for all categories
INSERT INTO gallery_settings (category, layout_type) VALUES
  ('fashion', 'grid'),
  ('people', 'grid'),
  ('concerts', 'grid'),
  ('corporate', 'grid'),
  ('nightlife', 'grid'),
  ('wedding', 'grid'),
  ('corporate-cine', 'grid'),
  ('concerts-cine', 'grid'),
  ('commercial', 'grid'),
  ('events', 'grid'),
  ('documentary', 'grid'),
  ('live', 'grid')
ON CONFLICT (category) DO NOTHING;
