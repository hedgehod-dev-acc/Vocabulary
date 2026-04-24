import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="py-16 text-center animate-rise">
      {icon && (
        <div className="relative mb-5 grid place-items-center">
          <span
            aria-hidden="true"
            className="absolute h-24 w-24 rounded-full bg-accent/15 blur-2xl animate-glow"
          />
          <span
            aria-hidden="true"
            className="absolute h-16 w-16 rounded-full bg-accent-soft"
          />
          <span className="relative grid place-items-center h-16 w-16 rounded-full bg-surface ring-1 ring-hairline shadow-[var(--shadow-card)]">
            {icon}
          </span>
        </div>
      )}
      <p
        className="font-display text-[22px] font-semibold text-ink"
        style={{ letterSpacing: "-0.015em", textWrap: "balance" }}
      >
        {title}
      </p>
      {description && (
        <p
          className="mt-1.5 text-[14px] text-ink-muted max-w-xs mx-auto leading-snug"
          style={{ textWrap: "pretty" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
