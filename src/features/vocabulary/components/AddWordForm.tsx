import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Plus } from "@phosphor-icons/react";
import { useVocabulary } from "../VocabularyContext";
import {
  btnPrimary,
  fieldInput,
  fieldSelect,
  fieldTextarea,
} from "../../../shared/ui/fields";

interface Props {
  defaultSetId?: string;
  onAdded?: () => void;
}

export default function AddWordForm({ defaultSetId, onAdded }: Props) {
  const { sets, addWord } = useVocabulary();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [setId, setSetId] = useState<string>(
    () => defaultSetId ?? sets[0]?.id ?? ""
  );
  const [justAdded, setJustAdded] = useState(false);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (defaultSetId) setSetId(defaultSetId);
  }, [defaultSetId]);

  useEffect(() => {
    if (!sets.some((s) => s.id === setId) && sets[0]) setSetId(sets[0].id);
  }, [sets, setId]);

  useEffect(
    () => () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    },
    []
  );

  const canSubmit =
    word.trim().length > 0 && translation.trim().length > 0 && Boolean(setId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    addWord({
      word,
      translation,
      explanation: explanation.trim() ? explanation : undefined,
      setId,
    });
    setWord("");
    setTranslation("");
    setExplanation("");
    setJustAdded(true);
    wordInputRef.current?.focus();
    onAdded?.();
    if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(
      () => setJustAdded(false),
      1600
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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

      <div>
        <label className="block text-[13px] font-medium text-neutral-600 mb-1 ml-1">
          Word
        </label>
        <input
          ref={wordInputRef}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className={fieldInput}
          placeholder="e.g. Serendipity"
          required
          autoComplete="off"
          autoCapitalize="none"
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-neutral-600 mb-1 ml-1">
          Translation
        </label>
        <input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className={fieldInput}
          placeholder="e.g. Wypadkowe szczęście"
          required
          autoComplete="off"
          autoCapitalize="none"
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-neutral-600 mb-1 ml-1">
          Explanation{" "}
          <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className={fieldTextarea}
          placeholder="Usage, mnemonic, sample sentence…"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <div
          className={`text-[13px] font-medium flex items-center gap-1 transition-opacity ${
            justAdded ? "opacity-100 text-emerald-600" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <Check size={14} weight="bold" /> Added
        </div>
        <div className="flex-1" />
        <button type="submit" disabled={!canSubmit} className={btnPrimary}>
          <Plus size={16} weight="bold" /> Add word
        </button>
      </div>
    </form>
  );
}
