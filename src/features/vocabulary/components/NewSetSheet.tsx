import { useEffect, useState, type FormEvent } from "react";
import Sheet from "../../../shared/ui/Sheet";
import { btnPrimary, fieldInput } from "../../../shared/ui/fields";
import { useVocabulary } from "../VocabularyContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export default function NewSetSheet({ open, onClose, onCreated }: Props) {
  const { addSet } = useVocabulary();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = addSet(trimmed);
    onCreated?.(created.id);
    onClose();
  }

  return (
    <Sheet open={open} title="New set" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldInput}
          placeholder="Set name"
          autoFocus
          maxLength={60}
          required
          autoCapitalize="words"
        />
        <div className="flex justify-end">
          <button type="submit" disabled={!name.trim()} className={btnPrimary}>
            Create
          </button>
        </div>
      </form>
    </Sheet>
  );
}
