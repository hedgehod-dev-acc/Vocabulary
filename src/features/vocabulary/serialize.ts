import type { Word, WordSet } from "./types";

export const EXPORT_VERSION = 1;

export interface ExportWord {
  word: string;
  translation: string;
  explanation?: string;
}

export interface ExportSet {
  name: string;
  words: ExportWord[];
}

export interface ExportPayload {
  version: number;
  exportedAt?: string;
  sets: ExportSet[];
}

function serializeSet(set: WordSet, words: Word[]): ExportSet {
  return {
    name: set.name,
    words: words
      .filter((w) => w.setId === set.id)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((w) => {
        const out: ExportWord = { word: w.word, translation: w.translation };
        if (w.explanation) out.explanation = w.explanation;
        return out;
      }),
  };
}

export function buildExport(sets: WordSet[], words: Word[]): ExportPayload {
  const sorted = sets.slice().sort((a, b) => a.createdAt - b.createdAt);
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    sets: sorted.map((s) => serializeSet(s, words)),
  };
}

export function buildExportForSet(set: WordSet, words: Word[]): ExportPayload {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    sets: [serializeSet(set, words)],
  };
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "set"
  );
}

export type ParseResult =
  | { ok: true; data: ExportPayload }
  | { ok: false; error: string };

export function parseImport(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Input is empty." };

  let raw: unknown;
  try {
    raw = JSON.parse(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid JSON.";
    return { ok: false, error: `Invalid JSON: ${msg}` };
  }

  if (!isRecord(raw)) {
    return { ok: false, error: "Top-level value must be a JSON object." };
  }

  if ("version" in raw && raw.version !== undefined) {
    if (typeof raw.version !== "number" || !Number.isFinite(raw.version)) {
      return { ok: false, error: "`version` must be a number." };
    }
    if (raw.version !== EXPORT_VERSION) {
      return {
        ok: false,
        error: `Unsupported version ${raw.version}. Expected ${EXPORT_VERSION}.`,
      };
    }
  }

  if (!Array.isArray(raw.sets)) {
    return { ok: false, error: "`sets` must be an array." };
  }
  if (raw.sets.length === 0) {
    return { ok: false, error: "`sets` is empty — nothing to import." };
  }

  const sets: ExportSet[] = [];
  for (let i = 0; i < raw.sets.length; i++) {
    const item = raw.sets[i];
    const where = `sets[${i}]`;
    if (!isRecord(item)) {
      return { ok: false, error: `${where} must be an object.` };
    }
    if (typeof item.name !== "string" || item.name.trim().length === 0) {
      return { ok: false, error: `${where}.name must be a non-empty string.` };
    }
    if (item.name.length > 120) {
      return { ok: false, error: `${where}.name is too long (max 120).` };
    }
    if (!Array.isArray(item.words)) {
      return { ok: false, error: `${where}.words must be an array.` };
    }

    const words: ExportWord[] = [];
    for (let j = 0; j < item.words.length; j++) {
      const w = item.words[j];
      const ww = `${where}.words[${j}]`;
      if (!isRecord(w)) {
        return { ok: false, error: `${ww} must be an object.` };
      }
      if (typeof w.word !== "string" || w.word.trim().length === 0) {
        return { ok: false, error: `${ww}.word must be a non-empty string.` };
      }
      if (typeof w.translation !== "string" || w.translation.trim().length === 0) {
        return {
          ok: false,
          error: `${ww}.translation must be a non-empty string.`,
        };
      }
      if (
        w.explanation !== undefined &&
        w.explanation !== null &&
        typeof w.explanation !== "string"
      ) {
        return {
          ok: false,
          error: `${ww}.explanation must be a string when present.`,
        };
      }
      const out: ExportWord = {
        word: w.word.trim(),
        translation: w.translation.trim(),
      };
      const exp =
        typeof w.explanation === "string" ? w.explanation.trim() : "";
      if (exp) out.explanation = exp;
      words.push(out);
    }

    sets.push({ name: item.name.trim(), words });
  }

  return {
    ok: true,
    data: { version: EXPORT_VERSION, sets },
  };
}

export const AI_PROMPT_TEMPLATE = `You generate vocabulary sets for a flashcard app. Reply with ONLY valid JSON matching this exact schema — no prose, no markdown fences:

{
  "version": 1,
  "sets": [
    {
      "name": "Set title (1-60 chars)",
      "words": [
        {
          "word": "term in source language",
          "translation": "translation in target language",
          "explanation": "optional short note (usage, gender, register)"
        }
      ]
    }
  ]
}

Rules:
- "explanation" is optional; omit the field when empty.
- Every "word" and "translation" must be non-empty strings.
- Group related items into one or more sets.
- Aim for 15-25 entries per set unless asked otherwise.

Topic: <DESCRIBE WHAT YOU WANT — e.g. "B2 French verbs about travel" or "Spanish kitchen vocabulary">`;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
