import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Award, Flame, Keyboard, Star, Trophy } from "lucide-react";

import { DynamicIcon } from "@/components/common/Media";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatDate, levelFromXp } from "@/lib/format";
import { useAchievements } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Bhumiraj Computer Institute" },
      { name: "description", content: "Track your typing progress, XP, level, streak and achievements." },
      { property: "og:title", content: "My Dashboard — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Your typing progress, XP and achievements." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, profile } = useAuth();
  const { data: achievements } = useAchievements();

  const { data: results, isLoading } = useQuery({
    queryKey: ["my_results", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("typing_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { data: earned } = useQuery({
    queryKey: ["my_achievements", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_code")
        .eq("user_id", user!.id);
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => row.achievement_code);
    },
  });

  const xp = profile?.xp ?? 0;
  const { level, current, needed } = levelFromXp(xp);
  const best = (results ?? []).reduce((max, row) => Math.max(max, Number(row.wpm)), 0);

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Student area"
        title={`Hello, ${profile?.display_name ?? "student"}`}
        description="Your typing progress, XP and achievements in one place."
      />

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Level", value: String(level), Icon: Star },
            { label: "Total XP", value: String(xp), Icon: Trophy },
            { label: "Best speed", value: `${best} WPM`, Icon: Keyboard },
            { label: "Day streak", value: String(profile?.streak_days ?? 0), Icon: Flame },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="size-4 text-primary" /> {label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress to level {level + 1}</span>
            <span className="text-muted-foreground">
              {current} / {needed} XP
            </span>
          </div>
          <Progress value={(current / needed) * 100} className="mt-3" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-lg font-semibold">Recent tests</h2>
            <div className="mt-4">
              {isLoading ? (
                <ListSkeleton />
              ) : (results?.length ?? 0) === 0 ? (
                <EmptyState
                  title="No tests yet"
                  description="Take your first typing test to start earning XP."
                  action={
                    <Button asChild>
                      <Link to="/typing">Start typing test</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {results?.map((result) => (
                    <div
                      key={result.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {result.wpm} WPM · {result.accuracy}% accuracy
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.language} · {result.difficulty} · {formatDate(result.created_at)}
                        </p>
                      </div>
                      <Badge variant="secondary">Score {result.score}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Achievements</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(achievements ?? []).map((achievement) => {
                const unlocked = (earned ?? []).includes(achievement.code);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl border p-4 ${
                      unlocked ? "border-primary/40 bg-primary-soft" : "border-border bg-card opacity-70"
                    }`}
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-background text-primary">
                      <DynamicIcon name={achievement.icon} className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-semibold">{achievement.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                      <Award className="size-3.5" /> {achievement.xp_reward} XP
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
