import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Timer, Target, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTypingTexts } from "@/lib/queries";

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "nepali", label: "Nepali" },
];
const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
const DURATIONS = [30, 60, 120];

const FALLBACK_TEXT =
  "Practice typing every day to build speed and accuracy. Keep your fingers on the home row and look at the screen instead of the keyboard.";

export function TypingTest() {
  const { user, profile, refreshProfile } = useAuth();
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState(60);
  const { data: texts } = useTypingTexts(language, difficulty);

  const [textIndex, setTextIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(duration);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const target = useMemo(() => {
    const pool = texts ?? [];
    if (pool.length === 0) return FALLBACK_TEXT;
    return pool[textIndex % pool.length]?.content ?? FALLBACK_TEXT;
  }, [texts, textIndex]);

  const stats = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < typed.length; i += 1) {
      if (typed[i] === target[i]) correct += 1;
    }
    const incorrect = typed.length - correct;
    const elapsedSeconds = startedAt ? Math.max(1, (Date.now() - startedAt) / 1000) : 1;
    const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
    const wpm = typed.length > 0 ? Math.round(correct / 5 / minutes) : 0;
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    return { correct, incorrect, wpm, accuracy };
  }, [typed, target, startedAt]);

  const reset = useCallback(() => {
    setTyped("");
    setStartedAt(null);
    setRemaining(duration);
    setFinished(false);
    setSaved(false);
    inputRef.current?.focus();
  }, [duration]);

  useEffect(() => {
    reset();
  }, [language, difficulty, duration, textIndex, reset]);

  useEffect(() => {
    if (!startedAt || finished) return;
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = duration - elapsed;
      setRemaining(left > 0 ? left : 0);
      if (left <= 0) setFinished(true);
    }, 250);
    return () => window.clearInterval(interval);
  }, [startedAt, duration, finished]);

  const score = Math.max(0, Math.round(stats.wpm * (stats.accuracy / 100) * 10));
  const xpEarned = Math.max(10, Math.round(score / 5));

  useEffect(() => {
    if (!finished || saved) return;
    setSaved(true);

    const save = async () => {
      if (!user) return;
      const { error } = await supabase.from("typing_results").insert({
        user_id: user.id,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        correct_chars: stats.correct,
        incorrect_chars: stats.incorrect,
        errors: stats.incorrect,
        score,
        duration_seconds: duration,
        language,
        difficulty,
        mode: "practice",
      });
      if (error) {
        toast.error("Could not save your result.");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      const currentXp = (profile?.xp ?? 0) + xpEarned;
      const streak =
        profile?.last_test_date === today
          ? profile.streak_days
          : profile?.last_test_date === yesterday
            ? (profile?.streak_days ?? 0) + 1
            : 1;

      await supabase
        .from("profiles")
        .update({
          xp: currentXp,
          level: Math.max(1, Math.floor(currentXp / 500) + 1),
          streak_days: streak,
          last_test_date: today,
        })
        .eq("user_id", user.id);

      const earned: string[] = ["first_test"];
      if (stats.wpm >= 40) earned.push("speed_40");
      if (stats.wpm >= 60) earned.push("speed_60");
      if (stats.accuracy >= 95) earned.push("accuracy_95");
      await Promise.all(
        earned.map((code) =>
          supabase.from("user_achievements").insert({ user_id: user.id, achievement_code: code }),
        ),
      );

      await refreshProfile();
      toast.success(`+${xpEarned} XP earned!`);
    };

    void save();
  }, [
    finished,
    saved,
    user,
    stats,
    score,
    duration,
    language,
    difficulty,
    xpEarned,
    profile,
    refreshProfile,
  ]);

  const handleChange = (value: string) => {
    if (finished) return;
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value.slice(0, target.length));
    if (value.length >= target.length) setFinished(true);
  };

  const progress = Math.min(100, Math.round((typed.length / target.length) * 100));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(duration)} onValueChange={(value) => setDuration(Number(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATIONS.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {item} seconds
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setTextIndex((index) => index + 1)}>
          New text
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="mr-2 size-4" /> Restart
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Time left", value: `${remaining}s`, Icon: Timer },
          { label: "Speed", value: `${stats.wpm} WPM`, Icon: Zap },
          { label: "Accuracy", value: `${stats.accuracy}%`, Icon: Target },
          { label: "Score", value: String(score), Icon: Zap },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3.5 text-primary" /> {label}
            </p>
            <p className="mt-1 font-display text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <Progress value={progress} />

      <div
        className="rounded-3xl border border-border bg-card p-6 font-mono text-lg leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {target.split("").map((char, index) => {
          const typedChar = typed[index];
          const state =
            typedChar === undefined
              ? "text-muted-foreground"
              : typedChar === char
                ? "text-primary"
                : "bg-destructive/15 text-destructive";
          const isCursor = index === typed.length;
          return (
            <span
              key={index}
              className={`${state} ${isCursor ? "border-b-2 border-primary" : ""}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={(event) => handleChange(event.target.value)}
        disabled={finished}
        rows={3}
        spellCheck={false}
        autoComplete="off"
        placeholder={finished ? "Test finished — restart to try again" : "Start typing here..."}
        className="w-full rounded-2xl border border-border bg-background p-4 font-mono text-base outline-none focus:ring-2 focus:ring-ring"
      />

      {finished ? (
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <h3 className="font-display text-xl font-bold">Test complete</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary">{stats.wpm} WPM</Badge>
            <Badge variant="secondary">{stats.accuracy}% accuracy</Badge>
            <Badge variant="secondary">{stats.incorrect} errors</Badge>
            <Badge>Score {score}</Badge>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {user ? `Result saved · +${xpEarned} XP` : "Log in to save your score and earn XP."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={reset} className="rounded-full">
              Try again
            </Button>
            {user ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/dashboard">My dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/auth">Login to save</Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
