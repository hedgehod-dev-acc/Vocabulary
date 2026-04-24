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
  | { type: "ADD_SET"; payload: WordSet }
  | { type: "RENAME_SET"; id: string; name: string }
  | { type: "DELETE_SET"; id: string }
  | { type: "IMPORT_BUNDLE"; sets: WordSet[]; words: Word[] };

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
        sets: state.sets.filter((s) => s.id !== action.id),
        words: state.words.filter((w) => w.setId !== action.id),
      };
    case "IMPORT_BUNDLE":
      return {
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
  addSet: (name: string) => WordSet;
  renameSet: (id: string, name: string) => void;
  deleteSet: (id: string) => void;
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
    return loaded.sets.length === 0 ? createDefaultState() : loaded;
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
      updateWord: (id, patch) =>
        dispatch({ type: "UPDATE_WORD", id, patch: trimPatch(patch) }),
      deleteWord: (id) => dispatch({ type: "DELETE_WORD", id }),
      addSet: (name) => {
        const set: WordSet = {
          id: createId(),
          name: name.trim(),
          createdAt: Date.now(),
        };
        dispatch({ type: "ADD_SET", payload: set });
        return set;
      },
      renameSet: (id, name) =>
        dispatch({ type: "RENAME_SET", id, name: name.trim() }),
      deleteSet: (id) => dispatch({ type: "DELETE_SET", id }),
      getSet,
      getSetName: (id) => getSet(id)?.name ?? "Unknown",
      wordsInSet: (id) => state.words.filter((w) => w.setId === id),
      exportBundle: () => buildExport(state.sets, state.words),
      exportSet: (id) => {
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
