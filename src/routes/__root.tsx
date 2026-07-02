import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, Moon, Sun, LogOut, LogIn } from "lucide-react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider, useApp } from "../lib/app-context";
import { Chatbot } from "../components/Chatbot";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MSME Financial Health Card" },
      {
        name: "description",
        content:
          "AI-powered credit assessment for New-to-Credit MSMEs — combining GST, UPI, Account Aggregator and EPFO data into a single Financial Health Score.",
      },
      { name: "author", content: "Somya Rawat & Team" },
      { property: "og:title", content: "MSME Financial Health Card" },
      {
        property: "og:description",
        content:
          "Alternate-data credit scoring for banks — score New-to-Credit MSMEs in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <SiteFooter />
          <Chatbot />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  const { user, logout, theme, toggleTheme, notifications, markAllRead } = useApp();
  const nav = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) { setNotifOpen(false); setUserOpen(false); } };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="MSME Health" className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-[15px]" style={{ color: "#1a3a6c" }}>
              MSME Financial Health Card
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Powered by Alternate Data
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1" ref={ref}>
          <nav className="hidden md:flex items-center gap-1 text-sm mr-2">
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/integrations">Data Sources</NavItem>
            <NavItem to="/onboarding">New Applicant</NavItem>
          </nav>
          <button onClick={toggleTheme} className="h-9 w-9 rounded-md hover:bg-secondary flex items-center justify-center" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setNotifOpen((o) => !o); setUserOpen(false); }} className="h-9 w-9 rounded-md hover:bg-secondary flex items-center justify-center relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-semibold flex items-center justify-center">{unread}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="text-xs font-semibold" style={{ color: "#1a3a6c" }}>Notifications</div>
                  <button onClick={markAllRead} className="text-[11px]" style={{ color: "#0d9488" }}>Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-3 py-2.5 border-b border-border text-xs ${n.read ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "#0d9488" }} />}
                        <div className="flex-1">
                          <div>{n.text}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {user ? (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setUserOpen((o) => !o); setNotifOpen(false); }} className="ml-1 h-9 pl-1 pr-2.5 rounded-md hover:bg-secondary flex items-center gap-2 text-sm">
                <span className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "#0d9488" }}>{user.name.charAt(0)}</span>
                <span className="hidden sm:inline font-medium">{user.name.split(" ")[0]}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-white shadow-lg overflow-hidden text-sm">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    <div className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-wider">{user.role === "officer" ? "Bank Officer" : "MSME"}</div>
                  </div>
                  <button onClick={() => { logout(); nav({ to: "/" }); }} className="w-full text-left px-3 py-2 hover:bg-secondary flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-medium" style={{ background: "#1a3a6c" }}>
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      activeProps={{ className: "px-3 py-1.5 rounded-md bg-secondary text-foreground font-medium" }}
    >
      {children}
    </Link>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div>
          © {year} MSME Financial Health Card · A financial-inclusion prototype
        </div>
        <div>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/somya-rawat-042196233/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:underline"
            style={{ color: "#0d9488" }}
          >
            Somya Rawat &amp; Team
          </a>
        </div>
      </div>
    </footer>
  );
}
