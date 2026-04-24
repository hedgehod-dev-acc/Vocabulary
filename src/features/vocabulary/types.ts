export interface WordSet {
  id: string;
  name: string;
  createdAt: number;
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  explanation?: string;
  setId: string;
  createdAt: number;
}

export type WordInput = Pick<Word, "word" | "translation" | "setId"> & {
  explanation?: string;
};

export type WordPatch = Partial<Omit<Word, "id" | "createdAt">>;
