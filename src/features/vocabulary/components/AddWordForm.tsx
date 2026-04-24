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
      1800
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <Field label="Set" delay={0}>
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
      </Field>

      <Field label="Word" delay={60}>
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
      </Field>

      <Field label="Translation" delay={120}>
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
      </Field>

      <Field
        label="Explanation"
        hint="optional"
        delay={180}
      >
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className={fieldTextarea}
          placeholder="Usage, mnemonic, sample sentence…"
          rows={3}
          maxLength={500}
        />
      </Field>

      <div className="flex items-center gap-2 pt-2 animate-fade-in" style={{ animationDelay: "240ms" }}>
        <div
          className={`text-[13px] font-medium flex items-center gap-1.5 transition-all duration-300 ${
            justAdded
              ? "opacity-100 translate-x-0 text-success"
              : "opacity-0 -translate-x-1"
          }`}
          aria-live="polite"
        >
          <span className="grid place-items-center h-5 w-5 rounded-full bg-success/15 animate-pop-in">
            <Check size={12} weight="bold" />
          </span>
          Added
        </div>
        <div className="flex-1" />
        <button type="submit" disabled={!canSubmit} className={btnPrimary}>
          <Plus size={16} weight="bold" /> Add word
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  delay = 0,
  children,
}: {
  label: string;
  hint?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <label className="block animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-muted mb-1.5 ml-0.5">
        {label}
        {hint && (
          <span className="ml-1.5 normal-case tracking-normal text-ink-faint font-normal">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
