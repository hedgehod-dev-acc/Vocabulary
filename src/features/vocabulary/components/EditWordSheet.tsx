import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Star, Trash } from "@phosphor-icons/react";
import Sheet from "../../../shared/ui/Sheet";
import { useVocabulary } from "../VocabularyContext";
import { isFavoritesSetId } from "../storage";
import type { Word } from "../types";
import {
  btnDanger,
  btnPrimary,
  fieldInput,
  fieldSelect,
  fieldTextarea,
} from "../../../shared/ui/fields";

interface Props {
  word: Word | null;
  onClose: () => void;
}

export default function EditWordSheet({ word, onClose }: Props) {
  const { sets: allSets, updateWord, deleteWord, toggleFavorite } =
    useVocabulary();
  const sets = useMemo(
    () => allSets.filter((s) => !isFavoritesSetId(s.id)),
    [allSets]
  );
  const [wordText, setWordText] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [setId, setSetId] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!word) return;
    setWordText(word.word);
    setTranslation(word.translation);
    setExplanation(word.explanation ?? "");
    setSetId(word.setId);
    setIsFavorite(Boolean(word.isFavorite));
  }, [word]);

  if (!word) return null;

  const canSave =
    wordText.trim().length > 0 &&
    translation.trim().length > 0 &&
    Boolean(setId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave || !word) return;
    updateWord(word.id, {
      word: wordText,
      translation,
      explanation: explanation.trim() ? explanation : undefined,
      setId,
    });
    onClose();
  }

  function handleToggleFavorite() {
    if (!word) return;
    setIsFavorite((v) => !v);
    toggleFavorite(word.id);
  }

  function handleDelete() {
    if (!word) return;
    if (confirm(`Delete "${word.word}"?`)) {
      deleteWord(word.id);
      onClose();
    }
  }

  return (
    <Sheet open={Boolean(word)} title="Edit word" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={wordText}
          onChange={(e) => setWordText(e.target.value)}
          className={fieldInput}
          placeholder="Word"
          required
          autoCapitalize="none"
          maxLength={120}
        />
        <input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className={fieldInput}
          placeholder="Translation"
          required
          autoCapitalize="none"
          maxLength={120}
        />
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className={fieldTextarea}
          placeholder="Explanation (optional)"
          rows={3}
          maxLength={500}
        />
        <label className="block">
          <span className="block text-[13px] font-medium text-neutral-600 mb-1 ml-1">
            Set
          </span>
          <select
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            className={fieldSelect}
          >
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={isFavorite}
          className={`press w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors duration-200 focus-ring ${
            isFavorite
              ? "bg-accent-tint border-accent/40 text-accent-deep"
              : "bg-surface/70 border-hairline text-ink-soft hover:bg-surface"
          }`}
        >
          <span
            className={`grid place-items-center h-8 w-8 rounded-lg transition-colors ${
              isFavorite ? "bg-accent text-surface" : "bg-paper-deep text-ink-muted"
            }`}
          >
            <Star size={16} weight={isFavorite ? "fill" : "regular"} />
          </span>
          <span className="flex-1 text-left">
            <span className="block text-[14px] font-semibold">Favorite</span>
            <span className="block text-[12px] text-ink-muted">
              {isFavorite ? "Shown in the Favorites set" : "Mark to add to Favorites"}
            </span>
          </span>
        </button>
        <div className="flex items-center gap-2 pt-1">
          <button type="button" onClick={handleDelete} className={btnDanger}>
            <Trash size={16} weight="regular" /> Delete
          </button>
          <div className="flex-1" />
          <button type="submit" disabled={!canSave} className={btnPrimary}>
            Save
          </button>
        </div>
      </form>
    </Sheet>
  );
}
