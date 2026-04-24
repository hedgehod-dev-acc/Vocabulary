import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CaretRight,
  FolderSimple,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import ScreenHeader from "../shared/ui/ScreenHeader";
import EmptyState from "../shared/ui/EmptyState";
import { useVocabulary } from "../features/vocabulary/VocabularyContext";
import NewSetSheet from "../features/vocabulary/components/NewSetSheet";
import RenameSetSheet from "../features/vocabulary/components/RenameSetSheet";
import { btnPrimary, iconBtn } from "../shared/ui/fields";
import { routes } from "../app/routes";
import type { WordSet } from "../features/vocabulary/types";

export default function SetsPage() {
  const { sets, words, deleteSet } = useVocabulary();
  const [newOpen, setNewOpen] = useState(false);
  const [renaming, setRenaming] = useState<WordSet | null>(null);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const w of words) out[w.setId] = (out[w.setId] ?? 0) + 1;
    return out;
  }, [words]);

  const sorted = sets.slice().sort((a, b) => a.createdAt - b.createdAt);

  function handleDelete(set: WordSet) {
    if (sets.length <= 1) {
      alert("You need at least one set.");
      return;
    }
    const count = counts[set.id] ?? 0;
    const msg =
      count > 0
        ? `Delete "${set.name}" and its ${count} word${count === 1 ? "" : "s"}?`
        : `Delete "${set.name}"?`;
    if (confirm(msg)) deleteSet(set.id);
  }

  return (
    <>
      <ScreenHeader
        title="Sets"
        subtitle={`${sets.length} set${sets.length === 1 ? "" : "s"}`}
        right={
          <button
            type="button"
            onClick={() => setNewOpen(true)}
            aria-label="New set"
            className={iconBtn}
          >
            <Plus size={20} weight="bold" />
          </button>
        }
      />
      <main className="px-4 pt-3">
        {sets.length === 0 ? (
          <EmptyState
            icon={<FolderSimple size={40} weight="duotone" className="text-indigo-500" />}
            title="No sets"
            description="Create a set to group your words."
            action={
              <button
                type="button"
                onClick={() => setNewOpen(true)}
                className={btnPrimary}
              >
                <Plus size={16} weight="bold" /> New set
              </button>
            }
          />
        ) : (
          <ul className="space-y-2">
            {sorted.map((s) => {
              const count = counts[s.id] ?? 0;
              return (
                <li key={s.id} className="animate-list-in">
                  <div className="flex items-center gap-1 bg-white rounded-2xl ring-1 ring-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <Link
                      to={routes.setDetail(s.id)}
                      className="flex-1 min-w-0 flex items-center gap-3 pl-4 pr-1 py-3 active:bg-neutral-50 rounded-2xl"
                    >
                      <div className="h-9 w-9 grid place-items-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                        <FolderSimple size={20} weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-neutral-900 truncate">
                          {s.name}
                        </p>
                        <p className="text-[12px] text-neutral-500 tabular-nums">
                          {count} word{count === 1 ? "" : "s"}
                        </p>
                      </div>
                      <CaretRight
                        size={16}
                        weight="bold"
                        className="text-neutral-300 shrink-0"
                      />
                    </Link>
                    <div className="flex items-center gap-0.5 pr-2">
                      <button
                        type="button"
                        aria-label={`Rename ${s.name}`}
                        onClick={() => setRenaming(s)}
                        className="h-9 w-9 grid place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
                      >
                        <PencilSimple size={16} weight="regular" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${s.name}`}
                        onClick={() => handleDelete(s)}
                        disabled={sets.length <= 1}
                        className="h-9 w-9 grid place-items-center rounded-lg text-rose-600 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash size={16} weight="regular" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <NewSetSheet open={newOpen} onClose={() => setNewOpen(false)} />
      <RenameSetSheet set={renaming} onClose={() => setRenaming(null)} />
    </>
  );
}
