-- Create leads table for Recorridos module
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  connection_type TEXT, -- Formal, Semiformal, Informal
  business_activity TEXT,
  interested_product TEXT,
  verbal_agreements TEXT,
  personality_type TEXT, -- Lógico/Analítico, Emocional/Expresivo, etc.
  communication_style TEXT,
  key_phrases TEXT,
  strengths TEXT,
  weaknesses TEXT,
  opportunities TEXT,
  threats TEXT,
  status TEXT DEFAULT 'nuevo', -- nuevo, contactado, cotizado, cerrado
  phase INTEGER DEFAULT 1, -- 1-4 phases of capture
  files JSONB DEFAULT '[]'::jsonb, -- Array of uploaded file URLs
  audio_transcriptions JSONB DEFAULT '[]'::jsonb, -- Array of transcribed audio
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all leads (for now, since Michael has absolute permissions)
CREATE POLICY "Allow all operations on leads" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for lead files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-files', 'lead-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for lead files
CREATE POLICY "Allow all operations on lead files" ON storage.objects
  FOR ALL USING (bucket_id = 'lead-files') WITH CHECK (bucket_id = 'lead-files');
