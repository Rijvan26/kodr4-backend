import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPublicCreatorQuery } from "../features/creator/api/creator.api";
import { ProfileCard } from "../features/creator/components/ProfileCard";
import { GoalCard } from "../features/creator/components/GoalCard";
import { SupportersWall } from "../features/creator/components/SupportersWall";
import { PaymentCard } from "../features/creator/components/PaymentCard";
import Button from "../shared/ui/Button";

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
  const totalAmount = creatorResponse?.data.totalAmount ?? 0;
  const totalSupporters = creatorResponse?.data.totalSupporters ?? 0;
  const recentPayments = creatorResponse?.data.recentPayments ?? [];

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

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-body-md text-body-md text-on-surface">
        <header className="h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto h-full px-gutter flex items-center">
            <Link to="/" className="flex items-center gap-space-sm text-primary">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-secondary-container">coffee</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">
                supportme<span className="text-secondary">.com</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3" role="status">
            <span className="w-8 h-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
            <p className="font-label-md text-label-md text-on-surface-variant">Loading creator page…</p>
          </div>
        </main>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (!creator) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-body-md text-body-md text-on-surface">
        <header className="h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto h-full px-gutter flex items-center">
            <Link to="/" className="flex items-center gap-space-sm text-primary">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-secondary-container">coffee</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">
                supportme<span className="text-secondary">.com</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <section
            className="w-full max-w-md bg-surface-container-lowest rounded-[20px] p-8 text-center shadow-[0_4px_20px_rgba(15,61,46,0.05)] border border-outline-variant/30 animate-fade-in"
            aria-labelledby="creator-not-found-heading"
          >
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container text-2xl text-primary" aria-hidden="true">
              <span className="material-symbols-outlined text-[28px]">
                {isNotFound ? "search_off" : "error_outline"}
              </span>
            </div>
            <h1
              id="creator-not-found-heading"
              className="font-headline-md text-headline-md text-primary"
            >
              {isNotFound ? "Creator not found" : "Something went wrong"}
            </h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {isNotFound
                ? "This creator doesn't exist on supportme.com or the handle may be mistyped."
                : "We couldn't load this creator right now. Please verify your connection."}
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
                className="font-label-md text-label-md font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-secondary"
              >
                &larr; Go to supportme.com home
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // 3. Main Public Creator Page (with 100% dynamic server data)
  const subtitleSnippet = creator.bio
    ? creator.bio.slice(0, 48) + (creator.bio.length > 48 ? "…" : "")
    : "Independent Creator";

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,61,46,0.04)] border-b border-outline-variant/20">
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group text-primary shrink-0" aria-label="supportme.com home">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_2px_8px_rgba(15,61,46,0.12)] shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-secondary-container leading-none">coffee</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm sm:text-headline-sm text-primary leading-tight tracking-tight whitespace-nowrap">
                  supportme<span className="text-secondary">.com</span>
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 px-1">
              <Link
                to="/"
                className="px-3 py-1 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/"
                className="px-3 py-1 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                How it works
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleCopyLink()}
              className="h-8 sm:h-auto px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-xs sm:text-label-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              title="Share page"
              aria-label="Share page"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-on-surface-variant leading-none">
                {copied ? "check" : "share"}
              </span>
              <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
            </button>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1 h-8 sm:h-auto px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary-container text-on-secondary-fixed font-label-md text-xs sm:text-label-md font-bold shadow-[0_4px_14px_rgba(254,166,25,0.35)] hover:brightness-105 active:scale-98 transition-all whitespace-nowrap shrink-0"
            >
              <span className="hidden min-[380px]:inline">Start a page</span>
              <span className="min-[380px]:hidden">Start page</span>
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] leading-none shrink-0" aria-hidden="true">arrow_forward</span>
            </Link>

            <Link
              to="/login"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity shrink-0"
              title="Creator login"
              aria-label="Creator login"
            >
              <span className="material-symbols-outlined text-on-primary text-[16px] leading-none">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area with Botanical Banner */}
      <main className="w-full pt-16 sm:pt-20 bg-surface min-h-[calc(100vh-160px)] flex-1">
        <div className="flex flex-col w-full">
          {/* Subtle Organic Botanical Decorative Backdrop Banner */}
          <div className="w-full relative h-48 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-r from-[#D4E6C3] via-[#E8EFE0] to-[#FAF6EC]">
            <div className="absolute inset-0 opacity-25">
              <svg
                className="w-full h-full text-primary"
                preserveAspectRatio="none"
                viewBox="0 0 800 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="botanical-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M20,30 C35,10 65,15 60,45 C45,55 25,45 20,30 Z" fill="currentColor" opacity="0.4" />
                    <path d="M20,30 L55,42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="85" cy="85" r="7" fill="currentColor" opacity="0.3" />
                    <circle cx="95" cy="78" r="6" fill="currentColor" opacity="0.25" />
                    <path d="M85,85 C92,72 105,70 108,82 C100,94 88,92 85,85 Z" fill="currentColor" opacity="0.35" />
                    <path d="M10,95 Q30,70 50,95 T90,95" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#botanical-pattern)" />
              </svg>
            </div>

            {/* Soft ambient glow gradients */}
            <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-tertiary-fixed opacity-60 blur-2xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-end justify-between pb-20 sm:pb-24 relative z-10">
              <div className="flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full shadow-2xs text-primary">
                <span className="material-symbols-outlined text-[16px] text-[#10B981] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
                <span className="font-label-sm text-xs tracking-wide">
                  {subtitleSnippet}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full shadow-2xs text-on-surface-variant font-label-sm text-xs">
                <span className="material-symbols-outlined text-[15px] leading-none">verified</span>
                <span>@{creator.username}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid: Optimized for mobile prioritization & desktop 2-column sticky */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pb-16 sm:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Item 1: Profile info (Order 1 on mobile, Col 1-7 on desktop) */}
              <div className="order-1 lg:col-span-7 -mt-12 sm:-mt-16 lg:-mt-20 relative z-20">
                <ProfileCard
                  creator={creator}
                  copied={copied}
                  onShare={handleCopyLink}
                />
              </div>

              {/* Item 2: Razorpay Payment Card (Order 2 on mobile directly under profile, Col 8-12 on desktop sticky) */}
              <div className="order-2 lg:col-span-5 lg:row-span-3 lg:sticky lg:top-24 z-30 lg:-mt-20">
                <PaymentCard
                  creatorName={creator.name}
                  creatorUsername={creator.username}
                  coffeePrice={creator.coffeePrice}
                  onPaymentSuccess={() => void refetch()}
                />
              </div>

              {/* Item 3: Milestone Goal (Order 3 on mobile, Col 1-7 on desktop) */}
              <div className="order-3 lg:col-span-7">
                <GoalCard
                  creatorName={creator.name}
                  totalAmount={totalAmount}
                  totalSupporters={totalSupporters}
                  coffeePrice={creator.coffeePrice}
                />
              </div>

              {/* Item 4: Supporters Wall with Pagination (Order 4 on mobile, Col 1-7 on desktop) */}
              <div className="order-4 lg:col-span-7">
                <SupportersWall
                  creatorName={creator.name}
                  supporters={recentPayments}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant/30 bg-surface-container-low py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              supportme<span className="text-secondary">.com</span>
            </span>
            <span className="text-on-surface-variant text-xs">
              • Direct artisanal creator funding across India
            </span>
          </div>
          <Link
            to="/register"
            className="font-label-md text-label-md text-primary font-semibold hover:text-secondary transition-colors"
          >
            Create your own page on supportme.com &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default PublicCreatorPage;
