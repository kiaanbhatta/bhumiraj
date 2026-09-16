import { createFileRoute } from "@tanstack/react-router";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatFee } from "@/lib/format";
import { usePhotoFrames } from "@/lib/queries";

export const Route = createFileRoute("/photo-frames")({
  head: () => ({
    meta: [
      { title: "Photo Frames & Prices — Bhumiraj Computer Institute" },
      {
        name: "description",
        content:
          "Browse photo frames available at Bhumiraj Computer Institute with sizes and current prices for each frame.",
      },
      { property: "og:title", content: "Photo Frames & Prices — Bhumiraj Computer Institute" },
      {
        property: "og:description",
        content: "Photo frames available at our institute with sizes and up-to-date prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhotoFramesPage,
});

function PhotoFramesPage() {
  const { data, isLoading } = usePhotoFrames();

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Photo frames"
        title="Photo frames available at our institute"
        description="Choose from our collection of frames — sizes and prices are updated regularly."
      />
      <section className="container-page py-12 sm:py-16">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="Frames coming soon" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((frame) => (
              <Card key={frame.id} className="card-hover overflow-hidden p-0">
                <SmartImage
                  src={frame.image_url}
                  alt={frame.name}
                  className="aspect-4/3 w-full object-cover"
                />
                <CardContent className="space-y-2 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {frame.size ? <Badge variant="secondary">{frame.size}</Badge> : null}
                    {frame.is_featured ? <Badge>Popular</Badge> : null}
                  </div>
                  <h2 className="font-display text-lg font-semibold leading-snug">{frame.name}</h2>
                  {frame.description ? (
                    <p className="text-sm text-muted-foreground">{frame.description}</p>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                    <p className="font-semibold text-primary">{formatFee(frame.price)}</p>
                    <FrameOrderDialog frame={frame} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
