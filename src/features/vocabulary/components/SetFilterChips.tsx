import type { WordSet } from "../types";

export const ALL_FILTER = "__all__" as const;
export type SetChipValue = string | typeof ALL_FILTER;

interface Props {
  sets: WordSet[];
  value: SetChipValue;
  onChange: (v: SetChipValue) => void;
  counts: Record<string, number>;
  totalCount: number;
}

export default function SetFilterChips({
  sets,
  value,
  onChange,
  counts,
  totalCount,
}: Props) {
  const sorted = sets.slice().sort((a, b) => a.createdAt - b.createdAt);
  return (
    <div className="-mx-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 px-4 py-1 w-max">
        <Chip
          label="All"
          count={totalCount}
          active={value === ALL_FILTER}
          onClick={() => onChange(ALL_FILTER)}
        />
        {sorted.map((s) => (
          <Chip
            key={s.id}
            label={s.name}
            count={counts[s.id] ?? 0}
            active={value === s.id}
            onClick={() => onChange(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap focus-ring transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-spring)] ${
        active
          ? "bg-ink text-white shadow-[0_8px_22px_-10px_rgba(26,23,20,0.55)] scale-[1.03]"
          : "bg-surface text-ink-soft ring-1 ring-hairline hover:ring-hairline-strong hover:bg-paper-deep"
      }`}
    >
      <span className="truncate max-w-[160px]">{label}</span>
      <span
        className={`text-[11px] font-semibold tabular px-1.5 rounded-md transition-colors ${
          active ? "bg-white/20 text-white" : "bg-paper-deep text-ink-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
