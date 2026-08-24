CREATE OR REPLACE FUNCTION public.delete_sale(_sale_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invoice text;
  _item record;
  _balance integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete sales';
  END IF;

  SELECT invoice_no INTO _invoice FROM public.sales WHERE id = _sale_id;
  IF _invoice IS NULL THEN
    RAISE EXCEPTION 'Sale not found';
  END IF;

  FOR _item IN
    SELECT product_id, product_name, (quantity - returned_quantity) AS qty
    FROM public.sale_items
    WHERE sale_id = _sale_id
  LOOP
    IF _item.product_id IS NOT NULL AND _item.qty > 0 THEN
      UPDATE public.products
      SET stock_quantity = stock_quantity + _item.qty,
          updated_at = now()
      WHERE id = _item.product_id
      RETURNING stock_quantity INTO _balance;

      INSERT INTO public.stock_movements (
        product_id, product_name, movement_type, quantity, balance_after,
        reason, reference_type, reference_id, created_by
      ) VALUES (
        _item.product_id, _item.product_name, 'adjustment', _item.qty, _balance,
        'Sale ' || _invoice || ' deleted', 'sale_delete', _sale_id, auth.uid()
      );
    END IF;
  END LOOP;

  DELETE FROM public.sale_return_items
  WHERE return_id IN (SELECT id FROM public.sale_returns WHERE sale_id = _sale_id);
  DELETE FROM public.sale_returns WHERE sale_id = _sale_id;
  UPDATE public.stock_movements SET reference_id = NULL
  WHERE reference_id = _sale_id AND reference_type <> 'sale_delete';
  DELETE FROM public.sale_items WHERE sale_id = _sale_id;
  DELETE FROM public.sales WHERE id = _sale_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_sale(uuid) TO authenticated;