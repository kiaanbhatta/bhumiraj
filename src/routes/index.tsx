import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  CtaSection,
  FacilitiesSection,
  GalleryPreviewSection,
  HeroSection,
  NewsNoticesSection,
  PhotoFramesSection,
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
      { title: "Bhumiraj Computer Institute — Practical Computer Training & Courses" },
      {
        name: "description",
        content:
          "Bhumiraj Computer Institute (Bhumiraj Computer) offers job-focused computer courses, typing practice, certified training and online admission. Learn practical computer skills with expert teachers.",
      },
      { property: "og:title", content: "Bhumiraj Computer Institute — Practical Computer Training" },
      {
        property: "og:description",
        content:
          "Job-focused computer courses, certified training, typing practice and online admission at Bhumiraj Computer Institute.",
      },
      { property: "og:url", content: "https://bhumiraj.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://bhumiraj.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Bhumiraj Computer Institute",
          alternateName: ["Bhumiraj Computer", "Bhumiraj IT Jhalari"],
          url: "https://bhumiraj.lovable.app/",
          description:
            "Job-focused computer courses, typing practice, certified training and online admission at Bhumiraj Computer Institute.",
        }),
      },
    ],
  }),
  component: Home,
});

function PopularCourses() {
  const { data, isLoading } = useCourses({ featuredOnly: true });

  return (
    <section className="container-page py-12 sm:py-16">
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
      <PhotoFramesSection />
      <TypingPromoSection />
      <FacilitiesSection />
      <GalleryPreviewSection />
      <StudentsSection />
      <NewsNoticesSection />
      <TestimonialsSection />
      <CtaSection />
    </PublicLayout>
  );
}
