import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { DynamicIcon, SmartImage } from "@/components/common/Media";
import { CardGridSkeleton, SectionHeading } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { initials } from "@/lib/format";
import { useFacilities, usePageContent, useSiteSettings, useTeachers } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Bhumiraj Computer Institute" },
      {
        name: "description",
        content:
          "Learn about Bhumiraj Computer Institute: our mission, facilities, experienced instructors and training approach.",
      },
      { property: "og:title", content: "About Bhumiraj Computer Institute" },
      { property: "og:description", content: "Our mission, facilities and teaching team." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: sections } = usePageContent("about");
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();
  const { data: teachers } = useTeachers();
  const { data: settings } = useSiteSettings();

  return (
    <PublicLayout>
      <PageHero
        eyebrow="About us"
        title={settings?.["institute_name"] ?? "Bhumiraj Computer Institute"}
        description={
          settings?.["about_intro"] ??
          "We train students, job seekers and professionals in practical computer skills with modern labs and personal guidance."
        }
      />

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {(sections ?? []).map((section) => (
            <article key={section.id} className="rounded-2xl border border-border bg-card p-6">
              {section.image_url ? (
                <SmartImage
                  src={section.image_url}
                  alt={section.title}
                  className="mb-5 h-48 w-full rounded-xl object-cover"
                />
              ) : null}
              <h2 className="font-display text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
          {(sections?.length ?? 0) === 0 ? (
            <>
              <article className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Our mission</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To make quality computer education affordable and practical for every learner in our community —
                  from first-time users to professionals upgrading their skills.
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">How we teach</h2>
                <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Small batches with individual attention",
                    "Practice-first classes on real software",
                    "Regular tests, projects and progress reviews",
                    "Certificates and placement guidance on completion",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </>
          ) : null}
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Facilities" title="What we provide" />
          {facilitiesLoading ? (
            <CardGridSkeleton count={6} className="mt-10" />
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {facilities?.map((facility) => (
                <div key={facility.id} className="rounded-2xl border border-border bg-card p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <DynamicIcon name={facility.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{facility.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{facility.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Our team" title="Meet the instructors" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(teachers ?? []).map((teacher) => (
            <div key={teacher.id} className="rounded-2xl border border-border bg-card p-6 text-center">
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
              <h3 className="mt-4 font-display text-base font-semibold">{teacher.name}</h3>
              <p className="text-sm text-primary">{teacher.position}</p>
              <p className="mt-2 text-xs text-muted-foreground">{teacher.qualification}</p>
              {teacher.experience ? (
                <p className="mt-1 text-xs text-muted-foreground">{teacher.experience}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
