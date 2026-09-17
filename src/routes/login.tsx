import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-md bg-border" />
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-soft">
        <p className="font-display text-sm tracking-wide text-muted">Mochikin</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-fg">
          所持金
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          現金と口座の残高、日々の収支、月次レポートをひとつの場所で。
        </p>
        <div className="mt-8 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-11 w-full rounded-md border border-border bg-elevated text-sm font-medium text-fg transition-colors hover:bg-bg"
              >
                {p.label} で続ける
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">サインインは無効です。</p>
          )}
        </div>
      </div>
    </main>
  );
}
