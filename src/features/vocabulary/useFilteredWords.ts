import { useMemo } from "react";
import type { Word } from "./types";

interface Options {
  words: Word[];
  query?: string;
  setId?: string | null;
}

export function useFilteredWords({ words, query = "", setId = null }: Options): Word[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const scoped = setId ? words.filter((w) => w.setId === setId) : words;
    if (!q) return scoped;
    return scoped.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        (w.explanation?.toLowerCase().includes(q) ?? false)
    );
  }, [words, query, setId]);
}
