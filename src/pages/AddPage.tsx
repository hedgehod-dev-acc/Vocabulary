import { useSearchParams } from "react-router-dom";
import ScreenHeader from "../shared/ui/ScreenHeader";
import AddWordForm from "../features/vocabulary/components/AddWordForm";
import { useVocabulary } from "../features/vocabulary/VocabularyContext";

export default function AddPage() {
  const { sets } = useVocabulary();
  const [params] = useSearchParams();
  const querySet = params.get("set");
  const defaultSetId =
    querySet && sets.some((s) => s.id === querySet) ? querySet : undefined;

  return (
    <>
      <ScreenHeader title="Add a word" subtitle="Capture · translate · learn" />
      <main className="px-4 pt-5 pb-4">
        <AddWordForm defaultSetId={defaultSetId} />
      </main>
    </>
  );
}
