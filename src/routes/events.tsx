import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { formatDate } from "@/lib/format";
import { useEvents } from "@/lib/queries";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Workshops, seminars, competitions and celebrations at Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Events — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Workshops, seminars and competitions." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { data, isLoading } = useEvents();

  return (
    <PublicLayout>
      <PageHero eyebrow="Events" title="Workshops & activities" description="What's happening at the institute." />

      <section className="container-page py-12">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No events scheduled" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((event) => (
              <article key={event.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <SmartImage src={event.image_url} alt={event.title} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h2 className="font-display text-base font-semibold">{event.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-primary" /> {formatDate(event.event_date)}
                    </p>
                    {event.location ? (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" /> {event.location}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
