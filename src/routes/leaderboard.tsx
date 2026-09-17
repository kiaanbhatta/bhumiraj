import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";

import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/format";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Typing Leaderboard — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "See the fastest typists at Bhumiraj Computer Institute ranked by speed, accuracy and XP.",
      },
      { property: "og:title", content: "Typing Leaderboard — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Top typists ranked by speed, accuracy and XP." },
    ],
  }),
  component: LeaderboardPage,
});

function useLeaderboard() {
  const fetchLeaderboard = useServerFn(getLeaderboard);
  return useQuery({
    queryKey: ["leaderboard"],
    staleTime: 30_000,
    queryFn: () => fetchLeaderboard(),
  });
}

function LeaderboardPage() {
  const { data, isLoading } = useLeaderboard();

  return (
    <PublicLayout>
      <PageHero eyebrow="Rankings" title="Typing leaderboard" description="Top 50 scores from our students." />

      <section className="container-page max-w-3xl py-12">
        {isLoading ? (
          <ListSkeleton rows={8} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No scores yet" description="Be the first to take the typing test." />
        ) : (
          <ol className="space-y-3">
            {data?.map((entry, index) => (
              <li
                key={entry.userId}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 sm:gap-4 sm:p-4"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl font-display text-sm font-bold ${
                    index < 3 ? "bg-accent-gradient text-accent-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {index === 0 ? <Crown className="size-4" /> : index + 1}
                </span>
                <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary sm:grid">
                  {initials(entry.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Level {entry.level} · {entry.xp} XP
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5 sm:gap-2">
                  <Badge variant="secondary">{entry.wpm} WPM</Badge>
                  <Badge variant="secondary">{entry.accuracy}%</Badge>
                  <Badge>{entry.score}</Badge>
                </div>
              </li>

            ))}
          </ol>
        )}
      </section>
    </PublicLayout>
  );
}
