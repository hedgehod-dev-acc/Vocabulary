const PREFIX = "vocabulary-web.ui.";

const KEYS = {
  addSetId: PREFIX + "addSetId",
  wordsFilter: PREFIX + "wordsFilter",
  setsPath: PREFIX + "setsPath",
  compactWords: PREFIX + "compactWords",
} as const;

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota or privacy mode — ignore */
  }
}

export const uiPrefs = {
  getAddSetId: () => read(KEYS.addSetId),
  setAddSetId: (id: string) => write(KEYS.addSetId, id),

  getWordsFilter: () => read(KEYS.wordsFilter),
  setWordsFilter: (v: string) => write(KEYS.wordsFilter, v),

  getSetsPath: () => read(KEYS.setsPath),
  setSetsPath: (p: string) => write(KEYS.setsPath, p),

  getCompactWords: () => read(KEYS.compactWords) === "1",
  setCompactWords: (v: boolean) => write(KEYS.compactWords, v ? "1" : "0"),
};
