DROP POLICY "Public can view active photo frames" ON public.photo_frames;
CREATE POLICY "Anyone can view active photo frames" ON public.photo_frames FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins can view all photo frames" ON public.photo_frames FOR SELECT TO authenticated USING (public.is_admin());