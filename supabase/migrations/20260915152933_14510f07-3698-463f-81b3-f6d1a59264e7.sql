CREATE TABLE public.photo_frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  price numeric(12,2) NOT NULL DEFAULT 0,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.photo_frames TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_frames TO authenticated;
GRANT ALL ON public.photo_frames TO service_role;

ALTER TABLE public.photo_frames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active photo frames"
ON public.photo_frames FOR SELECT
USING (is_active OR public.is_admin());

CREATE POLICY "Admins manage photo frames"
ON public.photo_frames FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE TRIGGER trg_photo_frames_updated
BEFORE UPDATE ON public.photo_frames
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
