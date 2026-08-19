import { Link, createFileRoute } from "@tanstack/react-router";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { useNews } from "@/lib/queries";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News & Updates — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Latest news, announcements and updates from Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "News & Updates — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Announcements, results and institute updates." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data, isLoading } = useNews();

  return (
    <PublicLayout>
      <PageHero eyebrow="Updates" title="News & articles" description="Announcements, results and institute updates." />

      <section className="container-page py-12">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No news published yet" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((item) => (
              <Link
                key={item.id}
                to="/news/$slug"
                params={{ slug: item.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-soft"
              >
                <SmartImage
                  src={item.cover_image_url}
                  alt={item.title}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h2 className="mt-3 font-display text-base font-semibold leading-snug">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
