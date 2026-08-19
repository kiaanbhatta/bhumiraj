import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Linkedin } from "lucide-react";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { initials } from "@/lib/format";
import { useTeachers } from "@/lib/queries";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Our Instructors — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Meet the experienced instructors and staff who teach at Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Our Instructors — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Experienced instructors and support staff." },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const { data, isLoading } = useTeachers();

  return (
    <PublicLayout>
      <PageHero eyebrow="Our team" title="Instructors & staff" description="Experienced teachers who guide every batch." />

      <section className="container-page py-12">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="Team details coming soon" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((teacher) => (
              <article key={teacher.id} className="rounded-2xl border border-border bg-card p-6 text-center">
                {teacher.photo_url ? (
                  <SmartImage
                    src={teacher.photo_url}
                    alt={teacher.name}
                    className="mx-auto size-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="mx-auto grid size-24 place-items-center rounded-full bg-primary-soft font-display text-xl font-bold text-primary">
                    {initials(teacher.name)}
                  </span>
                )}
                <h2 className="mt-4 font-display text-base font-semibold">{teacher.name}</h2>
                <p className="text-sm text-primary">{teacher.position}</p>
                <p className="mt-2 text-xs text-muted-foreground">{teacher.qualification}</p>
                {teacher.bio ? <p className="mt-3 text-sm text-muted-foreground">{teacher.bio}</p> : null}
                <div className="mt-4 flex justify-center gap-2">
                  {teacher.facebook_url ? (
                    <a
                      href={teacher.facebook_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${teacher.name} on Facebook`}
                      className="grid size-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                    >
                      <Facebook className="size-4" />
                    </a>
                  ) : null}
                  {teacher.linkedin_url ? (
                    <a
                      href={teacher.linkedin_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${teacher.name} on LinkedIn`}
                      className="grid size-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                    >
                      <Linkedin className="size-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
