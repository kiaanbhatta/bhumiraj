import { createServerFn } from "@tanstack/react-start";

export type LeaderboardEntry = {
  entryId: string;
  name: string;
  xp: number;
  level: number;
  wpm: number;
  accuracy: number;
  score: number;
};

/**
 * Public leaderboard. Built server-side with privileged access so that no
 * account identifiers or per-user test history ever reach the browser —
 * only aggregated best scores and display names are returned.
 */
export const getLeaderboard = createServerFn({ method: "GET" }).handler(async (): Promise<LeaderboardEntry[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: results, error }, { data: profiles }] = await Promise.all([
    supabaseAdmin
      .from("typing_results")
      .select("user_id, wpm, accuracy, score")
      .order("score", { ascending: false })
      .limit(500),
    supabaseAdmin.from("profiles").select("user_id, display_name, xp, level"),
  ]);

  if (error) throw new Error("Unable to load the leaderboard right now.");

  const profileMap = new Map((profiles ?? []).map((row) => [row.user_id, row]));
  const best = new Map<string, { wpm: number; accuracy: number; score: number }>();
  for (const row of results ?? []) {
    const existing = best.get(row.user_id);
    if (!existing || row.score > existing.score) {
      best.set(row.user_id, { wpm: Number(row.wpm), accuracy: Number(row.accuracy), score: row.score });
    }
  }

  return Array.from(best.entries())
    .map(([userId, value], index) => ({
      entryId: `entry-${index}`,
      name: profileMap.get(userId)?.display_name ?? "Student",
      xp: profileMap.get(userId)?.xp ?? 0,
      level: profileMap.get(userId)?.level ?? 1,
      ...value,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
});
