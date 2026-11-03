import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  density?: "default" | "compact";
  variant?: "primary" | "secondary" | "ghost";
};

const Button = ({
  density = "default",
  variant = "primary",
  className = "",
  ...buttonProps
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-control text-button transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

  const densityClass =
    density === "compact"
      ? "h-control-compact py-control-y-compact px-button-x text-body-small"
      : "h-control py-button-y px-button-x";

  const variantClass =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md active:shadow-sm"
      : variant === "ghost"
        ? "text-foreground hover:bg-surface-alt active:bg-border-subtle"
        : "border border-border bg-surface text-surface-foreground hover:bg-surface-alt hover:border-border active:bg-border-subtle";

  return (
    <button
      className={`${base} ${densityClass} ${variantClass} ${className}`}
      {...buttonProps}
    />
  );
};

export default Button;