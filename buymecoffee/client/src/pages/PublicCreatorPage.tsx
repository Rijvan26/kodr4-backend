import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPublicCreatorQuery } from "../features/creator/api/creator.api";
import SupportForm from "../features/support/components/SupportForm";
import Button from "../shared/ui/Button";
import Logo from "../shared/ui/Logo";

const PublicCreatorPage = () => {
  const { username: routeUsername = "" } = useParams<{ username: string }>();
  const username = routeUsername.startsWith("@")
    ? routeUsername.slice(1)
    : routeUsername;
  const [copied, setCopied] = useState(false);

  const {
    data: creatorResponse,
    error: creatorError,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetPublicCreatorQuery(username, {
    skip: !username,
  });

  const creator = creatorResponse?.data.creator;
  const isNotFound =
    isError &&
    typeof creatorError === "object" &&
    creatorError !== null &&
    "status" in creatorError &&
    creatorError.status === 404;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-surface/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center px-page-gutter py-3.5 sm:px-page-gutter-wide">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-85">
              <Logo size="sm" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-page-gutter py-page-block sm:px-page-gutter-wide">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3" role="status">
              <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-body text-muted">Loading creator page…</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-surface/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center px-page-gutter py-3.5 sm:px-page-gutter-wide">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-85">
              <Logo size="sm" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-page-gutter py-page-block sm:px-page-gutter-wide">
          <section
            className="mx-auto max-w-md pt-16 text-center animate-fade-in"
            aria-labelledby="creator-not-found-heading"
          >
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-surface-alt text-2xl border border-border" aria-hidden="true">
              {isNotFound ? "🔍" : "⚠️"}
            </div>
            <h1
              id="creator-not-found-heading"
              className="font-display text-heading text-foreground"
            >
              {isNotFound ? "Creator not found" : "Something went wrong"}
            </h1>
            <p className="mt-2 text-body-relaxed text-muted">
              {isNotFound
                ? "This creator doesn't exist on supportme.com or the username may be incorrect."
                : "We couldn't load this creator right now. Please try again."}
            </p>
            {!isNotFound && username && (
              <Button
                type="button"
                density="compact"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="mt-5"
              >
                {isFetching ? "Loading…" : "Try again"}
              </Button>
            )}
            <div className="mt-6">
              <Link
                to="/"
                className="text-body-small font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover"
              >
                &larr; Go to supportme.com home
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-page-gutter py-3.5 sm:px-page-gutter-wide">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-85" aria-label="supportme.com home">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleCopyLink()}
              className="inline-flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-emerald-600">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.29a.75.75 0 00-1.06-1.06L7 7.59 5.65 6.24a.75.75 0 00-1.06 1.06l1.88 1.88a.75.75 0 001.06 0l3.88-3.89z" />
                  </svg>
                  <span>Link copied</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>Share page</span>
                </>
              )}
            </button>
            <Link
              to="/register"
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors hidden sm:inline-block"
            >
              Start a page &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Decorative Brand Cover */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-gradient-to-r from-emerald-950 via-[#154336] to-emerald-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_20%,rgba(16,185,129,0.18),transparent)]"
        />
      </div>

      {/* Main Body */}
      <main className="flex-1 px-page-gutter pb-page-block sm:px-page-gutter-wide sm:pb-page-block-wide">
        <div className="mx-auto max-w-5xl -mt-14 sm:-mt-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_25rem] lg:gap-8 items-start">
            {/* Left: Creator Profile Card */}
            <section
              className="rounded-card-lg border border-border bg-surface p-6 sm:p-8 shadow-xs animate-fade-in-up"
              aria-labelledby="creator-identity-heading"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img
                    src={creator.avatarUrl || "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp"}
                    alt={creator.name}
                    className="size-20 sm:size-24 rounded-full border-4 border-surface bg-surface-alt object-cover shadow-sm"
                  />
                  <span
                    title="Verified Creator"
                    className="absolute bottom-0.5 right-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs ring-2 ring-surface text-[11px] font-bold"
                  >
                    ✓
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1
                      id="creator-identity-heading"
                      className="font-display text-2xl sm:text-3xl font-bold text-foreground"
                    >
                      {creator.name}
                    </h1>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
                      Creator
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-mono font-medium text-emerald-800/80">
                    supportme.com/@{creator.username}
                  </p>
                </div>
              </div>

              {/* Bio section */}
              {creator.bio && (
                <div className="mt-6 border-t border-border-subtle pt-5">
                  <h2 className="text-caption font-semibold tracking-wider text-muted uppercase">
                    About
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap text-body-relaxed text-secondary-foreground leading-relaxed">
                    {creator.bio}
                  </p>
                </div>
              )}

              {/* Highlights */}
              <div className="mt-6 border-t border-border-subtle pt-5 grid grid-cols-2 gap-4 text-xs text-muted">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">☕</span>
                  <div>
                    <p className="font-semibold text-foreground">₹{creator.coffeePrice} / coffee</p>
                    <p className="text-[11px] text-muted">Accepting support</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="font-semibold text-foreground">100% Direct</p>
                    <p className="text-[11px] text-muted">Razorpay payouts</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Support Widget */}
            <section className="animate-fade-in-up delay-1">
              <SupportForm
                creatorName={creator.name}
                creatorUsername={creator.username}
                coffeePrice={creator.coffeePrice}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-subtle bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 px-page-gutter py-6 sm:px-page-gutter-wide">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-muted">&bull; Fueling independent creative work</span>
          </div>
          <Link
            to="/register"
            className="text-body-small font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover"
          >
            Create your own page on supportme.com &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default PublicCreatorPage;
