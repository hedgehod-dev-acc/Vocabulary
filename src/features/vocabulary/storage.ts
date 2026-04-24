import type { Word, WordSet } from "./types";
import { createId } from "../../shared/lib/id";

const STORAGE_KEY = "vocabulary-web.v1";

export interface PersistedState {
  sets: WordSet[];
  words: Word[];
}

export function createDefaultState(): PersistedState {
  const defaultSet: WordSet = {
    id: createId(),
    name: "General",
    createdAt: Date.now(),
  };
  return { sets: [defaultSet], words: [] };
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed.sets || parsed.sets.length === 0) return createDefaultState();
    return {
      sets: parsed.sets,
      words: parsed.words ?? [],
    };
  } catch {
    return createDefaultState();
  }
}

export function saveState(state: PersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or privacy mode — ignore */
  }
}
