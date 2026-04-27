import { useEffect, useState } from "react";
import { uiPrefs } from "./uiPrefs";

export function useCompactWords(): [boolean, (v: boolean) => void] {
  const [compact, setCompact] = useState<boolean>(() =>
    uiPrefs.getCompactWords()
  );

  useEffect(() => {
    uiPrefs.setCompactWords(compact);
  }, [compact]);

  return [compact, setCompact];
}
