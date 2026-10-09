import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  density?: "default" | "compact";
};

const Input = ({ density = "default", className = "", ...inputProps }: InputProps) => (
  <input
    className={`w-full rounded-control border border-border bg-surface px-control-x ${density === "compact" ? "h-control-compact py-control-y-compact" : "h-control py-control-y"} text-body text-foreground outline-none transition placeholder:text-placeholder focus:border-focus focus:ring-2 focus:ring-focus/15 aria-invalid:border-danger ${className}`}
    {...inputProps}
  />
);

export default Input;