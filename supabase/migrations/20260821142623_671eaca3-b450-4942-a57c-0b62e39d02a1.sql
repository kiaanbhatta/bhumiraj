-- Enums
CREATE TYPE public.stock_movement_type AS ENUM ('opening','restock','sale','return','adjustment','damage','loss');
CREATE TYPE public.sale_status AS ENUM ('completed','partially_returned','returned','void');

-- Payment methods
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage payment_methods" ON public.payment_methods FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products / items
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'General',
  description text NOT NULL DEFAULT '',
  purchase_price numeric(12,2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  selling_price numeric(12,2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold integer NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_active_idx ON public.products (is_active);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sales
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  sale_date timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL DEFAULT '',
  subtotal numeric(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total numeric(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  refunded_total numeric(12,2) NOT NULL DEFAULT 0 CHECK (refunded_total >= 0),
  payment_method text NOT NULL DEFAULT 'cash',
  status public.sale_status NOT NULL DEFAULT 'completed',
  note text NOT NULL DEFAULT '',
  client_token text UNIQUE,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sales_date_idx ON public.sales (sale_date DESC);
CREATE INDEX sales_payment_idx ON public.sales (payment_method);
GRANT SELECT, INSERT, UPDATE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read sales" ON public.sales FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update sales" ON public.sales FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sale items (historical snapshot; product deletion keeps history)
CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  sku text NOT NULL DEFAULT '',
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total numeric(12,2) NOT NULL CHECK (line_total >= 0),
  returned_quantity integer NOT NULL DEFAULT 0 CHECK (returned_quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sale_items_return_le_qty CHECK (returned_quantity <= quantity)
);
CREATE INDEX sale_items_sale_idx ON public.sale_items (sale_id);
CREATE INDEX sale_items_product_idx ON public.sale_items (product_id);
GRANT SELECT ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read sale_items" ON public.sale_items FOR SELECT TO authenticated USING (public.is_admin());

-- Returns
CREATE TABLE public.sale_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_no text NOT NULL UNIQUE,
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
  reason text NOT NULL DEFAULT '',
  total_refund numeric(12,2) NOT NULL DEFAULT 0 CHECK (total_refund >= 0),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sale_returns_sale_idx ON public.sale_returns (sale_id);
GRANT SELECT ON public.sale_returns TO authenticated;
GRANT ALL ON public.sale_returns TO service_role;
ALTER TABLE public.sale_returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read sale_returns" ON public.sale_returns FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.sale_return_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id uuid NOT NULL REFERENCES public.sale_returns(id) ON DELETE CASCADE,
  sale_item_id uuid NOT NULL REFERENCES public.sale_items(id) ON DELETE RESTRICT,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  line_total numeric(12,2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sale_return_items_return_idx ON public.sale_return_items (return_id);
GRANT SELECT ON public.sale_return_items TO authenticated;
GRANT ALL ON public.sale_return_items TO service_role;
ALTER TABLE public.sale_return_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read sale_return_items" ON public.sale_return_items FOR SELECT TO authenticated USING (public.is_admin());

-- Stock movements (audit trail)
CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  movement_type public.stock_movement_type NOT NULL,
  quantity integer NOT NULL,
  balance_after integer NOT NULL,
  reason text NOT NULL DEFAULT '',
  reference_type text NOT NULL DEFAULT '',
  reference_id uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX stock_movements_product_idx ON public.stock_movements (product_id, created_at DESC);
GRANT SELECT ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read stock_movements" ON public.stock_movements FOR SELECT TO authenticated USING (public.is_admin());

-- Adjust stock (restock / adjustment / damage / loss)
CREATE OR REPLACE FUNCTION public.adjust_stock(
  _product_id uuid,
  _movement_type public.stock_movement_type,
  _quantity integer,
  _reason text DEFAULT ''
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _prod public.products;
  _delta integer;
  _new integer;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _quantity IS NULL OR _quantity = 0 THEN RAISE EXCEPTION 'Quantity must not be zero'; END IF;
  IF _movement_type NOT IN ('opening','restock','adjustment','damage','loss') THEN
    RAISE EXCEPTION 'Invalid movement type for manual adjustment';
  END IF;

  SELECT * INTO _prod FROM public.products WHERE id = _product_id FOR UPDATE;
  IF _prod.id IS NULL THEN RAISE EXCEPTION 'Item not found'; END IF;

  IF _movement_type IN ('damage','loss') THEN
    _delta := -abs(_quantity);
  ELSIF _movement_type = 'adjustment' THEN
    _delta := _quantity;
  ELSE
    _delta := abs(_quantity);
  END IF;

  _new := _prod.stock_quantity + _delta;
  IF _new < 0 THEN RAISE EXCEPTION 'Stock cannot go negative (available %)', _prod.stock_quantity; END IF;

  UPDATE public.products SET stock_quantity = _new WHERE id = _product_id;

  INSERT INTO public.stock_movements (product_id, product_name, movement_type, quantity, balance_after, reason, reference_type, created_by)
  VALUES (_product_id, _prod.name, _movement_type, _delta, _new, coalesce(_reason,''), 'manual', auth.uid());

  RETURN _new;
END;
$$;
REVOKE ALL ON FUNCTION public.adjust_stock(uuid, public.stock_movement_type, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.adjust_stock(uuid, public.stock_movement_type, integer, text) TO authenticated;

-- Create sale (transactional)
CREATE OR REPLACE FUNCTION public.create_sale(
  _items jsonb,
  _discount numeric DEFAULT 0,
  _payment_method text DEFAULT 'cash',
  _customer_name text DEFAULT '',
  _note text DEFAULT '',
  _client_token text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sale_id uuid;
  _item jsonb;
  _prod public.products;
  _qty integer;
  _price numeric(12,2);
  _subtotal numeric(12,2) := 0;
  _total numeric(12,2);
  _invoice text;
  _existing uuid;
  _new_stock integer;
  _sale_item_id uuid;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'Add at least one item'; END IF;

  IF _client_token IS NOT NULL THEN
    SELECT id INTO _existing FROM public.sales WHERE client_token = _client_token;
    IF _existing IS NOT NULL THEN RETURN _existing; END IF;
  END IF;

  _discount := coalesce(_discount, 0);
  IF _discount < 0 THEN RAISE EXCEPTION 'Discount cannot be negative'; END IF;

  _invoice := 'INV-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));

  INSERT INTO public.sales (invoice_no, customer_name, payment_method, note, client_token, created_by, subtotal, discount, total)
  VALUES (_invoice, coalesce(_customer_name,''), coalesce(_payment_method,'cash'), coalesce(_note,''), _client_token, auth.uid(), 0, _discount, 0)
  RETURNING id INTO _sale_id;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_item->>'quantity')::integer;
    IF _qty IS NULL OR _qty <= 0 THEN RAISE EXCEPTION 'Quantity must be greater than zero'; END IF;

    SELECT * INTO _prod FROM public.products WHERE id = (_item->>'product_id')::uuid FOR UPDATE;
    IF _prod.id IS NULL THEN RAISE EXCEPTION 'Item not found'; END IF;

    _price := coalesce((_item->>'unit_price')::numeric, _prod.selling_price);
    IF _price < 0 THEN RAISE EXCEPTION 'Price cannot be negative'; END IF;

    IF _prod.stock_quantity < _qty THEN
      RAISE EXCEPTION 'Insufficient stock for % (available %, requested %)', _prod.name, _prod.stock_quantity, _qty;
    END IF;

    _new_stock := _prod.stock_quantity - _qty;
    UPDATE public.products SET stock_quantity = _new_stock WHERE id = _prod.id;

    INSERT INTO public.sale_items (sale_id, product_id, product_name, sku, unit_price, quantity, line_total)
    VALUES (_sale_id, _prod.id, _prod.name, _prod.sku, _price, _qty, round(_price * _qty, 2))
    RETURNING id INTO _sale_item_id;

    INSERT INTO public.stock_movements (product_id, product_name, movement_type, quantity, balance_after, reason, reference_type, reference_id, created_by)
    VALUES (_prod.id, _prod.name, 'sale', -_qty, _new_stock, 'Sale ' || _invoice, 'sale', _sale_id, auth.uid());

    _subtotal := _subtotal + round(_price * _qty, 2);
  END LOOP;

  IF _discount > _subtotal THEN RAISE EXCEPTION 'Discount cannot exceed subtotal'; END IF;
  _total := _subtotal - _discount;

  UPDATE public.sales SET subtotal = _subtotal, total = _total WHERE id = _sale_id;
  RETURN _sale_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_sale(jsonb, numeric, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_sale(jsonb, numeric, text, text, text, text) TO authenticated;

-- Process return (transactional)
CREATE OR REPLACE FUNCTION public.process_sale_return(
  _sale_id uuid,
  _items jsonb,
  _reason text DEFAULT ''
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _return_id uuid;
  _return_no text;
  _item jsonb;
  _sale public.sales;
  _si public.sale_items;
  _qty integer;
  _refund numeric(12,2) := 0;
  _new_stock integer;
  _total_qty integer;
  _total_returned integer;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'Select at least one item to return'; END IF;

  SELECT * INTO _sale FROM public.sales WHERE id = _sale_id FOR UPDATE;
  IF _sale.id IS NULL THEN RAISE EXCEPTION 'Sale not found'; END IF;
  IF _sale.status = 'void' THEN RAISE EXCEPTION 'Sale is void'; END IF;

  _return_no := 'RET-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
  INSERT INTO public.sale_returns (return_no, sale_id, reason, created_by, total_refund)
  VALUES (_return_no, _sale_id, coalesce(_reason,''), auth.uid(), 0)
  RETURNING id INTO _return_id;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_item->>'quantity')::integer;
    IF _qty IS NULL OR _qty <= 0 THEN CONTINUE; END IF;

    SELECT * INTO _si FROM public.sale_items WHERE id = (_item->>'sale_item_id')::uuid AND sale_id = _sale_id FOR UPDATE;
    IF _si.id IS NULL THEN RAISE EXCEPTION 'Sale line not found'; END IF;
    IF _si.returned_quantity + _qty > _si.quantity THEN
      RAISE EXCEPTION 'Cannot return % of % (already returned %)', _qty, _si.product_name, _si.returned_quantity;
    END IF;

    UPDATE public.sale_items SET returned_quantity = returned_quantity + _qty WHERE id = _si.id;

    IF _si.product_id IS NOT NULL THEN
      UPDATE public.products SET stock_quantity = stock_quantity + _qty WHERE id = _si.product_id
      RETURNING stock_quantity INTO _new_stock;

      INSERT INTO public.stock_movements (product_id, product_name, movement_type, quantity, balance_after, reason, reference_type, reference_id, created_by)
      VALUES (_si.product_id, _si.product_name, 'return', _qty, _new_stock, 'Return ' || _return_no, 'return', _return_id, auth.uid());
    END IF;

    INSERT INTO public.sale_return_items (return_id, sale_item_id, product_id, product_name, quantity, unit_price, line_total)
    VALUES (_return_id, _si.id, _si.product_id, _si.product_name, _qty, _si.unit_price, round(_si.unit_price * _qty, 2));

    _refund := _refund + round(_si.unit_price * _qty, 2);
  END LOOP;

  IF _refund = 0 THEN RAISE EXCEPTION 'Nothing to return'; END IF;

  UPDATE public.sale_returns SET total_refund = _refund WHERE id = _return_id;

  SELECT sum(quantity), sum(returned_quantity) INTO _total_qty, _total_returned FROM public.sale_items WHERE sale_id = _sale_id;

  UPDATE public.sales
  SET refunded_total = refunded_total + _refund,
      status = CASE WHEN _total_returned >= _total_qty THEN 'returned'::public.sale_status ELSE 'partially_returned'::public.sale_status END
  WHERE id = _sale_id;

  RETURN _return_id;
END;
$$;
REVOKE ALL ON FUNCTION public.process_sale_return(uuid, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.process_sale_return(uuid, jsonb, text) TO authenticated;

-- Seed default payment methods
INSERT INTO public.payment_methods (code, name, sort_order) VALUES
  ('cash','Cash',1),
  ('bank','Bank Transfer',2),
  ('esewa','eSewa',3),
  ('khalti','Khalti',4),
  ('other','Other',5)
ON CONFLICT (code) DO NOTHING;