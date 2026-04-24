import { ArrowRight } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import type { Word } from "../types";

interface Props {
  word: Word;
  setName?: string;
  onClick: () => void;
  index?: number;
}

export default function WordCard({ word, setName, onClick, index = 0 }: Props) {
  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    target.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <li
      className="animate-list-in"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <button
        type="button"
        onClick={onClick}
        onMouseMove={handleMove}
        className="spotlight press group w-full text-left bg-surface rounded-2xl p-4 ring-1 ring-hairline shadow-[var(--shadow-card)] hover:ring-hairline-strong hover:shadow-[var(--shadow-lift)] focus-ring"
      >
        <div className="flex items-baseline gap-3">
          <p
            className="flex-1 font-display text-[19px] font-semibold text-ink truncate"
            style={{ letterSpacing: "-0.01em" }}
          >
            {word.word}
          </p>
          <ArrowRight
            size={14}
            weight="bold"
            className="text-ink-faint shrink-0 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-0.5 group-hover:text-accent"
          />
          <p className="flex-1 text-[16px] text-ink-soft truncate text-right">
            {word.translation}
          </p>
        </div>
        {word.explanation && (
          <p className="mt-2 text-[14px] text-ink-muted line-clamp-3 leading-snug">
            {word.explanation}
          </p>
        )}
        {setName && (
          <div className="mt-2.5">
            <span className="inline-flex items-center text-[10px] uppercase tracking-[0.12em] font-semibold px-2 py-1 rounded-md bg-accent-tint text-accent-deep">
              {setName}
            </span>
          </div>
        )}
      </button>
    </li>
  );
}
