import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Tag } from "lucide-react";

import { SmartImage } from "@/components/common/Media";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFee } from "@/lib/format";
import { useCourse } from "@/lib/queries";

export const Route = createFileRoute("/courses/$slug")({
  head: () => ({
    meta: [
      { title: "Course details — Bhumiraj Computer Institute" },
      { name: "description", content: "Syllabus, duration, fee and requirements for this course." },
      { property: "og:title", content: "Course details — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Syllabus, duration, fee and requirements." },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const { data: course, isLoading } = useCourse(slug);

  return (
    <PublicLayout>
      <div className="container-page py-12">
        {isLoading ? (
          <ListSkeleton rows={4} />
        ) : !course ? (
          <EmptyState
            title="Course not found"
            description="This course may have been removed or renamed."
            action={
              <Button asChild variant="outline">
                <Link to="/courses">Back to courses</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <article>
              <SmartImage
                src={course.image_url}
                alt={course.name}
                className="h-64 w-full rounded-3xl object-cover sm:h-80"
              />
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                {course.is_featured ? <Badge>Popular</Badge> : null}
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.name}</h1>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                {course.description || course.short_description}
              </p>

              {course.syllabus.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-xl font-semibold">Syllabus</h2>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {course.syllabus.map((item) => (
                      <li key={item} className="flex gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {course.requirements.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-xl font-semibold">Requirements</h2>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {course.requirements.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Tag className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </article>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <p className="text-sm text-muted-foreground">Course fee</p>
              <p className="font-display text-3xl font-bold text-primary">{formatFee(course.fee)}</p>
              <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" /> {course.duration || "Flexible duration"}
                </p>
                <p className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" /> {course.category}
                </p>
              </div>
              <Button asChild className="mt-6 w-full rounded-full">
                <Link to="/admission">Apply for this course</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full rounded-full">
                <Link to="/contact">Ask a question</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
