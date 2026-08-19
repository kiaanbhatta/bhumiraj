import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { CourseCard } from "@/components/home/HomeSections";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/lib/queries";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Computer Courses — Bhumiraj Computer Institute" },
      {
        name: "description",
        content:
          "Explore diploma, office package, graphic design, accounting and typing courses with duration, fees and syllabus.",
      },
      { property: "og:title", content: "Courses at Bhumiraj Computer Institute" },
      { property: "og:description", content: "Duration, fees and syllabus for every course we offer." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data, isLoading, isError } = useCourses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((data ?? []).map((course) => course.category)))],
    [data],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((course) => {
      const matchesCategory = category === "All" || course.category === category;
      const matchesTerm =
        !term ||
        course.name.toLowerCase().includes(term) ||
        course.short_description.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [data, search, category]);

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Courses"
        title="Choose the course that fits your goal"
        description="Practical curriculum, flexible batches and certificates on completion."
      />

      <section className="container-page py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses..."
            className="sm:max-w-xs"
            maxLength={80}
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <CardGridSkeleton />
          ) : isError ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState title="No courses match your search" description="Try a different keyword or category." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
