import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, MagnifyingGlass, X } from "@phosphor-icons/react";
import ScreenHeader from "../shared/ui/ScreenHeader";
import EmptyState from "../shared/ui/EmptyState";
import { useVocabulary } from "../features/vocabulary/VocabularyContext";
import { useFilteredWords } from "../features/vocabulary/useFilteredWords";
import { uiPrefs } from "../features/ui/uiPrefs";
import { useCompactWords } from "../features/ui/useCompactWords";
import WordList from "../features/vocabulary/components/WordList";
import CompactToggle from "../features/vocabulary/components/CompactToggle";
import SetFilterChips, {
  ALL_FILTER,
  type SetChipValue,
} from "../features/vocabulary/components/SetFilterChips";
import { iconBtn } from "../shared/ui/fields";

export default function WordsPage() {
  const { words, sets } = useVocabulary();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [compact, setCompact] = useCompactWords();
  const [filter, setFilter] = useState<SetChipValue>(() => {
    const stored = uiPrefs.getWordsFilter();
    if (!stored) return ALL_FILTER;
    if (stored === ALL_FILTER) return ALL_FILTER;
    return stored;
  });

  useEffect(() => {
    uiPrefs.setWordsFilter(filter);
  }, [filter]);

  useEffect(() => {
    if (filter !== ALL_FILTER && !sets.some((s) => s.id === filter)) {
      setFilter(ALL_FILTER);
    }
  }, [sets, filter]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const w of words) out[w.setId] = (out[w.setId] ?? 0) + 1;
    return out;
  }, [words]);

  const filtered = useFilteredWords({
    words,
    query,
    setId: filter === ALL_FILTER ? null : filter,
  });

  const hasAny = words.length > 0;

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      {searchOpen ? (
        <header className="sticky top-0 z-20 bg-paper/70 backdrop-blur-xl border-b border-hairline pt-[env(safe-area-inset-top)]">
          <div className="w-full max-w-xl mx-auto flex items-center gap-2 px-4 pb-3 pt-3 min-h-16">
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className={`${iconBtn} -ml-2 shrink-0`}
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <div className="relative flex-1 group">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-accent pointer-events-none transition-colors duration-200"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                }}
                placeholder="Search in either language"
                autoComplete="off"
                autoCapitalize="none"
                className="w-full h-11 pl-11 pr-11 rounded-2xl bg-surface border border-hairline text-ink text-[16px] focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none placeholder:text-ink-faint transition-all duration-200 ease-out"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="press absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-xl text-ink-muted hover:bg-paper-deep animate-pop-in focus-ring"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </header>
      ) : (
        <ScreenHeader
          title="Words"
          subtitle={`${words.length} ${words.length === 1 ? "entry" : "entries"} in your library`}
          right={
            hasAny ? (
              <>
                <button
                  type="button"
                  aria-label="Search words"
                  onClick={() => setSearchOpen(true)}
                  className={iconBtn}
                >
                  <MagnifyingGlass size={18} weight="bold" />
                </button>
                <CompactToggle compact={compact} onToggle={setCompact} />
              </>
            ) : undefined
          }
        />
      )}
      <main className="px-4 pt-4 space-y-3.5">
        {hasAny && (
          <SetFilterChips
            sets={sets}
            value={filter}
            onChange={setFilter}
            counts={counts}
            totalCount={words.length}
          />
        )}

        {!hasAny ? (
          <EmptyState
            icon={<BookOpen size={32} weight="duotone" className="text-accent" />}
            title="No words yet"
            description="Head to the Add tab to save your first word."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={query ? "No matches" : "This set is empty"}
            description={
              query
                ? "Try a different search term."
                : "Add a word to this set from the Add tab."
            }
          />
        ) : (
          <WordList
            words={filtered}
            showSetChip={filter === ALL_FILTER}
            compact={compact}
          />
        )}
      </main>
    </>
  );
}
