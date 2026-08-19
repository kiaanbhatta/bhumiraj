import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { useNotices } from "@/lib/queries";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "Notice Board — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Official notices, exam schedules and important announcements from Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Notice Board — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Exam schedules and important announcements." },
    ],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  const { data, isLoading } = useNotices();

  return (
    <PublicLayout>
      <PageHero eyebrow="Notice board" title="Notices" description="Exam routines, holidays and official announcements." />

      <section className="container-page max-w-3xl py-12">
        {isLoading ? (
          <ListSkeleton />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No notices published" />
        ) : (
          <div className="space-y-4">
            {data?.map((notice) => (
              <article key={notice.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.is_important ? <Badge variant="destructive">Important</Badge> : null}
                  <span className="text-xs text-muted-foreground">{formatDate(notice.notice_date)}</span>
                </div>
                <h2 className="mt-2 font-display text-base font-semibold">{notice.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{notice.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
