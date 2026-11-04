import { useState, useMemo } from "react";
import type { PublicSupporter } from "../types/creator.types";

interface SupportersWallProps {
  creatorName: string;
  supporters?: PublicSupporter[];
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
  if (diffHour < 24) return `${diffHour}h ago`;
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

export const SupportersWall = ({
  creatorName,
  supporters = [],
}: SupportersWallProps) => {
  const [likedIndexes, setLikedIndexes] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toggleLike = (key: string) => {
    setLikedIndexes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasSupporters = supporters.length > 0;
  const totalCount = supporters.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedSupporters = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return supporters.slice(start, start + pageSize);
  }, [supporters, activePage, pageSize]);

  return (
    <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(15,61,46,0.05)] border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 flex-wrap gap-2">
        <div>
          <h3 className="font-headline-md text-lg sm:text-headline-md text-primary font-bold">
            Recent Supporters ({totalCount})
          </h3>
          <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant mt-0.5">
            {hasSupporters
              ? `Thank you for fueling ${creatorName}'s work!`
              : `Community contributions for ${creatorName}`}
          </p>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-primary shrink-0">
          <span
            className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </div>
      </div>

      {!hasSupporters ? (
        <div className="py-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">coffee</span>
          </div>
          <h4 className="font-headline-sm text-base sm:text-headline-sm text-primary">
            No supporters yet
          </h4>
          <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-1 max-w-sm mx-auto leading-relaxed">
            Be the very first to buy {creatorName} a coffee and leave a warm message on their wall!
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {paginatedSupporters.map((item, idx) => {
            const key = `${item.supporterName}-${item.date}-${idx}`;
            const isLiked = Boolean(likedIndexes[key]);
            const quantity = item.coffeeQuantity || 1;
            const initials = getInitials(item.supporterName);
            const timeAgo = formatRelativeTime(item.date);

            return (
              <div
                key={key}
                className="p-3.5 sm:p-4 rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container flex gap-3 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-sm shrink-0 font-bold">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-label-md text-sm sm:text-label-md text-primary font-semibold truncate max-w-[150px] sm:max-w-none">
                        {item.supporterName || "Anonymous supporter"}
                      </span>
                      <span className="text-[11px] sm:text-xs bg-[#D4E6C3] text-primary px-2 py-0.5 rounded-full font-medium">
                        bought {quantity} {quantity === 1 ? "coffee" : "coffees"} {"☕".repeat(Math.min(3, quantity))}
                      </span>
                    </div>
                    <span className="text-[11px] font-label-sm text-outline shrink-0">{timeAgo}</span>
                  </div>

                  {item.message ? (
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface mt-1.5 leading-relaxed bg-surface-container-lowest/70 p-2 sm:p-2.5 rounded-lg border border-outline-variant/20 italic">
                      “{item.message}”
                    </p>
                  ) : (
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1 italic">
                      Supported with {quantity} {quantity === 1 ? "coffee" : "coffees"}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between text-xs font-label-sm text-on-surface-variant">
                    <span className="font-bold text-primary font-currency-display">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLike(key)}
                      className="inline-flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
                      aria-label="Like this message"
                    >
                      <span
                        className={`material-symbols-outlined text-[15px] leading-none transition-colors ${
                          isLiked ? "text-rose-600" : "text-outline"
                        }`}
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span className={isLiked ? "text-rose-600 font-bold" : ""}>
                        {isLiked ? 1 : 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls for Supporters Wall */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-xs font-label-sm">
              <span className="text-on-surface-variant">
                Page {activePage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={activePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg border border-outline-variant/30 text-primary font-semibold hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={activePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-lg border border-outline-variant/30 text-primary font-semibold hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportersWall;
