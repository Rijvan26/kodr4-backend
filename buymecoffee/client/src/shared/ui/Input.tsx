import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  density?: "default" | "compact";
};

const Input = ({ density = "default", className = "", ...inputProps }: InputProps) => (
  <input
    className={`w-full rounded-control border border-border bg-surface px-control-x ${density === "compact" ? "h-control-compact py-control-y-compact text-body-small" : "h-control py-control-y"} text-body text-foreground outline-none transition-all duration-200 placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/10 aria-invalid:border-danger aria-invalid:focus:ring-danger/10 ${className}`}
    {...inputProps}
  />
);

export default Input;