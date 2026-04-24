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
    <div className="-mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 px-1 py-1 w-max">
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
      className={`h-9 px-3 rounded-full inline-flex items-center gap-1.5 text-[13px] font-medium transition whitespace-nowrap ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50"
      }`}
    >
      <span className="truncate max-w-[160px]">{label}</span>
      <span
        className={`text-[11px] font-semibold tabular-nums px-1.5 rounded-md ${
          active ? "bg-white/20" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
