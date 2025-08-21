import { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

interface UseWheelZoomOrScrollParams {
  /** 监听滚轮事件的容器 */
  containerRef: React.RefObject<HTMLElement>;
  /** 当前缩放百分比，如 100 表示 100% */
  scale: number;
  /** 设置缩放百分比的方法 */
  setScale: (next: number) => void;
  /** 是否锁定缩放比例；锁定时滚轮应滚动画布 */
  scaleLock: boolean;
  /** 允许的最小缩放百分比（默认 10% 对应 InfiniteViewer 的 0.1） */
  minScale?: number;
  /** 允许的最大缩放百分比（默认 1000% 对应 InfiniteViewer 的 10） */
  maxScale?: number;
  /** 触摸板捏合时基于 deltaY 的缩放灵敏度（百分比/单位delta），默认 0.2 */
  pinchSensitivity?: number;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * useWheelZoomOrScroll
 * - 未锁定时：鼠标滚轮控制缩放（阻止默认滚动）
 * - 已锁定时：保持默认行为（滚动画布）
 */
function useWheelZoomOrScroll(params: UseWheelZoomOrScrollParams): void {
  const {
    containerRef,
    scale,
    setScale,
    scaleLock,
    minScale = 10,
    maxScale = 1000,
    pinchSensitivity = 0.4,
  } = params;

  const gestureBaseScaleRef = useRef<number>(scale);

  const handleWheel = useMemoizedFn((e: WheelEvent) => {
    if (!containerRef.current) return;

    // 触摸板捏合（在大多数浏览器中表现为 ctrlKey=true 的 wheel 事件）
    if (!scaleLock && e.ctrlKey) {
      e.preventDefault();
      // 将 deltaY 转换为缩放变化，正向为放大，反向为缩小
      const delta = -e.deltaY * pinchSensitivity;
      let next = Math.round(scale + delta);
      next = clamp(next, minScale, maxScale);
      if (next !== scale) setScale(next);
      return;
    }

    // 其余情况：双指平移（普通 wheel）或锁定时的任何滚动 -> 不拦截，交由容器滚动
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // 需要 passive: false 才能在 handler 内调用 preventDefault
    const opts: AddEventListenerOptions = { passive: false };
    el.addEventListener('wheel', handleWheel, opts);
    return () => {
      el.removeEventListener('wheel', handleWheel as EventListener);
    };
  }, [containerRef, handleWheel]);

  // Safari: 使用非标准的 gesture 事件以支持捏合
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    type SafariGestureEvent = Event & { scale?: number; preventDefault?: () => void };

    const onGestureStart = (e: Event) => {
      const ge = e as SafariGestureEvent;
      if (scaleLock) return; // 锁定时不缩放
      gestureBaseScaleRef.current = scale;
      if (typeof ge.preventDefault === 'function') ge.preventDefault();
    };

    const onGestureChange = (e: Event) => {
      const ge = e as SafariGestureEvent;
      if (scaleLock) return;
      const scaleFactor = ge.scale ?? 1;
      let next = Math.round(gestureBaseScaleRef.current * scaleFactor);
      next = clamp(next, minScale, maxScale);
      if (typeof ge.preventDefault === 'function') ge.preventDefault();
      if (next !== scale) setScale(next);
    };

    const opts: AddEventListenerOptions = { passive: false };
    el.addEventListener('gesturestart', onGestureStart as EventListener, opts);
    el.addEventListener('gesturechange', onGestureChange as EventListener, opts);

    return () => {
      el.removeEventListener('gesturestart', onGestureStart as EventListener);
      el.removeEventListener('gesturechange', onGestureChange as EventListener);
    };
  }, [containerRef, scale, setScale, scaleLock, minScale, maxScale]);
}

export default useWheelZoomOrScroll;
