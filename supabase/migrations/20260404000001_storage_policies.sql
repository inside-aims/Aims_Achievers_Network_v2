-- Storage RLS policies for nominee-photos bucket

-- Allow anyone to upload photos (public nomination submissions)
create policy "public upload nominee photos"
on storage.objects for insert
with check (bucket_id = 'nominee-photos');

-- Allow public read (serve nominee photos in the UI)
create policy "public read nominee photos"
on storage.objects for select
using (bucket_id = 'nominee-photos');

-- Allow replacement of own uploads (same path)
create policy "public update nominee photos"
on storage.objects for update
using (bucket_id = 'nominee-photos');
