import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  density?: "default" | "compact";
};

const Textarea = ({ density = "default", className = "", ...textareaProps }: TextareaProps) => (
  <textarea
    className={`w-full resize-y rounded-control border border-border bg-surface px-control-x ${density === "compact" ? "py-control-y-compact" : "py-control-y"} text-body text-foreground outline-none transition placeholder:text-placeholder focus:border-focus focus:ring-2 focus:ring-focus/15 aria-invalid:border-danger ${className}`}
    {...textareaProps}
  />
);

export default Textarea;