CREATE TABLE public.frame_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  frame_id uuid REFERENCES public.photo_frames(id) ON DELETE SET NULL,
  frame_name text NOT NULL,
  frame_size text NOT NULL DEFAULT '',
  unit_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_price numeric NOT NULL DEFAULT 0,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.frame_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.frame_orders TO authenticated;
GRANT ALL ON public.frame_orders TO service_role;

ALTER TABLE public.frame_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a frame order"
  ON public.frame_orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage frame orders"
  ON public.frame_orders FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER update_frame_orders_updated_at
  BEFORE UPDATE ON public.frame_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();