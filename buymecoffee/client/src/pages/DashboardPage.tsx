import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCreatorDashboardQuery } from "../features/creator/api/creator.api";
import { EarningsChart } from "../features/dashboard/components/EarningsChart";
import { RecentSupportersTable } from "../features/dashboard/components/RecentSupportersTable";
import Button from "../shared/ui/Button";

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
  const totalAmount = dashboard?.totalAmount ?? 0;
  const totalSupporters = dashboard?.totalSupporters ?? 0;
  
  // Calculate total cups bought accurately
  const cupsBought =
    dashboard?.totalCups ??
    (recentPayments.length > 0
      ? recentPayments.reduce(
          (sum, p) =>
            sum +
            (p.coffeeQuantity ||
              Math.max(1, Math.round(p.amount / (creator?.coffeePrice || 100)))),
          0
        )
      : dashboard?.successfulPayments ?? dashboard?.totalSuccessfulPayments ?? 0);

  const avgCups =
    totalSupporters > 0 ? (cupsBought / totalSupporters).toFixed(1) : "0";

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

  // 1. Loading State
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-surface px-page-gutter py-page-block sm:px-page-gutter-wide flex items-center justify-center">
        <div className="flex flex-col items-center gap-3" role="status">
          <span className="w-8 h-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          <p className="font-label-md text-label-md text-on-surface-variant">Loading your dashboard…</p>
        </div>
      </main>
    );
  }

  // 2. Error State
  if (isError || !dashboard || !creator) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-surface px-page-gutter py-page-block sm:px-page-gutter-wide">
        <section className="mx-auto max-w-xl text-center py-12 animate-fade-in" aria-labelledby="dashboard-heading">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container text-2xl text-primary" aria-hidden="true">
            <span className="material-symbols-outlined text-[28px]">error_outline</span>
          </div>
          <h1
            id="dashboard-heading"
            className="font-headline-md text-headline-md text-primary"
          >
            Couldn&apos;t load your dashboard
          </h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Please check your network connection and try again.
          </p>
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

  // Milestone calculations
  const targetSupporters = Math.max(5, Math.ceil((totalSupporters + 1) / 5) * 5);
  const progressPercent = Math.min(100, Math.round((totalSupporters / targetSupporters) * 100));
  const remainingSupporters = Math.max(0, targetSupporters - totalSupporters);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface text-on-surface font-body-md text-body-md px-3 sm:px-6 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Greeting Hero & Creator Link Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Greeting Banner (Soft Sage Wash) */}
          <div className="lg:col-span-7 bg-tertiary-fixed/60 rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-tertiary-fixed blur-2xl pointer-events-none opacity-60" />
            
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1 rounded-full text-primary shadow-xs">
                <span className="material-symbols-outlined text-[17px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_cafe
                </span>
                <span className="font-label-sm text-xs tracking-wide uppercase font-semibold text-primary">
                  Creator Pulse • India
                </span>
              </div>

              <div>
                <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-primary tracking-tight leading-tight">
                  Welcome back, {creator.name}!
                </h1>
                <p className="font-body-md text-sm sm:text-body-lg text-primary/85 mt-1">
                  You have received{" "}
                  <span className="font-semibold text-primary underline decoration-secondary-container decoration-2 underline-offset-4">
                    {totalSupporters} {totalSupporters === 1 ? "supporter" : "supporters"}
                  </span>{" "}
                  across UPI &amp; Cards.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                to={`/@${encodeURIComponent(creator.username)}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md sm:font-label-lg text-sm sm:text-label-lg shadow-md hover:bg-primary-hover active:scale-98 transition-all text-center"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">visibility</span>
                <span>View your page</span>
              </Link>
              <button
                type="button"
                onClick={() => void handleCopyLink()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary font-label-md sm:font-label-lg text-sm sm:text-label-lg shadow-xs hover:shadow active:scale-98 transition-all cursor-pointer text-center"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">
                  {copyStatus === "copied" ? "check" : "link"}
                </span>
                <span>{copyStatus === "copied" ? "Link copied!" : "Copy creator link"}</span>
              </button>
            </div>
          </div>

          {/* Creator Link Bio Card */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-[20px] p-5 sm:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover shadow-sm ring-2 ring-tertiary-fixed"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-lg ring-2 ring-tertiary-fixed">
                        {creator.name[0]?.toUpperCase() ?? "C"}
                      </div>
                    )}
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary-container text-primary rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm"
                      title="Active Creator"
                    >
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-headline-sm text-base sm:text-headline-sm text-primary font-bold leading-none truncate max-w-[150px] sm:max-w-none">
                        {creator.name}
                      </h2>
                      <span
                        className="material-symbols-outlined text-emerald-600 text-[18px] leading-none shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        title="Razorpay Verified"
                      >
                        verified
                      </span>
                    </div>
                    <p className="font-label-sm sm:font-label-md text-xs sm:text-label-md text-on-surface-variant pt-0.5 truncate max-w-[160px]">
                      @{creator.username}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 bg-surface-container-low px-2 sm:px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-[11px] sm:text-label-sm shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Link
                </span>
              </div>

              {/* URL Pill Bar */}
              <div className="bg-surface-container-low rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-inner my-2">
                <div className="flex items-center gap-1.5 overflow-hidden px-1 text-primary min-w-0">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-outline leading-none shrink-0">
                    alternate_email
                  </span>
                  <span className="font-label-sm sm:font-label-md text-xs sm:text-label-md text-primary font-semibold truncate select-all">
                    supportme.com/@{creator.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-tertiary-fixed/40 text-primary font-label-sm text-xs sm:text-label-sm shadow-2xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] sm:text-[16px] leading-none">
                    {copyStatus === "copied" ? "check" : "content_copy"}
                  </span>
                  <span>{copyStatus === "copied" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 sm:pt-3 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="flex-1 py-2 sm:py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md sm:font-label-lg text-sm sm:text-label-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">share</span>
                  <span>Share Profile</span>
                </button>
                <Link
                  to={`/@${encodeURIComponent(creator.username)}`}
                  className="flex-1 py-2 sm:py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-label-md sm:font-label-lg text-sm sm:text-label-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">open_in_new</span>
                  <span>Preview Page</span>
                </Link>
              </div>

              <div className="pt-1 flex items-center justify-between font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#4A2C1A] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_cafe
                  </span>
                  Coffee tier: <strong className="text-primary font-semibold">₹{creator.coffeePrice ?? 100}</strong>
                </span>
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <span className="material-symbols-outlined text-[14px] leading-none">lock</span>
                  Razorpay Instant Payouts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress & Financial Metrics Row (4-column equal responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {/* Card 1: Community Goal Milestone Card */}
          <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px] leading-none">flag</span>
                  </div>
                  <span className="font-label-md sm:font-label-lg text-sm sm:text-label-lg font-bold text-primary">
                    Next Milestone
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-xs font-semibold">
                  Goal: {targetSupporters}
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-headline-sm text-lg sm:text-headline-sm text-primary">
                    {totalSupporters} of {targetSupporters}
                  </h3>
                  <span className="font-label-lg text-label-lg font-bold text-emerald-700">
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(6, progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 bg-surface-container-low rounded-xl p-2.5 flex items-center justify-center gap-1.5 border border-outline-variant/20 font-label-sm text-xs sm:text-label-sm text-on-surface-variant text-center">
              <span className="material-symbols-outlined text-secondary-container text-[16px] shrink-0 leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span>
                {remainingSupporters > 0
                  ? `${remainingSupporters} more to unlock tier`
                  : "Milestone unlocked!"}
              </span>
            </div>
          </div>

          {/* Card 2: Total Received (STRICTLY ₹ ICON, NEVER $) */}
          <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm sm:font-label-md text-xs sm:text-label-md text-on-surface-variant font-medium">
                  Total Received
                </span>
                <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-sm font-currency-display shrink-0">
                  ₹
                </div>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary font-currency-display leading-tight">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] leading-none">trending_up</span>
                <span>100% directly received</span>
              </div>
            </div>

            <div className="pt-3 mt-3">
              <Link
                to="/dashboard/creator"
                className="w-full py-2 rounded-xl bg-secondary-container hover:brightness-105 active:scale-[0.98] text-[#002116] font-label-sm text-xs sm:text-label-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">account_balance</span>
                <span>Payout Settings</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Total Backers */}
          <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm sm:font-label-md text-xs sm:text-label-md text-on-surface-variant font-medium">
                  Total Backers
                </span>
                <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary font-currency-display leading-tight">
                  {totalSupporters.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] leading-none">verified</span>
                <span>{totalSupporters > 0 ? "Genuine patrons" : "Awaiting first"}</span>
              </div>
            </div>

            <div className="pt-3 mt-3">
              <p className="font-label-sm text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl text-center border border-outline-variant/20 truncate">
                {totalSupporters === 1
                  ? "1 patron backed you"
                  : `${totalSupporters} patrons backed you`}
              </p>
            </div>
          </div>

          {/* Card 4: Cups Bought */}
          <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm sm:font-label-md text-xs sm:text-label-md text-on-surface-variant font-medium">
                  Cups Bought
                </span>
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_cafe
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary font-currency-display leading-tight">
                  {cupsBought.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full font-label-sm text-xs font-medium">
                <span className="material-symbols-outlined text-[14px] leading-none text-[#4A2C1A]">coffee</span>
                <span>₹{creator.coffeePrice ?? 100} / cup tier</span>
              </div>
            </div>

            <div className="pt-3 mt-3">
              <p className="font-label-sm text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl text-center border border-outline-variant/20 truncate">
                Avg {avgCups} cups / supporter
              </p>
            </div>
          </div>
        </div>

        {/* Analytics & SVG Earnings Chart */}
        <EarningsChart payments={recentPayments} />

        {/* Recent Supporters Table & Empty State */}
        <RecentSupportersTable
          payments={recentPayments}
          creatorName={creator.name}
          creatorUsername={creator.username}
          onCopyLink={handleCopyLink}
          isCopied={copyStatus === "copied"}
        />
      </div>
    </main>
  );
};

export default DashboardPage;
