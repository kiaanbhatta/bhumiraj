import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  Keyboard,
  Quote,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import { CardGridSkeleton, EmptyState, SectionHeading } from "@/components/common/States";
import { DynamicIcon, SmartImage } from "@/components/common/Media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatFee, initials } from "@/lib/format";
import {
  useEvents,
  useFacilities,
  useGalleryImages,
  useNews,
  useNotices,
  usePassedStudents,
  usePhotoFrames,
  useSiteSettings,
  useTestimonials,
  type Course,
} from "@/lib/queries";
import heroCertificate from "@/assets/hero-certificate.jpg.asset.json";

export function HeroSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
      <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/25 blur-3xl sm:size-96"
        aria-hidden
      />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
        <div className="min-w-0 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
            <Sparkles className="size-3.5 shrink-0" /> Admissions open
          </span>
          <h1 className="mt-5 text-[clamp(2rem,7vw,3.75rem)] font-bold leading-[1.08]">
            {settings?.["hero_title"] ?? "Learn computer skills that get you hired"}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:mt-5 sm:text-base">
            {settings?.["hero_subtitle"] ??
              "Hands-on training in office packages, graphic design, accounting and typing — taught by experienced instructors with modern labs and certified courses."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" variant="secondary" className="w-full rounded-full sm:w-auto">
              <Link to="/admission">
                Apply for admission <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-glow sm:rounded-3xl">
            <img
              src={heroLab}
              alt="Students learning in the Bhumiraj Computer Institute training lab"
              width={1600}
              height={1104}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/11]"
            />
          </div>
          <div className="absolute -bottom-6 left-4 hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft sm:block">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
                <Trophy className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">Certified training</p>
                <p className="text-xs text-muted-foreground">Recognised course certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const { data: settings } = useSiteSettings();
  const stats = [
    { label: "Students trained", value: settings?.["stat_students"] ?? "2,500+", Icon: Users },
    { label: "Courses offered", value: settings?.["stat_courses"] ?? "12+", Icon: BadgeCheck },
    { label: "Years of experience", value: settings?.["stat_years"] ?? "10+", Icon: Clock },
    { label: "Placement support", value: settings?.["stat_placement"] ?? "90%", Icon: Trophy },
  ];

  return (
    <section className="container-page relative z-10 -mt-8 sm:-mt-10">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:gap-5 sm:rounded-3xl sm:p-6 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary sm:size-11">
              <Icon className="size-4 sm:size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-bold sm:text-xl">{value}</p>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group card-hover overflow-hidden p-0">
      <SmartImage
        src={course.image_url}
        alt={course.name}
        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
      />
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">

          <Badge variant="secondary">{course.category}</Badge>
          {course.is_featured ? <Badge>Popular</Badge> : null}
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug">{course.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.short_description}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4" /> {course.duration || "Flexible"}
          </span>
          <span className="font-semibold text-primary">{formatFee(course.fee)}</span>
        </div>
        <Button asChild variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
          <Link to="/courses/$slug" params={{ slug: course.slug }}>
            View details <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function FacilitiesSection() {
  const { data, isLoading } = useFacilities();

  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Why choose us"
        title="Everything you need to learn comfortably"
        description="Modern labs, small batches and instructors who stay with you until the skill sticks."
      />
      {isLoading ? (
        <CardGridSkeleton count={6} className="mt-10" />
      ) : (data?.length ?? 0) === 0 ? (
        <div className="mt-10">
          <EmptyState title="Facilities coming soon" />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((facility) => (
            <div
              key={facility.id}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-soft"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <DynamicIcon name={facility.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{facility.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{facility.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function TypingPromoSection() {
  return (
    <section className="container-page py-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary-gradient p-6 text-primary-foreground sm:rounded-3xl sm:p-10 lg:p-12">
        <div className="absolute inset-0 grid-noise opacity-30" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="min-w-0 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
              <Keyboard className="size-3.5 shrink-0" /> Free typing game
            </span>
            <h2 className="mt-4 text-xl font-bold sm:text-2xl lg:text-3xl">
              Test your speed in English &amp; Nepali — earn XP, levels and badges
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Real-time WPM and accuracy, difficulty levels, streaks and a public leaderboard.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" variant="secondary" className="w-full rounded-full sm:w-auto">
              <Link to="/typing">Start typing test</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Link to="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
}

export function GalleryPreviewSection() {
  const { data, isLoading } = useGalleryImages({ limit: 8 });

  if (!isLoading && (data?.length ?? 0) === 0) return null;

  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading eyebrow="Gallery" title="Life at the institute" />
      {isLoading ? (
        <CardGridSkeleton count={4} className="mt-10 lg:grid-cols-4" />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data?.map((image) => (
            <div key={image.id} className="group overflow-hidden rounded-2xl border border-border">
              <SmartImage
                src={image.image_url}
                alt={image.caption || "Institute gallery photo"}
                className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/gallery">View full gallery</Link>
        </Button>
      </div>
    </section>
  );
}

export function PhotoFramesSection() {
  const { data, isLoading } = usePhotoFrames({ limit: 4 });

  if (!isLoading && (data?.length ?? 0) === 0) return null;

  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Photo frames"
        title="Photo frames available with us"
        description="Quality frames in different sizes — see the latest prices."
      />
      {isLoading ? (
        <CardGridSkeleton count={4} className="mt-10 lg:grid-cols-4" />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {data?.map((frame) => (
            <div key={frame.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <SmartImage
                src={frame.image_url}
                alt={frame.name}
                className="aspect-4/3 w-full object-cover"
              />
              <div className="space-y-1 p-3 sm:p-4">
                <p className="truncate font-display text-sm font-semibold sm:text-base">{frame.name}</p>
                {frame.size ? <p className="text-xs text-muted-foreground">{frame.size}</p> : null}
                <p className="text-sm font-semibold text-primary">{formatFee(frame.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/photo-frames">View all photo frames</Link>
        </Button>
      </div>
    </section>
  );
}

export function StudentsSection() {
  const { data, isLoading } = usePassedStudents({ limit: 4 });

  if (!isLoading && (data?.length ?? 0) === 0) return null;

  return (
    <section className="bg-secondary/50 py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Success stories"
          title="Our passed students"
          description="Graduates now working in offices, design studios and government services."
        />
        {isLoading ? (
          <CardGridSkeleton count={4} className="mt-10 lg:grid-cols-4" />
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data?.map((student) => (
              <div key={student.id} className="rounded-2xl border border-border bg-card p-5 text-center">
                {student.photo_url ? (
                  <SmartImage
                    src={student.photo_url}
                    alt={student.name}
                    className="mx-auto size-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary-soft font-display text-lg font-bold text-primary">
                    {initials(student.name)}
                  </span>
                )}
                <h3 className="mt-4 font-display text-base font-semibold">{student.name}</h3>
                <p className="text-xs text-muted-foreground">{student.course}</p>
                {student.achievement ? (
                  <p className="mt-2 text-sm text-foreground/80">{student.achievement}</p>
                ) : null}
                {student.grade ? (
                  <Badge variant="secondary" className="mt-3">
                    {student.grade}
                  </Badge>
                ) : null}
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/passed-students">See all students</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function NewsNoticesSection() {
  const { data: news, isLoading: newsLoading } = useNews({ limit: 3 });
  const { data: notices } = useNotices(5);
  const { data: events } = useEvents(3);

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <SectionHeading align="left" eyebrow="Updates" title="Latest news" />
          {newsLoading ? (
            <CardGridSkeleton count={3} className="mt-8 lg:grid-cols-1" />
          ) : (news?.length ?? 0) === 0 ? (
            <div className="mt-8">
              <EmptyState title="No news published yet" />
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {news?.map((item) => (
                <Link
                  key={item.id}
                  to="/news/$slug"
                  params={{ slug: item.slug }}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-soft sm:flex-row"
                >
                  <SmartImage
                    src={item.cover_image_url}
                    alt={item.title}
                    className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Notice board</h3>
            <ul className="mt-4 space-y-3">
              {(notices ?? []).map((notice) => (
                <li key={notice.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">
                    {notice.is_important ? (
                      <Badge variant="destructive" className="mr-2">
                        Important
                      </Badge>
                    ) : null}
                    {notice.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(notice.notice_date)}</p>
                </li>
              ))}
              {(notices?.length ?? 0) === 0 ? (
                <li className="text-sm text-muted-foreground">No notices right now.</li>
              ) : null}
            </ul>
            <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
              <Link to="/notices">All notices</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold">Upcoming events</h3>
            <ul className="mt-4 space-y-3">
              {(events ?? []).map((event) => (
                <li key={event.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.event_date)} {event.location ? `· ${event.location}` : ""}
                    </p>
                  </div>
                </li>
              ))}
              {(events?.length ?? 0) === 0 ? (
                <li className="text-sm text-muted-foreground">No events scheduled.</li>
              ) : null}
            </ul>
            <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
              <Link to="/events">All events</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { data, isLoading } = useTestimonials();

  if (!isLoading && (data?.length ?? 0) === 0) return null;

  return (
    <section className="bg-secondary/50 py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading eyebrow="Testimonials" title="What our students say" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 6).map((testimonial) => (
            <figure key={testimonial.id} className="rounded-2xl border border-border bg-card p-6">
              <Quote className="size-6 text-primary/40" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/85">
                {testimonial.message}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                {testimonial.photo_url ? (
                  <SmartImage
                    src={testimonial.photo_url}
                    alt={testimonial.name}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {initials(testimonial.name)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.course}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-0.5 text-accent">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="size-3.5 fill-current" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-soft sm:rounded-3xl sm:p-12">
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div className="relative">
          <h2 className="font-display text-xl font-bold sm:text-3xl">Ready to start your course?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Fill the online admission form and our team will contact you with the batch schedule and fee details.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full rounded-full sm:w-auto">
              <Link to="/admission">Apply online</Link>
            </Button>
            {settings?.["phone"] ? (
              <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
                <a href={`tel:${settings["phone"]}`}>Call {settings["phone"]}</a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

    </section>
  );
}
