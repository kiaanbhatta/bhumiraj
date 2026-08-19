import { createFileRoute } from "@tanstack/react-router";

import { SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, EmptyState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/format";
import { usePassedStudents } from "@/lib/queries";

export const Route = createFileRoute("/passed-students")({
  head: () => ({
    meta: [
      { title: "Passed Students — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Meet the graduates of Bhumiraj Computer Institute and see where their training took them.",
      },
      { property: "og:title", content: "Passed Students — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Graduates, achievements and success stories." },
    ],
  }),
  component: PassedStudentsPage,
});

function PassedStudentsPage() {
  const { data, isLoading } = usePassedStudents();

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Success stories"
        title="Our passed students"
        description="Graduates working across offices, design studios, banks and government services."
      />

      <section className="container-page py-12">
        {isLoading ? (
          <CardGridSkeleton count={8} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title="No student records yet" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((student) => (
              <article key={student.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  {student.photo_url ? (
                    <SmartImage
                      src={student.photo_url}
                      alt={student.name}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-16 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary">
                      {initials(student.name)}
                    </span>
                  )}
                  <div>
                    <h2 className="font-display text-base font-semibold">{student.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {student.course}
                      {student.completion_year ? ` · ${student.completion_year}` : ""}
                    </p>
                  </div>
                </div>
                {student.achievement ? <p className="mt-4 text-sm">{student.achievement}</p> : null}
                {student.testimonial ? (
                  <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
                    “{student.testimonial}”
                  </p>
                ) : null}
                {student.grade ? (
                  <Badge variant="secondary" className="mt-4">
                    {student.grade}
                  </Badge>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
