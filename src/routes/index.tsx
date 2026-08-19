import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  CtaSection,
  FacilitiesSection,
  GalleryPreviewSection,
  HeroSection,
  NewsNoticesSection,
  StatsSection,
  StudentsSection,
  TestimonialsSection,
  TypingPromoSection,
} from "@/components/home/HomeSections";
import { CourseCard } from "@/components/home/HomeSections";
import { CardGridSkeleton, EmptyState, SectionHeading } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useCourses } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bhumiraj Computer Institute — Practical Computer Training" },
      {
        name: "description",
        content:
          "Job-focused computer courses, typing practice, certified training and online admission at Bhumiraj Computer Institute.",
      },
      { property: "og:title", content: "Bhumiraj Computer Institute" },
      {
        property: "og:description",
        content: "Job-focused computer courses, certified training and online admission.",
      },
    ],
  }),
  component: Home,
});

function PopularCourses() {
  const { data, isLoading } = useCourses({ featuredOnly: true });

  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Courses"
        title="Popular training programs"
        description="Short, practical courses designed around what employers actually ask for."
      />
      {isLoading ? (
        <CardGridSkeleton className="mt-10" />
      ) : (data?.length ?? 0) === 0 ? (
        <div className="mt-10">
          <EmptyState title="Courses coming soon" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/courses">View all courses</Link>
        </Button>
      </div>
    </section>
  );
}

function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <PopularCourses />
      <FacilitiesSection />
      <TypingPromoSection />
      <GalleryPreviewSection />
      <StudentsSection />
      <NewsNoticesSection />
      <TestimonialsSection />
      <CtaSection />
    </PublicLayout>
  );
}
