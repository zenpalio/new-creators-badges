
CREATE POLICY "drama-shots public read" ON storage.objects FOR SELECT USING (bucket_id = 'drama-shots');
CREATE POLICY "drama-shots public write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'drama-shots');
CREATE POLICY "drama-shots public delete" ON storage.objects FOR DELETE USING (bucket_id = 'drama-shots');
