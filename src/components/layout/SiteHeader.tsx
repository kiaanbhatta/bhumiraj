import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useSiteSettings } from "@/lib/queries";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Gallery" },
  { to: "/passed-students", label: "Students" },
  { to: "/news", label: "News" },
  { to: "/typing", label: "Typing Test" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { data: settings } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const instituteName = settings?.["institute_name"] ?? "Bhumiraj Computer Institute";
  const announcement = settings?.["announcement"];

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50">
      {announcement ? (
        <div className="bg-primary-gradient text-primary-foreground">
          <div className="container-page flex items-center justify-center gap-2 py-1.5 text-center text-xs sm:text-sm">
            <span className="line-clamp-1">{announcement}</span>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "border-b border-border/60 bg-background/85 backdrop-blur-xl transition-shadow",
          scrolled && "shadow-soft",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-soft">
              <GraduationCap className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold sm:text-base">{instituteName}</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                {settings?.["tagline"] ?? "Practical computer training"}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-primary bg-primary-soft" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <User className="size-4" />
                    <span className="hidden max-w-24 truncate sm:inline">
                      {profile?.display_name ?? "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 size-4" /> My dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/typing">
                      <Keyboard className="mr-2 size-4" /> Typing test
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 size-4" /> Admin panel
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden rounded-full sm:inline-flex">
                <Link to="/auth">Login / Sign up</Link>
              </Button>
            )}

            <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
              <Link to="/admission">Apply now</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-border bg-background lg:hidden">
            <nav className="container-page grid gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "bg-primary-soft text-primary" }}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link to={user ? "/dashboard" : "/auth"}>{user ? "Dashboard" : "Login"}</Link>
                </Button>
                <Button asChild>
                  <Link to="/admission">Apply now</Link>
                </Button>
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
