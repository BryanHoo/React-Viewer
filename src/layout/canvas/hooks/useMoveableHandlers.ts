import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import type { OnDrag, OnDragEnd, OnResize, OnResizeEnd } from 'react-moveable';
import { isResizeEvent } from '../../../utils/moveable';

interface UseMoveableHandlersParams {
  selectedId?: string;
  updateComponentRectById: (
    id: string,
    rect: Partial<{ left: number; top: number; width: number; height: number }>,
  ) => void;
}

interface UseMoveableHandlersResult {
  onDrag: (e: OnDrag) => void;
  onDragEnd: (e: OnDragEnd) => void;
  onResize: (e: OnResize) => void;
  onResizeEnd: (e: OnResizeEnd) => void;
}

function useMoveableHandlers(params: UseMoveableHandlersParams): UseMoveableHandlersResult {
  const { selectedId, updateComponentRectById } = params;

  const resizeBeforeTranslateRef = useRef<[number, number]>([0, 0]);

  const onDrag = useMemoizedFn((e: OnDrag) => {
    const { target, left, top } = e as unknown as {
      target: HTMLElement;
      left: number;
      top: number;
    };

    const el = target;
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
  });

  const onDragEnd = useMemoizedFn((e: OnDragEnd) => {
    const { target } = e as unknown as { target: HTMLElement };
    const el = target;
    const currentLeft = Math.round(parseFloat(getComputedStyle(el).left) || 0);
    const currentTop = Math.round(parseFloat(getComputedStyle(el).top) || 0);
    if (selectedId) {
      updateComponentRectById(selectedId, {
        left: currentLeft,
        top: currentTop,
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
    el.style.width = `${Math.round(nextW)}px`;
    el.style.height = `${Math.round(nextH)}px`;

    if (drag && Array.isArray(drag.beforeTranslate)) {
      const before = drag.beforeTranslate;
      resizeBeforeTranslateRef.current = before;
      el.style.transform = `translate(${before[0]}px, ${before[1]}px)`;
    }
  });

  const onResizeEnd = useMemoizedFn((e: OnResizeEnd) => {
    const { target } = e as unknown as { target: HTMLElement };
    const el = target;

    // Prefer final snapshot from last resize event; fallback to DOM
    const last = (e as unknown as { lastEvent?: unknown }).lastEvent as any;
    const hasLastResize = isResizeEvent(last);
    const nextW = Math.round(hasLastResize ? last.width : el.offsetWidth);
    const nextH = Math.round(hasLastResize ? last.height : el.offsetHeight);
    const beforeFromLast = hasLastResize ? last.drag?.beforeTranslate : undefined;

    const before = Array.isArray(beforeFromLast)
      ? beforeFromLast
      : resizeBeforeTranslateRef.current;

    const style = getComputedStyle(el);
    const baseLeft = Math.round(parseFloat(style.left) || 0);
    const baseTop = Math.round(parseFloat(style.top) || 0);

    const finalLeft = baseLeft + (before?.[0] || 0);
    const finalTop = baseTop + (before?.[1] || 0);

    // Clear temp transform; finalize styles
    el.style.transform = '';
    el.style.width = `${nextW}px`;
    el.style.height = `${nextH}px`;
    el.style.left = `${finalLeft}px`;
    el.style.top = `${finalTop}px`;

    resizeBeforeTranslateRef.current = [0, 0];
    if (selectedId) {
      updateComponentRectById(selectedId, {
        left: finalLeft,
        top: finalTop,
        width: nextW,
        height: nextH,
      });
    }
  });

  return {
    onDrag,
    onDragEnd,
    onResize,
    onResizeEnd,
  };
}

export default useMoveableHandlers;
