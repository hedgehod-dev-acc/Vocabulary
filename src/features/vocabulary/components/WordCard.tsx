import {
  ArrowLineDown,
  ArrowLineUp,
  ArrowRight,
  DotsSixVertical,
} from "@phosphor-icons/react";
import type { CSSProperties, MouseEvent, PointerEvent, Ref } from "react";
import type { Word } from "../types";

interface HandleProps {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
  style: CSSProperties;
}

interface Props {
  word: Word;
  setName?: string;
  onClick: () => void;
  index?: number;
  compact?: boolean;
  reorderMode?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveToTop?: () => void;
  onMoveToBottom?: () => void;
  rowRef?: Ref<HTMLLIElement>;
  rowStyle?: CSSProperties;
  handleProps?: HandleProps;
  isDragging?: boolean;
}

export default function WordCard({
  word,
  setName,
  onClick,
  index = 0,
  compact = false,
  reorderMode = false,
  isFirst = false,
  isLast = false,
  onMoveToTop,
  onMoveToBottom,
  rowRef,
  rowStyle,
  handleProps,
  isDragging = false,
}: Props) {
  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    target.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  if (reorderMode) {
    return (
      <li ref={rowRef} style={rowStyle}>
        <div
          className={`flex items-center gap-1 bg-surface ring-1 ${
            isDragging
              ? "ring-accent shadow-[var(--shadow-lift)]"
              : "ring-hairline"
          } ${
            compact ? "rounded-xl pr-2 py-1" : "rounded-2xl pr-2 py-2 shadow-[var(--shadow-card)]"
          }`}
        >
          <button
            type="button"
            aria-label={`Drag ${word.word}`}
            {...(handleProps ?? {})}
            className={`grid place-items-center text-ink-faint hover:text-ink-soft cursor-grab active:cursor-grabbing focus-ring rounded-l-2xl ${
              compact ? "h-9 w-8" : "h-11 w-9"
            }`}
          >
            <DotsSixVertical size={compact ? 18 : 20} weight="bold" />
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={`font-display font-semibold text-ink truncate ${
                compact ? "text-[15px]" : "text-[18px]"
              }`}
              style={{ letterSpacing: "-0.01em" }}
            >
              {word.word}
            </p>
            <p
              className={`text-ink-soft truncate ${
                compact ? "text-[13px]" : "text-[14px]"
              }`}
            >
              {word.translation}
            </p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              aria-label={`Move ${word.word} to top`}
              onClick={onMoveToTop}
              disabled={isFirst}
              className="press h-9 w-9 grid place-items-center rounded-lg text-ink-soft hover:bg-paper-deep disabled:opacity-30 disabled:hover:bg-transparent focus-ring"
            >
              <ArrowLineUp size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label={`Move ${word.word} to bottom`}
              onClick={onMoveToBottom}
              disabled={isLast}
              className="press h-9 w-9 grid place-items-center rounded-lg text-ink-soft hover:bg-paper-deep disabled:opacity-30 disabled:hover:bg-transparent focus-ring"
            >
              <ArrowLineDown size={16} weight="bold" />
            </button>
          </div>
        </div>
      </li>
    );
  }

  if (compact) {
    return (
      <li
        className="animate-list-in"
        style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
      >
        <button
          type="button"
          onClick={onClick}
          className="press group w-full text-left bg-surface rounded-xl px-3.5 py-2 ring-1 ring-hairline hover:ring-hairline-strong focus-ring"
        >
          <div className="flex items-center gap-2.5">
            <p
              className="flex-1 min-w-0 font-display text-[15px] font-semibold text-ink truncate"
              style={{ letterSpacing: "-0.01em" }}
            >
              {word.word}
            </p>
            <span
              aria-hidden="true"
              className="text-ink-faint text-[11px] shrink-0"
            >
              ·
            </span>
            <p className="flex-1 min-w-0 text-[13.5px] text-ink-soft truncate text-right">
              {word.translation}
            </p>
            {setName && (
              <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5 rounded bg-accent-tint text-accent-deep">
                {setName}
              </span>
            )}
          </div>
        </button>
      </li>
    );
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
