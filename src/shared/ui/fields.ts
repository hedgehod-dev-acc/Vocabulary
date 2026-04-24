export const fieldBase =
  "w-full px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-[16px] focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none placeholder:text-neutral-400 transition";

export const fieldInput = `${fieldBase} h-11`;

export const fieldTextarea = `${fieldBase} py-2.5 leading-[1.35]`;

export const fieldSelect = `${fieldInput} pr-8 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22><path%20d=%22M1%201l4%204%204-4%22%20fill=%22none%22%20stroke=%22%23737373%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22/></svg>')] bg-no-repeat bg-[length:10px_6px] bg-[position:calc(100%-12px)_center]`;

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:bg-indigo-700 transition";

export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-neutral-100 text-neutral-800 font-medium text-[15px] hover:bg-neutral-200 active:bg-neutral-300 transition";

export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-neutral-700 font-medium text-[15px] hover:bg-neutral-100 active:bg-neutral-200 transition";

export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-rose-600 font-medium text-[15px] hover:bg-rose-50 active:bg-rose-100 transition";

export const iconBtn =
  "h-10 w-10 grid place-items-center rounded-xl text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition";
