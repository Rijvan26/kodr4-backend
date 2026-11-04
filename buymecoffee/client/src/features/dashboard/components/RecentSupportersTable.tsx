import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { CreatorDashboardPayment } from "../../creator/types/creator.types";

interface RecentSupportersTableProps {
  payments: CreatorDashboardPayment[];
  creatorName: string;
  creatorUsername: string;
  onCopyLink: () => void;
  isCopied?: boolean;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `Today, ${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 30) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name?: string): string {
  if (!name) return "SP";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "SP";
  if (parts.length === 1) return (parts[0][0] ?? "S").toUpperCase();
  return ((parts[0][0] ?? "S") + (parts[1][0] ?? "P")).toUpperCase();
}

export const RecentSupportersTable = ({
  payments,
  creatorName,
  creatorUsername,
  onCopyLink,
  isCopied,
}: RecentSupportersTableProps) => {
  const [likedRows, setLikedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const toggleRowLike = (id: string) => {
    setLikedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const publicPageUrl = `${window.location.origin}/@${encodeURIComponent(creatorUsername)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hey! Support my creative work on supportme.com at ${publicPageUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Support my creative projects on supportme.com! Check out my creator page: ${publicPageUrl}`
  )}`;

  // Pagination calculations
  const totalCount = payments.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Ensure current page is valid when totalCount or pageSize changes
  const activePage = Math.min(currentPage, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return payments.slice(start, start + pageSize);
  }, [payments, activePage, pageSize]);

  const startRecord = totalCount === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endRecord = Math.min(activePage * pageSize, totalCount);

  // 1. EMPTY STATE (When no payments exist)
  if (payments.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-[20px] p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 text-center relative overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary-container shadow-sm">
          <span
            className="material-symbols-outlined text-[36px] sm:text-[42px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            coffee_maker
          </span>
        </div>

        <h3 className="font-headline-sm text-lg sm:text-headline-sm text-primary font-bold">
          No supporters yet, share your link!
        </h3>
        <p className="mx-auto mt-2 max-w-md font-body-md text-xs sm:text-body-md text-on-surface-variant leading-relaxed">
          Publish your personalized tipping handle on your social profiles, video descriptions, or bio to welcome your first warm coffee treat.
        </p>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-5 relative z-10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#25D366] hover:brightness-105 text-white font-label-md text-xs sm:text-label-md font-semibold shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">chat</span>
            <span>Share to WhatsApp</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs sm:text-label-md font-medium shadow-xs transition-all border border-outline-variant/40"
          >
            <span>𝕏 Post</span>
          </a>

          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs sm:text-label-md font-medium shadow-xs transition-all border border-outline-variant/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              {isCopied ? "check" : "content_copy"}
            </span>
            <span>{isCopied ? "Link Copied!" : "Copy Bio URL"}</span>
          </button>

          <Link
            to={`/@${encodeURIComponent(creatorUsername)}`}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs sm:text-label-md font-semibold shadow-xs transition-all hover:bg-primary-hover"
          >
            <span>Open Public Page</span>
            <span className="material-symbols-outlined text-[16px] leading-none">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. SUPPORTERS TABLE (When real payments exist)
  return (
    <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgba(15,61,46,0.05)] border border-outline-variant/30 space-y-4">
      {/* Header with Title and Page Size selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="font-headline-sm text-lg sm:text-headline-sm text-primary font-bold">
            Recent Supporters
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-xs sm:text-label-sm font-bold">
            {totalCount} {totalCount === 1 ? "supporter" : "supporters"}
          </span>
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-label-sm text-on-surface-variant">
          <span>Show:</span>
          {[5, 10, 20].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                pageSize === size
                  ? "bg-primary text-on-primary font-bold shadow-2xs"
                  : "bg-surface-container-low hover:bg-surface-container text-primary"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARDS VIEW (< sm screens: no awkward horizontal scroll) */}
      <div className="sm:hidden space-y-3 pt-1">
        {paginatedPayments.map((payment, idx) => {
          const rowId = `${payment.date}-${payment.supporterName}-${idx}`;
          const initials = getInitials(payment.supporterName);
          const isLiked = Boolean(likedRows[rowId]);
          const timeAgo = formatRelativeTime(payment.date);
          const coffeeCount =
            payment.coffeeQuantity || Math.max(1, Math.round(payment.amount / 100));

          return (
            <div
              key={rowId}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center font-currency-display text-xs shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="font-label-md text-sm font-bold text-primary truncate max-w-[160px]">
                      {payment.supporterName || "Anonymous supporter"}
                    </div>
                    <div className="text-[11px] text-on-surface-variant font-label-sm">
                      {timeAgo}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-currency-display text-sm font-bold text-primary block">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-[#4A2C1A] font-semibold">
                    ☕ x{coffeeCount}
                  </span>
                </div>
              </div>

              {/* Message if any */}
              {payment.message ? (
                <p className="font-body-sm text-xs text-on-surface italic bg-surface-container-lowest/80 p-2.5 rounded-lg border border-outline-variant/20">
                  “{payment.message}”
                </p>
              ) : (
                <p className="text-[11px] text-on-surface-variant italic">
                  Supported {creatorName}&apos;s creative journey.
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  UPI / Cards verified
                </span>
                <button
                  type="button"
                  onClick={() => toggleRowLike(rowId)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    isLiked
                      ? "bg-rose-100 text-rose-700 font-bold"
                      : "bg-surface-container text-on-surface-variant hover:text-rose-600"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[14px] leading-none"
                    style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  <span>{isLiked ? "Loved" : "Thank"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE VIEW (sm+ screens: full desktop experience) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[34rem]">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider rounded-xl">
              <th className="py-3 px-4 rounded-l-xl font-semibold">Supporter</th>
              <th className="py-3 px-3 font-semibold">Coffees</th>
              <th className="py-3 px-4 font-semibold">Message</th>
              <th className="py-3 px-4 font-semibold text-right">Amount</th>
              <th className="py-3 px-4 font-semibold text-right">When</th>
              <th className="py-3 px-4 rounded-r-xl font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {paginatedPayments.map((payment, idx) => {
              const rowId = `${payment.date}-${payment.supporterName}-${idx}`;
              const initials = getInitials(payment.supporterName);
              const isLiked = Boolean(likedRows[rowId]);
              const timeAgo = formatRelativeTime(payment.date);
              const coffeeCount =
                payment.coffeeQuantity || Math.max(1, Math.round(payment.amount / 100));

              return (
                <tr
                  key={rowId}
                  className="group hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center font-currency-display text-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-label-lg text-label-lg font-bold text-primary">
                          {payment.supporterName || "Anonymous supporter"}
                        </div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">
                          via Razorpay • UPI &amp; Cards
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-900 px-2.5 py-1 rounded-full font-label-md text-label-md font-semibold">
                      ☕ x{coffeeCount}
                    </span>
                  </td>

                  <td className="py-4 px-4 max-w-xs md:max-w-md">
                    {payment.message ? (
                      <p className="font-body-md text-body-md text-on-surface italic line-clamp-2">
                        “{payment.message}”
                      </p>
                    ) : (
                      <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                        “Supported {creatorName}&apos;s creative journey.”
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <span className="font-currency-display text-base font-bold text-primary">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap font-body-sm text-body-sm text-on-surface-variant">
                    {timeAgo}
                  </td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleRowLike(rowId)}
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer ${
                        isLiked
                          ? "bg-rose-50 text-rose-600"
                          : "bg-surface-container-low hover:bg-rose-50 text-on-surface-variant hover:text-rose-600"
                      }`}
                      title="Send Heart Thank You"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] leading-none"
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS BAR */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
          <div className="font-body-sm text-xs text-on-surface-variant">
            Showing <strong className="text-primary font-semibold">{startRecord}</strong>–
            <strong className="text-primary font-semibold">{endRecord}</strong> of{" "}
            <strong className="text-primary font-semibold">{totalCount}</strong> supporters
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Page Button */}
            <button
              type="button"
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-label-sm font-semibold text-primary hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">chevron_left</span>
              <span>Prev</span>
            </button>

            {/* Page number pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-label-sm font-semibold transition-colors cursor-pointer ${
                    activePage === page
                      ? "bg-primary text-on-primary shadow-2xs"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              disabled={activePage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-label-sm font-semibold text-primary hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[16px] leading-none">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Banner below table */}
      <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant border border-outline-variant/20 mt-3">
        <div className="flex items-center gap-2 text-primary font-medium">
          <span className="material-symbols-outlined text-[18px] text-emerald-600 leading-none">
            verified_user
          </span>
          <span>Auto-transfers enabled via Razorpay direct creator payouts</span>
        </div>
        <Link
          to="/dashboard/creator"
          className="text-primary hover:text-secondary font-semibold underline decoration-primary/30"
        >
          Adjust coffee price &rarr;
        </Link>
      </div>
    </div>
  );
};

export default RecentSupportersTable;
