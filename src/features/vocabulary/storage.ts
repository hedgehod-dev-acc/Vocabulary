import type { Word, WordSet } from "./types";
import { createId } from "../../shared/lib/id";

const STORAGE_KEY = "vocabulary-web.v1";
const CURRENT_SCHEMA = 2;

export interface PersistedState {
  schemaVersion?: number;
  sets: WordSet[];
  words: Word[];
}

export function createDefaultState(): PersistedState {
  const defaultSet: WordSet = {
    id: createId(),
    name: "General",
    createdAt: Date.now(),
  };
  return { schemaVersion: CURRENT_SCHEMA, sets: [defaultSet], words: [] };
}

// Migrate any pre-v2 state by collapsing the historical sort orders into the
// array order itself: sets oldest-first, words newest-first. After this the
// arrays carry the authoritative display order, so manual reordering just
// moves entries within the arrays.
function migrate(state: PersistedState): PersistedState {
  if (state.schemaVersion === CURRENT_SCHEMA) return state;
  const sets = state.sets.slice().sort((a, b) => a.createdAt - b.createdAt);
  const words = state.words.slice().sort((a, b) => b.createdAt - a.createdAt);
  return { schemaVersion: CURRENT_SCHEMA, sets, words };
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed.sets || parsed.sets.length === 0) return createDefaultState();
    return migrate({
      schemaVersion: parsed.schemaVersion,
      sets: parsed.sets,
      words: parsed.words ?? [],
    });
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
