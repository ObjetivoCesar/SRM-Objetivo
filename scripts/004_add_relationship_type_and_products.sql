-- Add relationship_type column to leads table
ALTER TABLE leads ADD COLUMN relationship_type TEXT;

-- Create products and services table
CREATE TABLE IF NOT EXISTS products_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id TEXT,
    name TEXT NOT NULL,
    price DECIMAL(10,2),
    description TEXT,
    benefits TEXT,
    blog_category TEXT,
    internal_category TEXT,
    tags TEXT,
    payment_type TEXT,
    video_link TEXT,
    included_services TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_services_name ON products_services(name);
CREATE INDEX IF NOT EXISTS idx_products_services_category ON products_services(internal_category);
CREATE INDEX IF NOT EXISTS idx_products_services_tags ON products_services USING gin(to_tsvector('spanish', tags));

-- Enable RLS
ALTER TABLE products_services ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON products_services
    FOR ALL USING (auth.role() = 'authenticated');
