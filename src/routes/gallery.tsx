import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGalleryCategories, useGalleryImages } from "@/lib/queries";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Photos from our classrooms, labs, events and student activities at Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Photo Gallery — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Classrooms, labs, events and student activities." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: images, isLoading } = useGalleryImages();
  const { data: categories } = useGalleryCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; caption: string } | null>(null);

  const filtered = useMemo(
    () => (images ?? []).filter((image) => !activeCategory || image.category_id === activeCategory),
    [images, activeCategory],
  );

  return (
    <PublicLayout>
      <PageHero eyebrow="Gallery" title="Photo gallery" description="Moments from classes, events and celebrations." />

      <section className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeCategory === null ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {(categories ?? []).map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="mt-10">
          {isLoading ? (
            <CardGridSkeleton count={9} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No photos yet" description="Photos will appear here once they are uploaded." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setPreview({ url: image.image_url, caption: image.caption })}
                  className="group overflow-hidden rounded-2xl border border-border text-left"
                >
                  <SmartImage
                    src={image.image_url}
                    alt={image.caption || "Gallery photo"}
                    className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {image.caption ? (
                    <p className="line-clamp-1 bg-card px-3 py-2 text-xs text-muted-foreground">{image.caption}</p>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={preview !== null} onOpenChange={(open) => (open ? null : setPreview(null))}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{preview?.caption || "Gallery photo"}</DialogTitle>
          {preview ? (
            <img src={preview.url} alt={preview.caption || "Gallery photo"} className="w-full rounded-xl" />
          ) : null}
          {preview?.caption ? (
            <p className="px-2 pb-2 text-center text-sm text-muted-foreground">{preview.caption}</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
