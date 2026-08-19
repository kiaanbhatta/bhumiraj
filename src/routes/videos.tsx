import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { useVideos } from "@/lib/queries";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video Gallery — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Watch class demos, student projects and event highlights from Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Video Gallery — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Class demos, student projects and event highlights." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { data, isLoading } = useVideos();

  return (
    <PublicLayout>
      <PageHero eyebrow="Videos" title="Video gallery" description="Class demos, tutorials and event highlights." />

      <section className="container-page py-12">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No videos yet" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((video) => (
              <a
                key={video.id}
                href={video.video_url}
                target="_blank"
                rel="noreferrer noopener"
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-soft"
              >
                <div className="relative">
                  <SmartImage
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="aspect-video w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-foreground/25 text-background opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayCircle className="size-12" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold">{video.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
