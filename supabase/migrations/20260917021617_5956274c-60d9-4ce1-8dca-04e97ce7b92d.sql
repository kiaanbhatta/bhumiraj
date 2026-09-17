GRANT SELECT ON public.photo_frames TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_frames TO authenticated;
GRANT ALL ON public.photo_frames TO service_role;