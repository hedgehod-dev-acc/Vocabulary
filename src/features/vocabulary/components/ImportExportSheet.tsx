import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  DownloadSimple,
  Sparkle,
  UploadSimple,
  Warning,
} from "@phosphor-icons/react";
import Sheet from "../../../shared/ui/Sheet";
import {
  btnPrimary,
  btnSecondary,
  fieldTextarea,
} from "../../../shared/ui/fields";
import { useVocabulary } from "../VocabularyContext";
import { AI_PROMPT_TEMPLATE, parseImport } from "../serialize";
import { downloadJsonExport } from "../download";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Banner =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export default function ImportExportSheet({ open, onClose }: Props) {
  const { sets, words, exportBundle, importBundle } = useVocabulary();
  const [pasted, setPasted] = useState("");
  const [banner, setBanner] = useState<Banner>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setPasted("");
      setBanner(null);
      setPromptCopied(false);
    }
  }, [open]);

  const totalWords = words.length;
  const canExport = sets.length > 0;

  function handleExport() {
    downloadJsonExport(exportBundle(), "vocabulary");
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1800);
    } catch {
      setBanner({
        kind: "error",
        text: "Couldn't copy — your browser blocked clipboard access.",
      });
    }
  }

  function handleImportText() {
    const result = parseImport(pasted);
    if (!result.ok) {
      setBanner({ kind: "error", text: result.error });
      return;
    }
    const summary = importBundle(result.data);
    setBanner({
      kind: "success",
      text: `Imported ${summary.setCount} set${
        summary.setCount === 1 ? "" : "s"
      } and ${summary.wordCount} word${summary.wordCount === 1 ? "" : "s"}.`,
    });
    setPasted("");
  }

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      setPasted(text);
      const result = parseImport(text);
      if (!result.ok) {
        setBanner({ kind: "error", text: result.error });
        return;
      }
      const summary = importBundle(result.data);
      setBanner({
        kind: "success",
        text: `Imported ${summary.setCount} set${
          summary.setCount === 1 ? "" : "s"
        } and ${summary.wordCount} word${
          summary.wordCount === 1 ? "" : "s"
        } from ${file.name}.`,
      });
      setPasted("");
    } catch {
      setBanner({ kind: "error", text: "Couldn't read file." });
    }
  }

  const canImport = pasted.trim().length > 0;

  return (
    <Sheet open={open} title="Import / Export" onClose={onClose}>
      <div className="space-y-5">
        {banner && (
          <div
            role={banner.kind === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-[13px] ${
              banner.kind === "success"
                ? "bg-success/10 text-success"
                : "bg-danger-soft text-danger"
            }`}
          >
            {banner.kind === "success" ? (
              <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
            ) : (
              <Warning size={16} weight="fill" className="mt-0.5 shrink-0" />
            )}
            <span className="leading-snug">{banner.text}</span>
          </div>
        )}

        <section className="space-y-2">
          <SectionHeader title="Export" />
          <p className="text-[13px] text-ink-muted leading-snug">
            Download all {sets.length} set{sets.length === 1 ? "" : "s"} (
            {totalWords} word{totalWords === 1 ? "" : "s"}) as a JSON file.
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={!canExport}
            className={btnSecondary}
          >
            <DownloadSimple size={16} weight="bold" />
            Download JSON
          </button>
        </section>

        <Divider />

        <section className="space-y-2">
          <SectionHeader title="AI prompt" />
          <p className="text-[13px] text-ink-muted leading-snug">
            Copy a prompt that asks an LLM to generate vocabulary in this app's
            JSON format. Paste it into your AI of choice, then import the
            response below.
          </p>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className={btnSecondary}
          >
            {promptCopied ? (
              <>
                <CheckCircle size={16} weight="fill" /> Copied
              </>
            ) : (
              <>
                <Sparkle size={16} weight="bold" /> Copy AI prompt
              </>
            )}
          </button>
        </section>

        <Divider />

        <section className="space-y-2">
          <SectionHeader title="Import" />
          <p className="text-[13px] text-ink-muted leading-snug">
            Paste JSON or pick a file. Imported sets are added — existing data
            is never overwritten.
          </p>
          <textarea
            value={pasted}
            onChange={(e) => {
              setPasted(e.target.value);
              if (banner?.kind === "error") setBanner(null);
            }}
            className={`${fieldTextarea} font-mono text-[12.5px] leading-[1.5]`}
            placeholder='{"version":1,"sets":[…]}'
            rows={6}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleImportText}
              disabled={!canImport}
              className={btnPrimary}
            >
              <UploadSimple size={16} weight="bold" /> Import
            </button>
            <button
              type="button"
              onClick={handlePickFile}
              className={btnSecondary}
            >
              <UploadSimple size={16} weight="bold" /> From file…
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </section>
      </div>
    </Sheet>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3
      className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-muted"
      style={{ letterSpacing: "0.14em" }}
    >
      {title}
    </h3>
  );
}

function Divider() {
  return <div className="h-px bg-hairline" aria-hidden="true" />;
}
