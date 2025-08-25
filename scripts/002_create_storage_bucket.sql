-- Create storage bucket for lead files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lead-files', 'lead-files', false);

-- Create policy for authenticated users to upload files
CREATE POLICY "Users can upload lead files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lead-files');

-- Create policy for authenticated users to view files
CREATE POLICY "Users can view lead files" ON storage.objects
FOR SELECT USING (bucket_id = 'lead-files');
