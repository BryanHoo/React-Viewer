import { cloneDeep } from 'lodash-es';
import { nanoid } from 'nanoid';

/**
 * 生成带有可选前缀的随机唯一 ID
 * @param prefix - 可选，ID 前缀，默认为空字符串
 * @param size - 可选，ID 随机部分长度，默认为 21（nanoid 默认长度）
 * @returns 拼接前缀后的唯一 ID 字符串
 */
export function generateId(prefix: string = '', size: number = 21): string {
  return prefix + nanoid(size);
}

export const toCss = (value?: number, unit: AppCssUnit = 'px') => {
  return typeof value === 'number' && !Number.isNaN(value) ? `${value}${unit}` : undefined;
};

export const normalize = (val?: number | null) => {
  if (val === null || typeof val !== 'number' || Number.isNaN(val)) return undefined;
  return val < 0 ? 0 : val;
};

/**
 * 从值中推断单位（包含 % 视为百分比，否则为 px）
 */
export const inferUnitFromValue = (value?: unknown): AppCssUnit => {
  return typeof value === 'string' && value.trim().includes('%') ? '%' : 'px';
};

/**
 * 生成 ECharts 长度：px 返回 number（四舍五入），% 返回 'xx%' 字符串
 */
export const toEchartsLength = (
  value?: number,
  unit: AppCssUnit = 'px',
): number | string | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return unit === 'px' ? Math.round(value) : `${value}%`;
};

export function cloneComponentMap(
  source: Map<string, AppMaterielCanvasItem>,
): Map<string, AppMaterielCanvasItem> {
  const next = new Map<string, AppMaterielCanvasItem>();
  source.forEach((value, key) => {
    next.set(key, {
      ...value,
      option: cloneDeep(value.option),
    });
  });
  return next;
}

export function createSnapshot(
  map: Map<string, AppMaterielCanvasItem>,
  meta: AppHistorySnapshotMeta,
): AppHistorySnapshot {
  return {
    id: generateId('history-'),
    timestamp: Date.now(),
    componentSnapshotMap: cloneComponentMap(map),
    ...meta,
  };
}

export type { Rect, RectPartial, CanvasBounds, MinSizeConstraints } from './rect';
export { computeNextRectWithinCanvas, DEFAULT_MIN_SIZE, clampRectToCanvas } from './rect';
export {
  getIdsOrderedByZIndexDesc,
  buildOrderAfterSendToBack,
  buildOrderAfterMoveUp,
  buildOrderAfterMoveDown,
  getHighestZIndex,
} from './zIndex';
