import { useState } from "react";

interface ProfileCardProps {
  creator: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    coffeePrice: number;
  };
  onShare?: () => void;
  copied?: boolean;
}

export const ProfileCard = ({ creator, onShare, copied }: ProfileCardProps) => {
  const [internalCopied, setInternalCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isCopied = copied !== undefined ? copied : internalCopied;

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setInternalCopied(true);
      setTimeout(() => setInternalCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const initials = creator.name
    ? creator.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "C";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,61,46,0.05)] border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="relative">
            {creator.avatarUrl && !imageFailed ? (
              <img
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-surface-container-lowest bg-surface-container-low"
                src={creator.avatarUrl}
                alt={creator.name}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md border-4 border-surface-container-lowest bg-primary-container text-on-primary-container flex items-center justify-center font-display text-3xl font-bold"
                aria-label={creator.name}
              >
                {initials}
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 bg-[#10B981] text-surface-container-lowest rounded-full p-1.5 shadow-md flex items-center justify-center ring-2 ring-surface-container-lowest"
              title="Verified Creator"
            >
              <span className="material-symbols-outlined text-[16px] font-bold leading-none">check</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container text-primary rounded-full hover:bg-surface-container-high active:scale-95 transition-all font-label-md text-label-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">
                {isCopied ? "check" : "share"}
              </span>
              <span>{isCopied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-primary leading-tight">
              {creator.name}
            </h1>
            <span className="bg-[#D4E6C3] text-primary font-label-sm text-xs sm:text-label-sm px-2.5 py-0.5 rounded-full tracking-wide">
              Creator
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-on-surface-variant font-label-md text-label-md flex-wrap">
            <span>@{creator.username}</span>
            <span>•</span>
            <span className="text-outline">supportme.com/@{creator.username}</span>
            {isCopied && (
              <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded font-label-sm animate-fade-in">
                Copied!
              </span>
            )}
          </div>

          {creator.bio ? (
            <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed whitespace-pre-wrap">
              {creator.bio}
            </p>
          ) : (
            <p className="font-body-md text-body-md text-outline mt-3 italic">
              Welcome to my page! Support my work by buying a coffee.
            </p>
          )}

          {/* Badges row */}
          <div className="mt-5 flex flex-wrap gap-2.5 pt-4 bg-surface-container-low/50 -mx-6 sm:-mx-8 px-6 sm:px-8 border-t border-outline-variant/20 rounded-b-[20px]">
            <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm text-primary font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[17px] text-[#4A2C1A] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                coffee
              </span>
              <span className="font-semibold">₹{creator.coffeePrice}</span>
              <span className="text-on-surface-variant text-xs">/ coffee</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm text-primary font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[17px] text-[#10B981] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <span>100% Direct Razorpay Payouts (UPI &amp; Cards)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "About" Card — Rendered with creator's real bio if provided */}
      {creator.bio && (
        <div className="bg-surface-container-lowest rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,61,46,0.05)] border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-primary">About {creator.name}</h2>
            <span className="material-symbols-outlined text-outline-variant text-[24px]">person</span>
          </div>
          <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            <p>{creator.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
