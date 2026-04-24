import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { iconBtn } from "./fields";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean | string;
  right?: ReactNode;
}

export default function ScreenHeader({ title, subtitle, back, right }: Props) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 bg-paper/70 backdrop-blur-xl border-b border-hairline pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-xl mx-auto flex items-end gap-1 px-4 pb-3 pt-3 min-h-16">
        {back && (
          <button
            type="button"
            aria-label="Back"
            onClick={() =>
              typeof back === "string" ? navigate(back) : navigate(-1)
            }
            className={`${iconBtn} -ml-2 mb-0.5`}
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1
            className="font-display text-[28px] leading-[1.05] font-semibold text-ink truncate"
            style={{ letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-[12px] uppercase tracking-[0.14em] text-ink-muted tabular">
              {subtitle}
            </p>
          )}
        </div>
        {right && (
          <div className="flex items-center gap-1 shrink-0 mb-0.5">
            {right}
          </div>
        )}
      </div>
    </header>
  );
}
