import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  elevated?: boolean;
};

const Card = ({ className = "", elevated = false, ...sectionProps }: CardProps) => (
  <section
    className={`rounded-card-lg border border-border bg-surface transition-shadow duration-200 ${elevated ? "shadow-card hover:shadow-card-hover" : ""} ${className}`}
    {...sectionProps}
  />
);

export default Card;