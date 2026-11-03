import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  density?: "default" | "compact";
};

const Textarea = ({ density = "default", className = "", ...textareaProps }: TextareaProps) => (
  <textarea
    className={`w-full resize-y rounded-control border border-border bg-surface px-control-x ${density === "compact" ? "py-control-y-compact text-body-small" : "py-control-y"} text-body text-foreground outline-none transition-all duration-200 placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/10 aria-invalid:border-danger aria-invalid:focus:ring-danger/10 ${className}`}
    {...textareaProps}
  />
);

export default Textarea;