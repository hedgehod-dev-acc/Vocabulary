import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search" }: Props) {
  return (
    <div className="relative group">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-accent/0 group-focus-within:bg-accent/10 blur-xl transition-colors duration-500"
      />
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-accent pointer-events-none transition-colors duration-200"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="none"
        className="relative w-full h-12 pl-11 pr-11 rounded-2xl bg-surface border border-hairline text-ink text-[16px] focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none placeholder:text-ink-faint transition-all duration-200 ease-out"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="press absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-xl text-ink-muted hover:bg-paper-deep animate-pop-in focus-ring"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
