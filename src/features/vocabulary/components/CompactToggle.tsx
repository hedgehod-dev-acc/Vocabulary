import { Rows } from "@phosphor-icons/react";
import { iconBtn } from "../../../shared/ui/fields";

interface Props {
  compact: boolean;
  onToggle: (v: boolean) => void;
}

export default function CompactToggle({ compact, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-label={compact ? "Switch to full view" : "Switch to compact view"}
      aria-pressed={compact}
      onClick={() => onToggle(!compact)}
      className={`${iconBtn} ${compact ? "text-accent" : ""}`}
    >
      <Rows size={18} weight={compact ? "fill" : "regular"} />
    </button>
  );
}
