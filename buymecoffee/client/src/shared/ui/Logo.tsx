import type { FC } from "react";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo: FC<LogoProps> = ({
  variant = "light",
  size = "md",
  showText = true,
  className = "",
}) => {
  const isDark = variant === "dark";

  const sizeClasses = {
    sm: {
      icon: "size-7",
      text: "text-base",
      sub: "text-[10px]",
    },
    md: {
      icon: "size-9",
      text: "text-lg",
      sub: "text-xs",
    },
    lg: {
      icon: "size-11",
      text: "text-2xl",
      sub: "text-sm",
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Logo Mark */}
      <div
        className={`relative ${sizeClasses.icon} shrink-0 rounded-xl overflow-hidden p-0.5 shadow-sm transition-transform duration-200 hover:scale-105`}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #10B981 0%, #059669 50%, #064E3B 100%)"
            : "linear-gradient(135deg, #10B981 0%, #154336 80%, #0F382C 100%)",
        }}
        aria-hidden="true"
      >
        {/* Inner subtle glow & pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />

        {/* Support Hand & Spark SVG Icon */}
        <div className="relative flex h-full w-full items-center justify-center rounded-[10px] bg-emerald-950/20 backdrop-blur-[1px] text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3/5 h-3/5 drop-shadow"
          >
            {/* Elegant heart-sprout & supportive hands emblem */}
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path
              d="M12 5v4M10 7h4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline tracking-tight font-bold">
            <span
              className={
                isDark
                  ? "text-emerald-50"
                  : "text-foreground"
              }
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: size === "sm" ? "1.05rem" : size === "lg" ? "1.45rem" : "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              supportme
            </span>
            <span
              className={
                isDark
                  ? "text-emerald-400 font-extrabold"
                  : "text-emerald-600 font-extrabold"
              }
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: size === "sm" ? "1.05rem" : size === "lg" ? "1.45rem" : "1.2rem",
                letterSpacing: "-0.03em",
              }}
            >
              .com
            </span>
          </div>
          {size === "lg" && (
            <span
              className={`mt-0.5 text-[10px] uppercase font-semibold tracking-wider ${
                isDark ? "text-emerald-300/70" : "text-muted"
              }`}
            >
              Creator Support Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
