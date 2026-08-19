import { Link } from "@tanstack/react-router";
import { Clock, Facebook, GraduationCap, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { useSiteSettings } from "@/lib/queries";

const QUICK_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Photo gallery" },
  { to: "/videos", label: "Video gallery" },
] as const;

const MORE_LINKS = [
  { to: "/passed-students", label: "Passed students" },
  { to: "/news", label: "News & notices" },
  { to: "/typing", label: "Typing test" },
  { to: "/admission", label: "Online admission" },
] as const;

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const name = settings?.["institute_name"] ?? "Bhumiraj Computer Institute";

  const socials = [
    { url: settings?.["facebook_url"], Icon: Facebook, label: "Facebook" },
    { url: settings?.["instagram_url"], Icon: Instagram, label: "Instagram" },
    { url: settings?.["youtube_url"], Icon: Youtube, label: "YouTube" },
  ].filter((item) => item.url);

  return (
    <footer className="mt-20 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-base font-bold">{name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            {settings?.["footer_text"] ??
              "Practical, affordable computer training for students, job seekers and professionals."}
          </p>
          {socials.length > 0 ? (
            <div className="mt-5 flex gap-2">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg border border-sidebar-border transition-colors hover:bg-sidebar-accent"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide">Students</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {MORE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
            {settings?.["address"] ? (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <span>{settings["address"]}</span>
              </li>
            ) : null}
            {settings?.["phone"] ? (
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <a href={`tel:${settings["phone"]}`} className="hover:text-sidebar-primary">
                  {settings["phone"]}
                </a>
              </li>
            ) : null}
            {settings?.["email"] ? (
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <a href={`mailto:${settings["email"]}`} className="break-all hover:text-sidebar-primary">
                  {settings["email"]}
                </a>
              </li>
            ) : null}
            {settings?.["opening_hours"] ? (
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <span>{settings["opening_hours"]}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <Link to="/admin" className="transition-colors hover:text-sidebar-primary">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}
