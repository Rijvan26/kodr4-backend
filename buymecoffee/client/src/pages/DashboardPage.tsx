import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCreatorDashboardQuery } from "../features/creator/api/creator.api";
import Button from "../shared/ui/Button";

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};

const formatPaymentDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const DashboardPage = () => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const {
    data: dashboardResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetCreatorDashboardQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
  });
  const dashboard = dashboardResponse?.data;
  const creator = dashboard?.creator;
  const recentPayments = dashboard?.recentPayments ?? [];
  const currency = recentPayments[0]?.currency ?? "INR";
  const publicPageUrl = creator
    ? `${window.location.origin}/@${encodeURIComponent(creator.username)}`
    : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicPageUrl);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 3000);
    } catch {
      setCopyStatus("failed");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3" role="status">
            <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <p className="text-body text-muted">Loading your dashboard…</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !dashboard || !creator) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide">
        <section className="mx-auto max-w-6xl animate-fade-in" aria-labelledby="dashboard-heading">
          <p className="text-caption tracking-kicker text-primary font-semibold">
            SUPPORTME.COM CREATOR HUB
          </p>
          <h1
            id="dashboard-heading"
            className="mt-3 font-display text-heading text-foreground"
          >
            Your dashboard
          </h1>
          <div className="mt-6 rounded-card border border-danger-border bg-danger-surface px-5 py-4" role="alert">
            <p className="font-medium text-danger-foreground">
              We couldn&apos;t load your creator activity.
            </p>
            <p className="mt-1 text-body-small text-danger-foreground/80">
              Please check your connection and try again.
            </p>
          </div>
          <Button
            type="button"
            density="compact"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="mt-5"
          >
            {isFetching ? "Loading…" : "Try again"}
          </Button>
        </section>
      </main>
    );
  }

  // Milestone calculation
  const totalSupporters = dashboard.totalSupporters ?? 0;
  const targetSupporters = Math.max(5, Math.ceil((totalSupporters + 1) / 5) * 5);
  const progressPercent = Math.min(100, Math.round((totalSupporters / targetSupporters) * 100));

  return (
    <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide sm:py-page-block-wide">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Header */}
        <header className="animate-fade-in-up flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-caption tracking-kicker text-primary font-semibold">
                SUPPORTME.COM CREATOR HUB
              </p>
            </div>
            <h1 className="mt-2 font-display text-heading text-foreground">
              Welcome back, {creator.name}
            </h1>
            <p className="mt-1 text-body-relaxed text-muted">
              Here&apos;s how your supporters are backing your creative journey.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link
              to={`/@${encodeURIComponent(creator.username)}`}
              className="inline-flex h-control-compact items-center gap-2 justify-center rounded-control border border-border bg-surface px-button-x text-button text-surface-foreground transition-all duration-200 hover:bg-surface-alt hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus shadow-xs"
            >
              <span>View your page</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
            <Button
              type="button"
              density="compact"
              variant="secondary"
              onClick={() => void handleCopyLink()}
              className="shadow-xs"
            >
              {copyStatus === "copied" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-emerald-600">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.29a.75.75 0 00-1.06-1.06L7 7.59 5.65 6.24a.75.75 0 00-1.06 1.06l1.88 1.88a.75.75 0 001.06 0l3.88-3.89z" />
                  </svg>
                  <span>Link copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>Copy creator link</span>
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Visual Empty Space Filler: Quick Share & Milestone Banner */}
        <section className="animate-fade-in-up delay-1 grid gap-4 lg:grid-cols-3">
          {/* Public Page Share Card */}
          <div className="relative overflow-hidden rounded-card-lg border border-border bg-gradient-to-br from-surface to-surface-alt p-5 shadow-xs lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={creator.avatarUrl || "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp"}
                  alt={creator.name}
                  className="size-12 rounded-full border-2 border-emerald-500/30 object-cover shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{creator.name}</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-medium">
                      supportme.com/@{creator.username}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Coffee price set to ₹{creator.coffeePrice ?? 50} &bull; Instant Razorpay payouts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  {copyStatus === "copied" ? "Copied!" : "Copy URL"}
                </button>
                <Link
                  to={`/@${encodeURIComponent(creator.username)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-xs"
                >
                  Preview Page
                </Link>
              </div>
            </div>
          </div>

          {/* Milestone Widget */}
          <div className="rounded-card-lg border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-semibold tracking-wider text-muted uppercase">
                  Community Milestone
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {totalSupporters} / {targetSupporters}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground">
                Next Goal: {targetSupporters} Supporters
              </p>
              {/* Progress Bar */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-alt border border-border-subtle">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              {progressPercent >= 100
                ? "🎉 Milestone unlocked! On to the next tier!"
                : `Only ${targetSupporters - totalSupporters} more supporters to reach your milestone.`}
            </p>
          </div>
        </section>

        {/* Stats — Visual Cards */}
        <section className="animate-fade-in-up delay-2 grid gap-4 sm:grid-cols-3" aria-label="Creator totals">
          {/* Total received */}
          <div className="relative overflow-hidden rounded-card-lg border border-border bg-surface p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-meta text-muted font-medium uppercase tracking-wider">Total Received</p>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <p className="mt-3 break-words font-display text-heading-xl text-foreground">
              {formatCurrency(dashboard.totalAmount ?? 0, currency)}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>100% directly received</span>
            </div>
          </div>

          {/* Supporters */}
          <div className="relative overflow-hidden rounded-card-lg border border-border bg-surface p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-meta text-muted font-medium uppercase tracking-wider">Supporters</p>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <p className="mt-3 font-display text-heading text-foreground">
              {(dashboard.totalSupporters ?? 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-muted">
              {totalSupporters === 1 ? "Supporter backed your work" : "People backed your craft"}
            </p>
          </div>

          {/* Successful payments */}
          <div className="relative overflow-hidden rounded-card-lg border border-border bg-surface p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-meta text-muted font-medium uppercase tracking-wider">Successful Coffees</p>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
            </div>
            <p className="mt-3 font-display text-heading text-foreground">
              {(dashboard.successfulPayments ?? dashboard.totalSuccessfulPayments ?? 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-muted">
              Completed Razorpay transactions
            </p>
          </div>
        </section>

        {/* Recent payments / Support history */}
        <section className="animate-fade-in-up delay-3 space-y-4" aria-labelledby="recent-support-heading">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption tracking-kicker text-primary font-semibold">
                COMMUNITY BACKING
              </p>
              <h2 id="recent-support-heading" className="mt-1 font-display text-heading-small text-foreground">
                Recent support activity
              </h2>
            </div>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted border border-border">
              {recentPayments.length} {recentPayments.length === 1 ? "payment" : "payments"}
            </span>
          </div>

          {recentPayments.length === 0 ? (
            /* Visual Handcrafted Empty State */
            <div className="relative overflow-hidden rounded-card-lg border border-border bg-surface p-8 sm:p-12 text-center shadow-xs">
              {/* Background ambient glow */}
              <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-80 rounded-full bg-emerald-500/10 blur-3xl" />

              {/* Handcrafted Visual Illustration of Support Jar */}
              <div className="relative mx-auto mb-6 flex size-28 items-center justify-center">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-full drop-shadow-md"
                >
                  {/* Decorative background circle */}
                  <circle cx="60" cy="60" r="54" fill="#EBF4EE" />
                  
                  {/* Sparkles */}
                  <path d="M28 36L30 30L36 28L30 26L28 20L26 26L20 28L26 30L28 36Z" fill="#10B981" />
                  <path d="M92 48L93.5 43.5L98 42L93.5 40.5L92 36L90.5 40.5L86 42L90.5 43.5L92 48Z" fill="#059669" />
                  <circle cx="90" cy="75" r="3" fill="#34D399" />
                  <circle cx="28" cy="70" r="2.5" fill="#10B981" />

                  {/* Glass Jar Body */}
                  <path
                    d="M38 42C38 39.7909 39.7909 38 42 38H78C80.2091 38 82 39.7909 82 42V45H38V42Z"
                    fill="#154336"
                  />
                  <rect x="42" y="34" width="36" height="5" rx="2" fill="#1E5A49" />
                  <path
                    d="M38 46H82L80 94C79.8 98.4 76.2 102 71.8 102H48.2C43.8 102 40.2 98.4 40 94L38 46Z"
                    fill="#FFFFFF"
                    stroke="#D2DDD6"
                    strokeWidth="2.5"
                  />

                  {/* Coffee coins inside jar */}
                  <circle cx="53" cy="88" r="9" fill="#10B981" />
                  <circle cx="53" cy="88" r="7" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="53" y="92" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">₹</text>

                  <circle cx="68" cy="85" r="9" fill="#059669" />
                  <circle cx="68" cy="85" r="7" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="68" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">₹</text>

                  <circle cx="60" cy="72" r="9" fill="#34D399" />
                  <circle cx="60" cy="72" r="7" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="60" y="76" textAnchor="middle" fill="#154336" fontSize="10" fontWeight="bold">☕</text>

                  {/* Heart token floating into jar */}
                  <g className="animate-bounce">
                    <circle cx="60" cy="24" r="11" fill="#154336" />
                    <path
                      d="M60 28.5L58.5 27C53.5 22.5 50.5 19.8 50.5 16.5C50.5 13.8 52.6 11.7 55.3 11.7C56.8 11.7 58.3 12.4 59.2 13.5H60.8C61.7 12.4 63.2 11.7 64.7 11.7C67.4 11.7 69.5 13.8 69.5 16.5C69.5 19.8 66.5 22.5 61.5 27L60 28.5Z"
                      fill="#34D399"
                    />
                  </g>
                </svg>
              </div>

              <h3 className="font-display text-heading-small text-foreground">
                Your Support Jar is Ready to Fill!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-body-relaxed text-muted">
                You haven&apos;t received your first supporter yet. Start sharing your page to turn appreciation into real creative funding.
              </p>

              {/* Actionable Launch Checklist in Empty Space */}
              <div className="mx-auto mt-8 max-w-xl rounded-xl border border-border-subtle bg-surface-alt/70 p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  How to get your first supporters on supportme.com:
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-surface p-3.5 border border-border-subtle shadow-xs">
                    <span className="flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      1
                    </span>
                    <p className="mt-2 text-xs font-semibold text-foreground">Add to Bio</p>
                    <p className="mt-1 text-[11px] text-muted leading-relaxed">
                      Add <code className="text-primary font-mono text-[10px]">supportme.com/@{creator.username}</code> to your Instagram, X, or GitHub bio.
                    </p>
                  </div>

                  <div className="rounded-lg bg-surface p-3.5 border border-border-subtle shadow-xs">
                    <span className="flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      2
                    </span>
                    <p className="mt-2 text-xs font-semibold text-foreground">Post an Update</p>
                    <p className="mt-1 text-[11px] text-muted leading-relaxed">
                      Share what you&apos;re currently working on and invite your true fans to fuel your next post.
                    </p>
                  </div>

                  <div className="rounded-lg bg-surface p-3.5 border border-border-subtle shadow-xs">
                    <span className="flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      3
                    </span>
                    <p className="mt-2 text-xs font-semibold text-foreground">Celebrate Early Backers</p>
                    <p className="mt-1 text-[11px] text-muted leading-relaxed">
                      Every support transaction appears here in real-time with verified Razorpay payment receipts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/@${encodeURIComponent(creator.username)}`}
                  className="inline-flex items-center gap-2 rounded-control bg-primary px-6 py-2.5 text-button text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
                >
                  <span>Open Your Public Page</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Button
                  type="button"
                  density="compact"
                  variant="secondary"
                  onClick={() => void handleCopyLink()}
                >
                  {copyStatus === "copied" ? "Link Copied!" : "Copy Your Public Link"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-card-lg border border-border bg-surface shadow-xs">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-alt/60 text-meta text-muted">
                      <th scope="col" className="px-5 py-3.5 font-medium uppercase tracking-wider">Supporter</th>
                      <th scope="col" className="px-5 py-3.5 font-medium uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-5 py-3.5 font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-5 py-3.5 text-right font-medium uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment, index) => (
                      <tr
                        key={`${payment.date}-${payment.supporterName}-${index}`}
                        className="border-b border-border-subtle last:border-0 transition-colors hover:bg-surface-alt/40"
                      >
                        <th scope="row" className="px-5 py-4 font-medium text-surface-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                              {(payment.supporterName || "A")[0].toUpperCase()}
                            </div>
                            <span>{payment.supporterName || "Anonymous supporter"}</span>
                          </div>
                        </th>
                        <td className="whitespace-nowrap px-5 py-4 text-body-small text-muted">
                          {formatPaymentDate(payment.date)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-caption text-emerald-800 font-medium">
                            <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                            {payment.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-foreground">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Creator Tips Banner below table */}
              <div className="rounded-xl border border-border bg-surface-alt/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <span className="text-base">💡</span>
                  <span>Pro Tip: Thank your supporters directly or give them shoutouts in your work!</span>
                </div>
                <Link
                  to="/dashboard/creator"
                  className="text-primary hover:text-primary-hover font-semibold underline decoration-primary/30"
                >
                  Adjust coffee price &rarr;
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;