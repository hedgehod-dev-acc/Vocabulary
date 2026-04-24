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
        className="absolute inset-0 bg-black/35 animate-fade-in"
      />
      <div
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-xl max-h-[88dvh] flex flex-col animate-sheet-in"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-1 w-10 rounded-full bg-neutral-300" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2 px-4 pb-3">
          <h2 className="flex-1 text-[18px] font-semibold text-neutral-900">{title}</h2>
          {rightAction ?? (
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 grid place-items-center rounded-xl text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
            >
              <X size={18} weight="bold" />
            </button>
          )}
        </div>
        <div className="px-4 pb-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
