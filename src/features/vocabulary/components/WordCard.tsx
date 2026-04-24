import { ArrowRight } from "@phosphor-icons/react";
import type { Word } from "../types";

interface Props {
  word: Word;
  setName?: string;
  onClick: () => void;
}

export default function WordCard({ word, setName, onClick }: Props) {
  return (
    <li className="animate-list-in">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left bg-white rounded-2xl p-3.5 ring-1 ring-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:ring-neutral-300 active:bg-neutral-50 transition"
      >
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[17px] font-semibold text-neutral-900 truncate">
            {word.word}
          </p>
          <ArrowRight size={14} weight="bold" className="text-neutral-300 shrink-0" />
          <p className="flex-1 text-[17px] text-neutral-700 truncate text-right">
            {word.translation}
          </p>
        </div>
        {word.explanation && (
          <p className="mt-1.5 text-[14px] text-neutral-500 line-clamp-3 leading-snug">
            {word.explanation}
          </p>
        )}
        {setName && (
          <div className="mt-2">
            <span className="inline-block text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
              {setName}
            </span>
          </div>
        )}
      </button>
    </li>
  );
}
