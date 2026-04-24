import { useEffect, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  rightAction?: ReactNode;
}

export default function Sheet({ open, title, onClose, children, rightAction }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm animate-backdrop-in"
      />
      <div
        className="absolute left-0 right-0 bottom-0 bg-surface rounded-t-[28px] shadow-[var(--shadow-pop)] max-h-[88dvh] flex flex-col animate-sheet-in"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-center pt-3 pb-1.5">
          <div
            className="h-1 w-10 rounded-full bg-hairline-strong"
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center gap-2 px-5 pt-1 pb-3">
          <h2
            className="flex-1 font-display text-[22px] font-semibold text-ink"
            style={{ letterSpacing: "-0.015em" }}
          >
            {title}
          </h2>
          {rightAction ?? (
            <button
              onClick={onClose}
              aria-label="Close"
              className="press h-9 w-9 grid place-items-center rounded-xl text-ink-muted hover:bg-paper-deep focus-ring"
            >
              <X size={18} weight="bold" />
            </button>
          )}
        </div>
        <div className="px-5 pb-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
