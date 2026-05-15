import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLineDown,
  ArrowLineUp,
  ArrowsDownUp,
  CaretRight,
  Check,
  DotsSixVertical,
  DownloadSimple,
  Export,
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
import ImportExportSheet from "../features/vocabulary/components/ImportExportSheet";
import { downloadJsonExport } from "../features/vocabulary/download";
import { slugify } from "../features/vocabulary/serialize";
import { useReorder } from "../features/ui/useReorder";
import { btnPrimary, iconBtn } from "../shared/ui/fields";
import { routes } from "../app/routes";
import type { WordSet } from "../features/vocabulary/types";

export default function SetsPage() {
  const { sets, words, deleteSet, exportSet, reorderSets } = useVocabulary();
  const [newOpen, setNewOpen] = useState(false);
  const [renaming, setRenaming] = useState<WordSet | null>(null);
  const [ioOpen, setIoOpen] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);

  const ids = useMemo(() => sets.map((s) => s.id), [sets]);
  const onReorderCommit = useCallback(
    (next: string[]) => reorderSets(next),
    [reorderSets]
  );
  const reorder = useReorder(ids, onReorderCommit);

  function moveToEdge(id: string, edge: "first" | "last") {
    const without = ids.filter((x) => x !== id);
    reorderSets(edge === "first" ? [id, ...without] : [...without, id]);
  }

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const w of words) out[w.setId] = (out[w.setId] ?? 0) + 1;
    return out;
  }, [words]);

  function handleExportSet(set: WordSet) {
    const payload = exportSet(set.id);
    if (!payload) return;
    downloadJsonExport(payload, `vocabulary-${slugify(set.name)}`);
  }

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

  const canReorder = sets.length > 1;

  return (
    <>
      <ScreenHeader
        title={reorderMode ? "Reorder sets" : "Sets"}
        subtitle={
          reorderMode
            ? "Tap arrows to move"
            : `${sets.length} set${sets.length === 1 ? "" : "s"}`
        }
        right={
          reorderMode ? (
            <button
              type="button"
              onClick={() => setReorderMode(false)}
              aria-label="Done reordering"
              className={iconBtn}
            >
              <Check size={20} weight="bold" />
            </button>
          ) : (
            <>
              {canReorder && (
                <button
                  type="button"
                  onClick={() => setReorderMode(true)}
                  aria-label="Reorder sets"
                  className={iconBtn}
                >
                  <ArrowsDownUp size={20} weight="bold" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIoOpen(true)}
                aria-label="Import or export sets"
                className={iconBtn}
              >
                <Export size={20} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => setNewOpen(true)}
                aria-label="New set"
                className={iconBtn}
              >
                <Plus size={20} weight="bold" />
              </button>
            </>
          )
        }
      />
      <main className="px-4 pt-4">
        {sets.length === 0 ? (
          <EmptyState
            icon={<FolderSimple size={32} weight="duotone" className="text-accent" />}
            title="No sets yet"
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
          <ul className="space-y-2.5">
            {sets.map((s, i) => {
              const count = counts[s.id] ?? 0;
              const isFirst = i === 0;
              const isLast = i === sets.length - 1;
              const isDragging = reorder.draggingId === s.id;
              return (
                <li
                  key={s.id}
                  ref={reorderMode ? reorder.setRowRef(s.id) : undefined}
                  className={reorderMode ? "" : "animate-list-in"}
                  style={
                    reorderMode
                      ? reorder.styleFor(s.id)
                      : { animationDelay: `${Math.min(i, 12) * 35}ms` }
                  }
                >
                  <div
                    className={`group flex items-center gap-1 bg-surface rounded-2xl ring-1 transition-shadow duration-300 ${
                      isDragging
                        ? "ring-accent shadow-[var(--shadow-lift)]"
                        : "ring-hairline shadow-[var(--shadow-card)] hover:ring-hairline-strong hover:shadow-[var(--shadow-lift)]"
                    }`}
                  >
                    {reorderMode ? (
                      <>
                        <button
                          type="button"
                          aria-label={`Drag ${s.name}`}
                          {...reorder.handleProps(s.id)}
                          className="h-12 w-9 grid place-items-center text-ink-faint hover:text-ink-soft cursor-grab active:cursor-grabbing focus-ring rounded-l-2xl"
                        >
                          <DotsSixVertical size={20} weight="bold" />
                        </button>
                        <div className="flex-1 min-w-0 flex items-center gap-3 pr-1 py-3">
                          <div className="relative h-10 w-10 grid place-items-center rounded-xl bg-accent-tint text-accent-deep shrink-0">
                            <FolderSimple size={20} weight="fill" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-display text-[18px] font-semibold text-ink truncate"
                              style={{ letterSpacing: "-0.01em" }}
                            >
                              {s.name}
                            </p>
                            <p className="text-[12px] text-ink-muted tabular">
                              {count} word{count === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={routes.setDetail(s.id)}
                        className="press flex-1 min-w-0 flex items-center gap-3 pl-3.5 pr-1 py-3 rounded-2xl focus-ring"
                      >
                        <div className="relative h-10 w-10 grid place-items-center rounded-xl bg-accent-tint text-accent-deep shrink-0 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-105 group-hover:rotate-[-3deg]">
                          <FolderSimple size={20} weight="fill" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-display text-[18px] font-semibold text-ink truncate"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {s.name}
                          </p>
                          <p className="text-[12px] text-ink-muted tabular">
                            {count} word{count === 1 ? "" : "s"}
                          </p>
                        </div>
                        <CaretRight
                          size={16}
                          weight="bold"
                          className="text-ink-faint shrink-0 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:text-accent"
                        />
                      </Link>
                    )}
                    <div className="flex items-center gap-0.5 pr-2">
                      {reorderMode ? (
                        <>
                          <button
                            type="button"
                            aria-label={`Move ${s.name} to top`}
                            onClick={() => moveToEdge(s.id, "first")}
                            disabled={isFirst}
                            className="press h-9 w-9 grid place-items-center rounded-lg text-ink-soft hover:bg-paper-deep disabled:opacity-30 disabled:hover:bg-transparent focus-ring"
                          >
                            <ArrowLineUp size={16} weight="bold" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${s.name} to bottom`}
                            onClick={() => moveToEdge(s.id, "last")}
                            disabled={isLast}
                            className="press h-9 w-9 grid place-items-center rounded-lg text-ink-soft hover:bg-paper-deep disabled:opacity-30 disabled:hover:bg-transparent focus-ring"
                          >
                            <ArrowLineDown size={16} weight="bold" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label={`Export ${s.name}`}
                            onClick={() => handleExportSet(s)}
                            className="press h-9 w-9 grid place-items-center rounded-lg text-ink-muted hover:bg-paper-deep focus-ring"
                          >
                            <DownloadSimple size={16} weight="regular" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Rename ${s.name}`}
                            onClick={() => setRenaming(s)}
                            className="press h-9 w-9 grid place-items-center rounded-lg text-ink-muted hover:bg-paper-deep focus-ring"
                          >
                            <PencilSimple size={16} weight="regular" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${s.name}`}
                            onClick={() => handleDelete(s)}
                            disabled={sets.length <= 1}
                            className="press h-9 w-9 grid place-items-center rounded-lg text-danger hover:bg-danger-soft disabled:opacity-30 disabled:hover:bg-transparent focus-ring"
                          >
                            <Trash size={16} weight="regular" />
                          </button>
                        </>
                      )}
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
      <ImportExportSheet open={ioOpen} onClose={() => setIoOpen(false)} />
    </>
  );
}
