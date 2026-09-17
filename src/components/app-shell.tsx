import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, ListPlus, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "ホーム", icon: LayoutDashboard },
  { to: "/ledger", label: "明細", icon: ListPlus },
  { to: "/accounts", label: "口座", icon: Wallet },
  { to: "/reports", label: "レポート", icon: BarChart3 },
] as const;

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-10 w-40 animate-pulse rounded-md bg-border" />
          <div className="h-40 animate-pulse rounded-xl bg-border/70" />
          <div className="h-64 animate-pulse rounded-xl bg-border/50" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-5xl items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-4">
            <BrandLogo />
            <span className="hidden text-sm text-muted md:inline">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-sm text-muted sm:inline">
              {user.displayName}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-6 md:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="hidden md:flex md:flex-col md:gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-fg"
                    : "text-muted hover:bg-border/60 hover:text-fg",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-subtle",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
