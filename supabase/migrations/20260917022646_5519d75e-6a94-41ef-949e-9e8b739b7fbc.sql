-- 1) Restrict profiles
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles select own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 2) Restrict typing_results
DROP POLICY IF EXISTS "public read results" ON public.typing_results;
CREATE POLICY "typing results select own" ON public.typing_results
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 3) Restrict user_achievements
DROP POLICY IF EXISTS "public read user achievements" ON public.user_achievements;
CREATE POLICY "user achievements select own" ON public.user_achievements
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.typing_results FROM anon;
REVOKE SELECT ON public.user_achievements FROM anon;

-- 4) Public leaderboard view (no user identifiers exposed)
CREATE OR REPLACE VIEW public.leaderboard
WITH (security_invoker = false) AS
SELECT
  md5(p.user_id::text) AS entry_id,
  p.display_name,
  p.avatar_url,
  p.xp,
  p.level,
  b.wpm,
  b.accuracy,
  b.score
FROM public.profiles p
JOIN (
  SELECT DISTINCT ON (user_id) user_id, wpm, accuracy, score
  FROM public.typing_results
  ORDER BY user_id, score DESC
) b ON b.user_id = p.user_id
ORDER BY b.score DESC
LIMIT 50;

GRANT SELECT ON public.leaderboard TO anon, authenticated;
GRANT ALL ON public.leaderboard TO service_role;

-- 5) Lock down SECURITY DEFINER functions from anonymous callers
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.adjust_stock(uuid, public.stock_movement_type, integer, text) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION public.create_sale(jsonb, numeric, text, text, text, text) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION public.delete_sale(uuid) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION public.process_sale_return(uuid, jsonb, text) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.adjust_stock(uuid, public.stock_movement_type, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_sale(jsonb, numeric, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_sale(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_sale_return(uuid, jsonb, text) TO authenticated;