import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
      <div className="absolute inset-0 grid-noise opacity-30" aria-hidden />
      <div className="container-page relative py-10 sm:py-16 lg:py-20">
        {eyebrow ? (
          <span className="inline-flex rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-4 max-w-3xl text-[clamp(1.6rem,6vw,3rem)] font-bold leading-[1.12]">{title}</h1>

        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
