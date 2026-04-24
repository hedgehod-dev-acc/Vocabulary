import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search" }: Props) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="none"
        className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-neutral-200 text-neutral-900 text-[16px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none placeholder:text-neutral-400 transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
