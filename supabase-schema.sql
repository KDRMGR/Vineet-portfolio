-- Create content table for managing website text content
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Create gallery_images table for managing portfolio images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(category, order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to content" ON content
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gallery_images" ON gallery_images
  FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage content
CREATE POLICY "Allow authenticated users to insert content" ON content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update content" ON content
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete content" ON content
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert gallery_images" ON gallery_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery_images" ON gallery_images
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete gallery_images" ON gallery_images
  FOR DELETE TO authenticated USING (true);

-- Insert default content
INSERT INTO content (section, key, value) VALUES
  ('hero', 'name', 'Vineet Labdhe'),
  ('hero', 'title', 'Portfolio'),
  ('hero', 'subtitle', 'Visual Storyteller'),
  ('hero', 'tagline', 'Photographer | Cinematographer'),
  ('about', 'heading', 'What I Do'),
  ('about', 'paragraph1', 'I am a commercial event photographer and videographer with a strong foundation in mass media and hands-on experience across corporate events, conferences, concerts, and live shows. Each project adds productive, on-ground experience to my journey, cultivating dedication, precision, and professionalism while delivering visuals that meet industry standards.'),
  ('about', 'paragraph2', 'The course of my journey has led me to discover my ability to capture moments and create enticing visuals. As a visual storyteller, I specialize in bringing stories to life through the lens, combining technical expertise with artistic vision.'),
  ('contact', 'email', 'contact@vineetlabdhe.com'),
  ('contact', 'phone', '+91 845 487 1977'),
  ('contact', 'location', 'Mumbai, Maharashtra, India'),
  ('contact', 'linkedin', 'https://linkedin.com'),
  ('contact', 'instagram', 'https://instagram.com')
ON CONFLICT (section, key) DO NOTHING;

-- Insert sample gallery images
INSERT INTO gallery_images (category, image_url, title, description, order_index) VALUES
  ('fashion', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop', 'Fashion Editorial 1', 'Professional fashion photography', 0),
  ('fashion', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop', 'Fashion Editorial 2', 'Lifestyle shoot', 1),
  ('concerts', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop', 'Live Concert 1', 'Concert photography', 0),
  ('concerts', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop', 'Live Concert 2', 'Music event coverage', 1),
  ('corporate', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', 'Corporate Event 1', 'Professional conference', 0),
  ('corporate', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop', 'Corporate Event 2', 'Business seminar', 1),
  ('people', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop', 'Portrait 1', 'Professional portrait', 0),
  ('people', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', 'Portrait 2', 'Location photography', 1),
  ('nightlife', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop', 'Nightlife 1', 'Night scene photography', 0),
  ('nightlife', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop', 'Nightlife 2', 'Club photography', 1)
ON CONFLICT DO NOTHING;
