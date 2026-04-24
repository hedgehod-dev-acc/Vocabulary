import { useEffect, useState, type FormEvent } from "react";
import { Trash } from "@phosphor-icons/react";
import Sheet from "../../../shared/ui/Sheet";
import { useVocabulary } from "../VocabularyContext";
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
  const { sets, updateWord, deleteWord } = useVocabulary();
  const [wordText, setWordText] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [setId, setSetId] = useState("");

  useEffect(() => {
    if (!word) return;
    setWordText(word.word);
    setTranslation(word.translation);
    setExplanation(word.explanation ?? "");
    setSetId(word.setId);
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
