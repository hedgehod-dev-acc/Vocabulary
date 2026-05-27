import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Word, WordInput, WordPatch, WordSet } from "./types";
import {
  createDefaultState,
  isFavoritesSetId,
  loadState,
  saveState,
  type PersistedState,
} from "./storage";
import {
  buildExport,
  buildExportForSet,
  type ExportPayload,
} from "./serialize";
import { createId } from "../../shared/lib/id";

type Action =
  | { type: "ADD_WORD"; payload: Word }
  | { type: "UPDATE_WORD"; id: string; patch: WordPatch }
  | { type: "DELETE_WORD"; id: string }
  | { type: "REORDER_WORDS_IN_SET"; setId: string; orderedIds: string[] }
  | { type: "ADD_SET"; payload: WordSet }
  | { type: "RENAME_SET"; id: string; name: string }
  | { type: "DELETE_SET"; id: string }
  | { type: "REORDER_SETS"; orderedIds: string[] }
  | { type: "IMPORT_BUNDLE"; sets: WordSet[]; words: Word[] };

function reorderById<T extends { id: string }>(
  list: T[],
  orderedIds: string[]
): T[] {
  const byId = new Map(list.map((item) => [item.id, item]));
  const next: T[] = [];
  const seen = new Set<string>();
  for (const id of orderedIds) {
    const item = byId.get(id);
    if (item && !seen.has(id)) {
      next.push(item);
      seen.add(id);
    }
  }
  for (const item of list) {
    if (!seen.has(item.id)) next.push(item);
  }
  return next;
}

function reorderWordsInSet(
  words: Word[],
  setId: string,
  orderedIds: string[]
): Word[] {
  const inScope = words.filter((w) => w.setId === setId);
  const reordered = reorderById(inScope, orderedIds);
  let i = 0;
  return words.map((w) => (w.setId === setId ? reordered[i++] : w));
}

function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case "ADD_WORD":
      return { ...state, words: [action.payload, ...state.words] };
    case "UPDATE_WORD":
      return {
        ...state,
        words: state.words.map((w) =>
          w.id === action.id ? { ...w, ...action.patch } : w
        ),
      };
    case "DELETE_WORD":
      return { ...state, words: state.words.filter((w) => w.id !== action.id) };
    case "REORDER_WORDS_IN_SET":
      return {
        ...state,
        words: reorderWordsInSet(state.words, action.setId, action.orderedIds),
      };
    case "ADD_SET":
      return { ...state, sets: [...state.sets, action.payload] };
    case "RENAME_SET":
      return {
        ...state,
        sets: state.sets.map((s) =>
          s.id === action.id ? { ...s, name: action.name } : s
        ),
      };
    case "DELETE_SET":
      return {
        ...state,
        sets: state.sets.filter((s) => s.id !== action.id),
        words: state.words.filter((w) => w.setId !== action.id),
      };
    case "REORDER_SETS":
      return {
        ...state,
        sets: reorderById(state.sets, action.orderedIds),
      };
    case "IMPORT_BUNDLE":
      return {
        ...state,
        sets: [...state.sets, ...action.sets],
        words: [...action.words, ...state.words],
      };
    default:
      return state;
  }
}

export interface ImportSummary {
  setCount: number;
  wordCount: number;
}

export interface VocabularyContextValue {
  sets: WordSet[];
  words: Word[];
  addWord: (input: WordInput) => Word;
  updateWord: (id: string, patch: WordPatch) => void;
  deleteWord: (id: string) => void;
  toggleFavorite: (id: string) => void;
  reorderWordsInSet: (setId: string, orderedIds: string[]) => void;
  addSet: (name: string) => WordSet;
  renameSet: (id: string, name: string) => void;
  deleteSet: (id: string) => void;
  reorderSets: (orderedIds: string[]) => void;
  getSet: (id: string) => WordSet | undefined;
  getSetName: (id: string) => string;
  wordsInSet: (id: string) => Word[];
  exportBundle: () => ExportPayload;
  exportSet: (id: string) => ExportPayload | null;
  importBundle: (payload: ExportPayload) => ImportSummary;
}

const VocabularyContext = createContext<VocabularyContextValue | undefined>(
  undefined
);

function trimPatch(patch: WordPatch): WordPatch {
  const next: WordPatch = { ...patch };
  if (typeof next.word === "string") next.word = next.word.trim();
  if (typeof next.translation === "string")
    next.translation = next.translation.trim();
  if (typeof next.explanation === "string") {
    const trimmed = next.explanation.trim();
    next.explanation = trimmed.length > 0 ? trimmed : undefined;
  }
  return next;
}

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const loaded = loadState();
    if (loaded.sets.length === 0) return createDefaultState();
    const hasRealSet = loaded.sets.some((s) => !isFavoritesSetId(s.id));
    if (!hasRealSet) {
      const general: WordSet = {
        id: createId(),
        name: "General",
        createdAt: Date.now(),
      };
      return { ...loaded, sets: [...loaded.sets, general] };
    }
    return loaded;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<VocabularyContextValue>(() => {
    const getSet = (id: string) => state.sets.find((s) => s.id === id);
    return {
      sets: state.sets,
      words: state.words,
      addWord: (input) => {
        if (isFavoritesSetId(input.setId)) {
          throw new Error("Cannot add a word directly to the Favorites set.");
        }
        const word: Word = {
          id: createId(),
          word: input.word.trim(),
          translation: input.translation.trim(),
          explanation: input.explanation?.trim() || undefined,
          setId: input.setId,
          createdAt: Date.now(),
        };
        dispatch({ type: "ADD_WORD", payload: word });
        return word;
      },
      updateWord: (id, patch) => {
        const safe: WordPatch = { ...patch };
        if (safe.setId && isFavoritesSetId(safe.setId)) delete safe.setId;
        dispatch({ type: "UPDATE_WORD", id, patch: trimPatch(safe) });
      },
      deleteWord: (id) => dispatch({ type: "DELETE_WORD", id }),
      toggleFavorite: (id) => {
        const word = state.words.find((w) => w.id === id);
        if (!word) return;
        dispatch({
          type: "UPDATE_WORD",
          id,
          patch: { isFavorite: !word.isFavorite },
        });
      },
      reorderWordsInSet: (setId, orderedIds) =>
        dispatch({ type: "REORDER_WORDS_IN_SET", setId, orderedIds }),
      addSet: (name) => {
        const set: WordSet = {
          id: createId(),
          name: name.trim(),
          createdAt: Date.now(),
        };
        dispatch({ type: "ADD_SET", payload: set });
        return set;
      },
      renameSet: (id, name) => {
        if (isFavoritesSetId(id)) return;
        dispatch({ type: "RENAME_SET", id, name: name.trim() });
      },
      deleteSet: (id) => {
        if (isFavoritesSetId(id)) return;
        dispatch({ type: "DELETE_SET", id });
      },
      reorderSets: (orderedIds) =>
        dispatch({ type: "REORDER_SETS", orderedIds }),
      getSet,
      getSetName: (id) => getSet(id)?.name ?? "Unknown",
      wordsInSet: (id) =>
        isFavoritesSetId(id)
          ? state.words.filter((w) => w.isFavorite)
          : state.words.filter((w) => w.setId === id),
      exportBundle: () =>
        buildExport(
          state.sets.filter((s) => !isFavoritesSetId(s.id)),
          state.words
        ),
      exportSet: (id) => {
        if (isFavoritesSetId(id)) return null;
        const set = state.sets.find((s) => s.id === id);
        return set ? buildExportForSet(set, state.words) : null;
      },
      importBundle: (payload) => {
        const now = Date.now();
        const newSets: WordSet[] = [];
        const newWords: Word[] = [];
        payload.sets.forEach((s, sIndex) => {
          const set: WordSet = {
            id: createId(),
            name: s.name.trim(),
            createdAt: now + sIndex,
          };
          newSets.push(set);
          s.words.forEach((w, wIndex) => {
            newWords.push({
              id: createId(),
              word: w.word.trim(),
              translation: w.translation.trim(),
              explanation: w.explanation?.trim() || undefined,
              setId: set.id,
              createdAt: now + sIndex * 1000 + wIndex,
            });
          });
        });
        dispatch({ type: "IMPORT_BUNDLE", sets: newSets, words: newWords });
        return { setCount: newSets.length, wordCount: newWords.length };
      },
    };
  }, [state]);

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary(): VocabularyContextValue {
  const ctx = useContext(VocabularyContext);
  if (!ctx) {
    throw new Error("useVocabulary must be used within a VocabularyProvider");
  }
  return ctx;
}
