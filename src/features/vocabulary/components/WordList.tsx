import { useState } from "react";
import type { Word } from "../types";
import WordCard from "./WordCard";
import EditWordSheet from "./EditWordSheet";
import { useVocabulary } from "../VocabularyContext";

interface Props {
  words: Word[];
  showSetChip?: boolean;
}

export default function WordList({ words, showSetChip = false }: Props) {
  const { getSetName } = useVocabulary();
  const [editing, setEditing] = useState<Word | null>(null);

  return (
    <>
      <ul className="space-y-2.5">
        {words.map((w, i) => (
          <WordCard
            key={w.id}
            word={w}
            index={i}
            setName={showSetChip ? getSetName(w.setId) : undefined}
            onClick={() => setEditing(w)}
          />
        ))}
      </ul>
      <EditWordSheet word={editing} onClose={() => setEditing(null)} />
    </>
  );
}
