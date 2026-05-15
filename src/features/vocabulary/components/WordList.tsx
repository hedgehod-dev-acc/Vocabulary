import { useCallback, useMemo, useState } from "react";
import type { Word } from "../types";
import WordCard from "./WordCard";
import EditWordSheet from "./EditWordSheet";
import { useVocabulary } from "../VocabularyContext";
import { useReorder, type ReorderApi } from "../../ui/useReorder";

interface Props {
  words: Word[];
  showSetChip?: boolean;
  compact?: boolean;
  reorderMode?: boolean;
  reorderSetId?: string;
}

const NOOP_REORDER: ReorderApi = {
  setRowRef: () => () => {},
  handleProps: () => ({
    onPointerDown: () => {},
    onPointerMove: () => {},
    onPointerUp: () => {},
    onPointerCancel: () => {},
    style: {},
  }),
  styleFor: () => ({}),
  draggingId: null,
};

export default function WordList({
  words,
  showSetChip = false,
  compact = false,
  reorderMode = false,
  reorderSetId,
}: Props) {
  const { getSetName, reorderWordsInSet } = useVocabulary();
  const [editing, setEditing] = useState<Word | null>(null);

  const ids = useMemo(() => words.map((w) => w.id), [words]);
  const onCommit = useCallback(
    (next: string[]) => {
      if (reorderSetId) reorderWordsInSet(reorderSetId, next);
    },
    [reorderSetId, reorderWordsInSet]
  );
  const liveReorder = useReorder(ids, onCommit);
  const reorder = reorderMode && reorderSetId ? liveReorder : NOOP_REORDER;

  function moveToEdge(id: string, edge: "first" | "last") {
    if (!reorderSetId) return;
    const without = ids.filter((x) => x !== id);
    reorderWordsInSet(
      reorderSetId,
      edge === "first" ? [id, ...without] : [...without, id]
    );
  }

  return (
    <>
      <ul className={compact ? "space-y-1.5" : "space-y-2.5"}>
        {words.map((w, i) => (
          <WordCard
            key={w.id}
            word={w}
            index={i}
            compact={compact}
            setName={showSetChip ? getSetName(w.setId) : undefined}
            onClick={() => setEditing(w)}
            reorderMode={reorderMode}
            isFirst={i === 0}
            isLast={i === words.length - 1}
            onMoveToTop={() => moveToEdge(w.id, "first")}
            onMoveToBottom={() => moveToEdge(w.id, "last")}
            rowRef={reorder.setRowRef(w.id)}
            rowStyle={reorder.styleFor(w.id)}
            handleProps={reorder.handleProps(w.id)}
            isDragging={reorder.draggingId === w.id}
          />
        ))}
      </ul>
      <EditWordSheet word={editing} onClose={() => setEditing(null)} />
    </>
  );
}
