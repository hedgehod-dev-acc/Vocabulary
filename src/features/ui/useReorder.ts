import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface RowRect {
  id: string;
  top: number;
  height: number;
  stride: number;
}

interface DragState {
  pointerY: number;
  sourceIndex: number;
  rects: RowRect[];
}

export interface ReorderApi {
  setRowRef: (id: string) => (el: HTMLElement | null) => void;
  handleProps: (id: string) => {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
    style: CSSProperties;
  };
  styleFor: (id: string) => CSSProperties;
  draggingId: string | null;
}

export function useReorder(
  ids: string[],
  onCommit: (next: string[]) => void
): ReorderApi {
  const rowRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const dragRef = useRef<DragState | null>(null);
  const idsRef = useRef(ids);
  const commitRef = useRef(onCommit);
  const targetRef = useRef<number | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [delta, setDelta] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);
  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);
  useEffect(() => {
    targetRef.current = targetIndex;
  }, [targetIndex]);

  const setRowRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) rowRefs.current.set(id, el);
      else rowRefs.current.delete(id);
    },
    []
  );

  const onPointerDown = useCallback(
    (id: string) => (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const sourceIndex = idsRef.current.indexOf(id);
      if (sourceIndex < 0) return;
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* unsupported — drag will still work with global listeners on the same node */
      }
      const rects: RowRect[] = idsRef.current.map((rid) => {
        const el = rowRefs.current.get(rid);
        const r = el?.getBoundingClientRect();
        return {
          id: rid,
          top: r?.top ?? 0,
          height: r?.height ?? 0,
          stride: r?.height ?? 0,
        };
      });
      for (let i = 0; i < rects.length - 1; i++) {
        rects[i].stride = rects[i + 1].top - rects[i].top;
      }
      if (rects.length >= 2) {
        rects[rects.length - 1].stride = rects[rects.length - 2].stride;
      }
      dragRef.current = { pointerY: e.clientY, sourceIndex, rects };
      setDraggingId(id);
      setDelta(0);
      setTargetIndex(sourceIndex);
    },
    []
  );

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const d = e.clientY - drag.pointerY;
    setDelta(d);
    const src = drag.rects[drag.sourceIndex];
    const draggedCenter = src.top + src.height / 2 + d;
    let target = drag.sourceIndex;
    for (let i = 0; i < drag.rects.length; i++) {
      if (i === drag.sourceIndex) continue;
      const r = drag.rects[i];
      const center = r.top + r.height / 2;
      if (i < drag.sourceIndex && draggedCenter < center) {
        target = i;
        break;
      }
      if (i > drag.sourceIndex && draggedCenter > center) {
        target = i;
      }
    }
    setTargetIndex(target);
  }, []);

  const finish = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag) {
      const target = targetRef.current ?? drag.sourceIndex;
      if (target !== drag.sourceIndex) {
        const next = idsRef.current.slice();
        const [moved] = next.splice(drag.sourceIndex, 1);
        next.splice(target, 0, moved);
        commitRef.current(next);
      }
    }
    setDraggingId(null);
    setDelta(0);
    setTargetIndex(null);
  }, []);

  const handleProps = useCallback(
    (id: string) => ({
      onPointerDown: onPointerDown(id),
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      style: { touchAction: "none" as const },
    }),
    [onPointerDown, onPointerMove, finish]
  );

  const styleFor = useCallback(
    (id: string): CSSProperties => {
      const drag = dragRef.current;
      if (!drag) return {};
      if (id === draggingId) {
        return {
          transform: `translate3d(0, ${delta}px, 0)`,
          transition: "none",
          zIndex: 10,
          position: "relative",
        };
      }
      if (targetIndex == null) return { transition: "transform 200ms ease" };
      const i = idsRef.current.indexOf(id);
      if (i < 0) return {};
      const stride = drag.rects[drag.sourceIndex].stride;
      let offset = 0;
      if (drag.sourceIndex < targetIndex && i > drag.sourceIndex && i <= targetIndex) {
        offset = -stride;
      } else if (
        drag.sourceIndex > targetIndex &&
        i < drag.sourceIndex &&
        i >= targetIndex
      ) {
        offset = stride;
      }
      return {
        transform: offset !== 0 ? `translate3d(0, ${offset}px, 0)` : undefined,
        transition: "transform 200ms ease",
      };
    },
    [draggingId, delta, targetIndex]
  );

  return { setRowRef, handleProps, styleFor, draggingId };
}
