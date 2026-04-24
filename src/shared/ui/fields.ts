export const fieldBase =
  "w-full px-3.5 rounded-xl bg-surface/70 border border-hairline text-ink text-[16px] placeholder:text-ink-faint focus:bg-surface focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out";

export const fieldInput = `${fieldBase} h-11`;

export const fieldTextarea = `${fieldBase} py-2.5 leading-[1.45]`;

export const fieldSelect = `${fieldInput} pr-9 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22><path%20d=%22M1%201l4%204%204-4%22%20fill=%22none%22%20stroke=%22%236b6357%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22/></svg>')] bg-no-repeat bg-[length:10px_6px] bg-[position:calc(100%-14px)_center]`;

export const btnPrimary =
  "press inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl bg-accent text-surface font-semibold text-[15px] tracking-tight shadow-[0_10px_24px_-12px_rgba(141,56,20,0.55)] hover:bg-accent-deep hover:shadow-[0_14px_30px_-12px_rgba(141,56,20,0.7)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-ring";

export const btnSecondary =
  "press inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-paper-deep text-ink font-medium text-[15px] hover:bg-hairline-strong focus-ring";

export const btnGhost =
  "press inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-ink-soft font-medium text-[15px] hover:bg-paper-deep focus-ring";

export const btnDanger =
  "press inline-flex items-center justify-center gap-1.5 h-11 px-3.5 rounded-xl text-danger font-medium text-[15px] hover:bg-danger-soft focus-ring";

export const iconBtn =
  "press h-10 w-10 grid place-items-center rounded-xl text-ink-soft hover:bg-paper-deep focus-ring";
