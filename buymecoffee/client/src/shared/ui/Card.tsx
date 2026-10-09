import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement>;

const Card = ({ className = "", ...sectionProps }: CardProps) => (
  <section
    className={`rounded-card border border-border bg-surface ${className}`}
    {...sectionProps}
  />
);

export default Card;