import type { Word, WordSet } from "./types";
import { createId } from "../../shared/lib/id";

const STORAGE_KEY = "vocabulary-web.v1";
const CURRENT_SCHEMA = 3;

export const FAVORITES_SET_ID = "__favorites__";
export const FAVORITES_SET_NAME = "Favorites";

export function createFavoritesSet(): WordSet {
  return { id: FAVORITES_SET_ID, name: FAVORITES_SET_NAME, createdAt: 0 };
}

export function isFavoritesSetId(id: string | null | undefined): boolean {
  return id === FAVORITES_SET_ID;
}

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
  return {
    schemaVersion: CURRENT_SCHEMA,
    sets: [createFavoritesSet(), defaultSet],
    words: [],
  };
}

// Migrate any pre-v2 state by collapsing the historical sort orders into the
// array order itself: sets oldest-first, words newest-first. After this the
// arrays carry the authoritative display order, so manual reordering just
// moves entries within the arrays. v3 adds a reserved Favorites pseudo-set.
function migrate(state: PersistedState): PersistedState {
  let sets = state.sets;
  let words = state.words;

  if (state.schemaVersion !== CURRENT_SCHEMA) {
    if (!state.schemaVersion || state.schemaVersion < 2) {
      sets = sets.slice().sort((a, b) => a.createdAt - b.createdAt);
      words = words.slice().sort((a, b) => b.createdAt - a.createdAt);
    }
    if (!sets.some((s) => s.id === FAVORITES_SET_ID)) {
      sets = [createFavoritesSet(), ...sets];
    }
    // Defensive: no word should claim the favorites id as its setId.
    if (words.some((w) => w.setId === FAVORITES_SET_ID)) {
      const fallback =
        sets.find((s) => s.id !== FAVORITES_SET_ID)?.id ?? sets[0]?.id;
      if (fallback) {
        words = words.map((w) =>
          w.setId === FAVORITES_SET_ID ? { ...w, setId: fallback } : w
        );
      }
    }
  }

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
