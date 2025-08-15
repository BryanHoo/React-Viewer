import { useMemo, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import type { OnDrag, OnDragEnd, OnResize, OnResizeEnd } from 'react-moveable';

interface UseMoveableHandlersParams {
  canvasRef: React.RefObject<HTMLDivElement>;
  selectedId?: string;
  canvasWidth: number;
  canvasHeight: number;
  unit: number; // kept for future extensibility; not used directly now
  updateComponentRectById: (
    id: string,
    rect: Partial<{ left: number; top: number; width: number; height: number }>,
  ) => void;
}

interface UseMoveableHandlersResult {
  targetElement: HTMLElement | null;
  elementGuidelines: HTMLElement[];
  onDrag: (e: OnDrag) => void;
  onDragEnd: (e: OnDragEnd) => void;
  onResize: (e: OnResize) => void;
  onResizeEnd: (e: OnResizeEnd) => void;
}

const MIN_WIDTH = 80;
const MIN_HEIGHT = 60;

function useMoveableHandlers(params: UseMoveableHandlersParams): UseMoveableHandlersResult {
  const {
    canvasRef,
    selectedId,
    canvasWidth,
    canvasHeight,
    // unit (reserved for future usage)
    updateComponentRectById,
  } = params;

  const resizeBeforeTranslateRef = useRef<[number, number]>([0, 0]);

  const clampRect = useMemoizedFn(
    (rect: { left: number; top: number; width: number; height: number }) => {
      let { left, top, width, height } = rect;

      if (width < MIN_WIDTH) width = MIN_WIDTH;
      if (height < MIN_HEIGHT) height = MIN_HEIGHT;

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + width > canvasWidth) left = Math.max(0, canvasWidth - width);
      if (top + height > canvasHeight) top = Math.max(0, canvasHeight - height);

      return { left, top, width, height };
    },
  );

  const targetElement = useMemo<HTMLElement | null>(() => {
    if (!canvasRef.current || !selectedId) return null;
    const childList = Array.from(canvasRef.current.querySelectorAll<HTMLElement>('[data-id]'));
    return childList.find((el) => el.dataset.id === selectedId) || null;
  }, [canvasRef, selectedId]);

  const elementGuidelines = useMemo<HTMLElement[]>(() => {
    if (!canvasRef.current) return [];
    const nodes = Array.from(canvasRef.current.querySelectorAll<HTMLElement>('[data-id]'));
    return nodes.filter((el) => el.dataset.id !== selectedId);
  }, [canvasRef, selectedId]);

  const onDrag = useMemoizedFn((e: OnDrag) => {
    const { target, left, top } = e as unknown as {
      target: HTMLElement;
      left: number;
      top: number;
    };

    const el = target;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const { left: l, top: t } = clampRect({ left, top, width: w, height: h });
    el.style.left = `${l}px`;
    el.style.top = `${t}px`;
  });

  const onDragEnd = useMemoizedFn((e: OnDragEnd) => {
    const { target } = e as unknown as { target: HTMLElement };
    const el = target;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const currentLeft = parseFloat(getComputedStyle(el).left) || 0;
    const currentTop = parseFloat(getComputedStyle(el).top) || 0;
    const clamped = clampRect({ left: currentLeft, top: currentTop, width: w, height: h });
    if (selectedId) {
      updateComponentRectById(selectedId, {
        left: clamped.left,
        top: clamped.top,
      });
    }
  });

  const onResize = useMemoizedFn((e: OnResize) => {
    const {
      target,
      width: nextW,
      height: nextH,
      drag,
    } = e as unknown as {
      target: HTMLElement;
      width: number;
      height: number;
      drag?: { beforeTranslate?: [number, number] };
    };

    const el = target;
    let w = nextW;
    let h = nextH;
    if (w < MIN_WIDTH) w = MIN_WIDTH;
    if (h < MIN_HEIGHT) h = MIN_HEIGHT;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;

    if (drag && Array.isArray(drag.beforeTranslate)) {
      const before = drag.beforeTranslate;
      resizeBeforeTranslateRef.current = before;
      el.style.transform = `translate(${before[0]}px, ${before[1]}px)`;
    }
  });

  const onResizeEnd = useMemoizedFn((e: OnResizeEnd) => {
    const {
      target,
      width: nextW,
      height: nextH,
    } = e as unknown as {
      target: HTMLElement;
      width: number;
      height: number;
    };
    const el = target;
    const before = resizeBeforeTranslateRef.current;
    const style = getComputedStyle(el);
    const baseLeft = parseFloat(style.left) || 0;
    const baseTop = parseFloat(style.top) || 0;
    const w = Math.max(MIN_WIDTH, Math.round(nextW));
    const h = Math.max(MIN_HEIGHT, Math.round(nextH));
    const l = Math.round(baseLeft + (before?.[0] || 0));
    const t = Math.round(baseTop + (before?.[1] || 0));

    const clamped = clampRect({ left: l, top: t, width: w, height: h });

    // Clear temp transform; styles will be finalized by store writeback
    el.style.transform = '';
    el.style.width = `${clamped.width}px`;
    el.style.height = `${clamped.height}px`;
    el.style.left = `${clamped.left}px`;
    el.style.top = `${clamped.top}px`;

    resizeBeforeTranslateRef.current = [0, 0];
    if (selectedId) {
      updateComponentRectById(selectedId, {
        left: clamped.left,
        top: clamped.top,
        width: clamped.width,
        height: clamped.height,
      });
    }
  });

  return {
    targetElement,
    elementGuidelines,
    onDrag,
    onDragEnd,
    onResize,
    onResizeEnd,
  };
}

export default useMoveableHandlers;
