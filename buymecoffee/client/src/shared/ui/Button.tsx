import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  density?: "default" | "compact";
  variant?: "primary" | "secondary";
};

const Button = ({
  density = "default",
  variant = "primary",
  className = "",
  ...buttonProps
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-control ${density === "compact" ? "h-control-compact py-control-y-compact" : "h-control py-button-y"} px-button-x text-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65 ${variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "border border-border bg-surface text-surface-foreground hover:bg-background"} ${className}`}
    {...buttonProps}
  />
);

export default Button;