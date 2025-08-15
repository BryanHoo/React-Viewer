import type { MaterielItem } from '@/types/materielType';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type RectPartial = Partial<Rect>;

export interface CanvasBounds {
  width: number;
  height: number;
}

export interface MinSizeConstraints {
  minWidth: number;
  minHeight: number;
}

export const DEFAULT_MIN_SIZE: MinSizeConstraints = {
  minWidth: 80,
  minHeight: 60,
};

/**
 * 合并并裁剪矩形到画布范围内
 * 规则：合并 next → 四舍五入 → 最小尺寸 → 画布边界裁剪
 */
export function computeNextRectWithinCanvas(
  currentRect: Rect,
  nextRectPartial: RectPartial,
  canvas: CanvasBounds,
  minSize: MinSizeConstraints = DEFAULT_MIN_SIZE,
): Rect {
  const rawLeft = nextRectPartial.left ?? currentRect.left;
  const rawTop = nextRectPartial.top ?? currentRect.top;
  const rawWidth = nextRectPartial.width ?? currentRect.width;
  const rawHeight = nextRectPartial.height ?? currentRect.height;

  let left = Math.round(rawLeft);
  let top = Math.round(rawTop);
  let width = Math.round(rawWidth);
  let height = Math.round(rawHeight);

  // 最小尺寸
  width = Math.max(minSize.minWidth, width);
  height = Math.max(minSize.minHeight, height);

  // 画布边界裁剪
  if (left < 0) left = 0;
  if (top < 0) top = 0;

  if (left + width > canvas.width) {
    if (width > canvas.width) {
      width = canvas.width;
      left = 0;
    } else {
      left = canvas.width - width;
    }
  }

  if (top + height > canvas.height) {
    if (height > canvas.height) {
      height = canvas.height;
      top = 0;
    } else {
      top = canvas.height - height;
    }
  }

  return { left, top, width, height };
}

/**
 * 将给定矩形裁剪至画布范围内（包含四舍五入与最小尺寸约束）
 * 等价于：computeNextRectWithinCanvas(rect, {}, canvas, minSize)
 */
export function clampRectToCanvas(
  rect: Rect,
  canvas: CanvasBounds,
  minSize: MinSizeConstraints = DEFAULT_MIN_SIZE,
): Rect {
  return computeNextRectWithinCanvas(rect, {}, canvas, minSize);
}

export function isMaterielItem(value: unknown): value is MaterielItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.componentName === 'string' &&
    typeof obj.title === 'string'
  );
}
