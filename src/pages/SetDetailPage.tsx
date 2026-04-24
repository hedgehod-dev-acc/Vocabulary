import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  DownloadSimple,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import ScreenHeader from "../shared/ui/ScreenHeader";
import SearchInput from "../shared/ui/SearchInput";
import EmptyState from "../shared/ui/EmptyState";
import WordList from "../features/vocabulary/components/WordList";
import RenameSetSheet from "../features/vocabulary/components/RenameSetSheet";
import { useVocabulary } from "../features/vocabulary/VocabularyContext";
import { useFilteredWords } from "../features/vocabulary/useFilteredWords";
import { downloadJsonExport } from "../features/vocabulary/download";
import { slugify } from "../features/vocabulary/serialize";
import { routes } from "../app/routes";
import { btnPrimary, iconBtn } from "../shared/ui/fields";
import type { WordSet } from "../features/vocabulary/types";

export default function SetDetailPage() {
  const { setId = "" } = useParams<{ setId: string }>();
  const { getSet, sets, words, wordsInSet, deleteSet, exportSet } =
    useVocabulary();
  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<WordSet | null>(null);

  const set = getSet(setId);

  const setWords = set ? wordsInSet(set.id) : [];
  const filtered = useFilteredWords({
    words,
    query,
    setId: set?.id ?? null,
  });

  if (!set) {
    return <Navigate to={routes.sets} replace />;
  }

  function handleExport(target: WordSet) {
    const payload = exportSet(target.id);
    if (!payload) return;
    downloadJsonExport(payload, `vocabulary-${slugify(target.name)}`);
  }

  function handleDelete(target: WordSet) {
    if (sets.length <= 1) {
      alert("You need at least one set.");
      return;
    }
    const count = setWords.length;
    const msg =
      count > 0
        ? `Delete "${target.name}" and its ${count} word${count === 1 ? "" : "s"}?`
        : `Delete "${target.name}"?`;
    if (confirm(msg)) {
      deleteSet(target.id);
    }
  }

  return (
    <>
      <ScreenHeader
        title={set.name}
        subtitle={`${setWords.length} word${setWords.length === 1 ? "" : "s"}`}
        back={routes.sets}
        right={
          <>
            <button
              type="button"
              aria-label="Export set"
              onClick={() => handleExport(set)}
              className={iconBtn}
            >
              <DownloadSimple size={18} weight="regular" />
            </button>
            <button
              type="button"
              aria-label="Rename set"
              onClick={() => setRenaming(set)}
              className={iconBtn}
            >
              <PencilSimple size={18} weight="regular" />
            </button>
            <button
              type="button"
              aria-label="Delete set"
              onClick={() => handleDelete(set)}
              disabled={sets.length <= 1}
              className={`${iconBtn} text-danger hover:bg-danger-soft disabled:opacity-30`}
            >
              <Trash size={18} weight="regular" />
            </button>
          </>
        }
      />
      <main className="px-4 pt-4 space-y-3.5">
        {setWords.length > 0 && (
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={`Search in ${set.name}`}
          />
        )}
        {setWords.length === 0 ? (
          <EmptyState
            title="No words in this set"
            description="Add words to this set from the Add tab."
            action={
              <Link
                to={`${routes.add}?set=${set.id}`}
                className={btnPrimary}
              >
                <Plus size={16} weight="bold" /> Add a word
              </Link>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try a different search term."
          />
        ) : (
          <WordList words={filtered} />
        )}
      </main>
      <RenameSetSheet set={renaming} onClose={() => setRenaming(null)} />
    </>
  );
}
