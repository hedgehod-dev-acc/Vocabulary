import { useEffect, useState, type FormEvent } from "react";
import Sheet from "../../../shared/ui/Sheet";
import { btnPrimary, fieldInput } from "../../../shared/ui/fields";
import { useVocabulary } from "../VocabularyContext";
import type { WordSet } from "../types";

interface Props {
  set: WordSet | null;
  onClose: () => void;
}

export default function RenameSetSheet({ set, onClose }: Props) {
  const { renameSet } = useVocabulary();
  const [name, setName] = useState("");

  useEffect(() => {
    if (set) setName(set.name);
  }, [set]);

  if (!set) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !set) return;
    renameSet(set.id, trimmed);
    onClose();
  }

  return (
    <Sheet open={Boolean(set)} title="Rename set" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldInput}
          placeholder="Set name"
          maxLength={60}
          required
        />
        <div className="flex justify-end">
          <button type="submit" disabled={!name.trim()} className={btnPrimary}>
            Save
          </button>
        </div>
      </form>
    </Sheet>
  );
}
