import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { TypingTest } from "@/components/typing/TypingTest";

export const Route = createFileRoute("/typing")({
  head: () => ({
    meta: [
      { title: "Typing Test & Game — Bhumiraj Computer Institute" },
      {
        name: "description",
        content:
          "Free English and Nepali typing test with live WPM, accuracy, XP, levels and a public leaderboard.",
      },
      { property: "og:title", content: "Typing Test & Game — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Live WPM, accuracy, XP, levels and leaderboard." },
    ],
  }),
  component: TypingPage,
});

function TypingPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Typing game"
        title="Typing speed test"
        description="Choose your language, difficulty and duration — then type as accurately as you can."
      />
      <section className="container-page py-12">
        <TypingTest />
      </section>
    </PublicLayout>
  );
}
