import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "@phosphor-icons/react";
import ScreenHeader from "../shared/ui/ScreenHeader";
import SearchInput from "../shared/ui/SearchInput";
import EmptyState from "../shared/ui/EmptyState";
import { useVocabulary } from "../features/vocabulary/VocabularyContext";
import { useFilteredWords } from "../features/vocabulary/useFilteredWords";
import { uiPrefs } from "../features/ui/uiPrefs";
import WordList from "../features/vocabulary/components/WordList";
import SetFilterChips, {
  ALL_FILTER,
  type SetChipValue,
} from "../features/vocabulary/components/SetFilterChips";

export default function WordsPage() {
  const { words, sets } = useVocabulary();
  const [query, setQuery] = useState("");
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

  return (
    <>
      <ScreenHeader
        title="Words"
        subtitle={`${words.length} ${words.length === 1 ? "entry" : "entries"} in your library`}
      />
      <main className="px-4 pt-4 space-y-3.5">
        {hasAny && <SearchInput value={query} onChange={setQuery} placeholder="Search in either language" />}
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
          <WordList words={filtered} showSetChip={filter === ALL_FILTER} />
        )}
      </main>
    </>
  );
}
