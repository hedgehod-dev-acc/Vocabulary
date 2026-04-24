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
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-lg border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-xl mx-auto flex items-center gap-1 px-3 h-14">
        {back && (
          <button
            type="button"
            aria-label="Back"
            onClick={() =>
              typeof back === "string" ? navigate(back) : navigate(-1)
            }
            className={iconBtn}
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <div className="flex-1 min-w-0 px-1">
          <h1 className="text-[17px] font-semibold text-neutral-900 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-neutral-500 truncate">{subtitle}</p>
          )}
        </div>
        {right && <div className="flex items-center gap-1 shrink-0">{right}</div>}
      </div>
    </header>
  );
}
