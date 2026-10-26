import { resolveStudio } from "@/lib/editor-fields";
import { useSiteContent } from "@/lib/site-content";
import { useVisibility } from "@/lib/visibility";
import { isPagePublished } from "@/lib/publication";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/data/studio";
import { cn } from "@/lib/utils";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";

function MenuTitle({ children }: { children: string }) {
  return (
    <span className="menu-title">
      <span className="menu-title-current">{children}</span>
      <span className="menu-title-next" aria-hidden="true">{children}</span>
    </span>
  );
}

export function SiteHeader() {
  const c = useSiteContent();
  const { data: visibility } = useVisibility();
  const nav = resolveStudio(c).nav.filter(n => visibility && isPagePublished(visibility, n.to));
  const contact = nav.find(n => n.to === "/contact");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const collapsed = hidden && !open;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 120);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setHidden(false); }, [pathname]);

  // Exit wave: each piece leaves a touch later than the one before it.
  const wave = (i: number): CSSProperties => ({ "--d": `${i * 40}ms` } as CSSProperties);

  return (
    <>
      <header
        data-page={pathname}
        className={cn(
          "site-header media-tone fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out motion-reduce:transition-none",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled || open ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-header-scrim",
          collapsed && "is-collapsed",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" aria-label="Origin 13 Communication — home" className="header-item shrink-0" style={wave(0)}>
            <SiteLogo />
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
            {nav.filter(n => n.to !== "/contact").map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="header-item menu-link relative text-sm font-medium text-foreground/75"
                style={wave(i + 1)}
                activeProps={{ className: "!text-primary after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-primary" }}
              >
                <MenuTitle>{n.label}</MenuTitle>
              </Link>
            ))}
            {contact && <Link
              to="/contact"
              style={wave(5)}
              className={cn(
                "header-item menu-link menu-contact rounded-full border border-primary/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-500 hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground",
                pathname === "/contact" && "bg-primary text-primary-foreground",
              )}
            >
              <MenuTitle>{contact.label}</MenuTitle>
            </Link>}
          </nav>
          <span className="header-item" style={wave(6)}>
            <ThemeToggle />
          </span>
          <button
            className="header-item text-foreground md:hidden"
            style={wave(7)}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border px-6 pb-10 pt-6 md:hidden" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="menu-link block py-3 font-display text-3xl text-foreground/80" activeProps={{ className: "!text-primary" }} activeOptions={{ exact: true }}>
                <MenuTitle>{n.label}</MenuTitle>
              </Link>
            ))}
          </nav>
        )}
      </header>
      {/* What the header leaves behind: a slim blue line pinned to the top edge
          that keeps tracking how far down the page you've read. */}
      <div className={cn("header-progress", scrolled && "is-on")} aria-hidden="true">
        <span className="header-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
