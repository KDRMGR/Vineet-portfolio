
-- Add image_url column to gallery_sections table
ALTER TABLE gallery_sections 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update the type definition in comments for reference
-- gallery_sections: id, category, name, order_index, created_at, image_url
