import { nanoid } from 'nanoid';

export type CssUnit = 'px' | '%';

/**
 * 生成带有可选前缀的随机唯一 ID
 * @param prefix - 可选，ID 前缀，默认为空字符串
 * @param size - 可选，ID 随机部分长度，默认为 21（nanoid 默认长度）
 * @returns 拼接前缀后的唯一 ID 字符串
 */
export function generateId(prefix: string = '', size: number = 21): string {
  return prefix + nanoid(size);
}

export const toCss = (value?: number, unit: CssUnit = 'px') => {
  return typeof value === 'number' && !Number.isNaN(value) ? `${value}${unit}` : undefined;
};

export const normalize = (val?: number | null) => {
  if (val === null || typeof val !== 'number' || Number.isNaN(val)) return undefined;
  return val < 0 ? 0 : val;
};

/**
 * 从值中推断单位（包含 % 视为百分比，否则为 px）
 */
export const inferUnitFromValue = (value?: unknown): CssUnit => {
  return typeof value === 'string' && value.trim().includes('%') ? '%' : 'px';
};

/**
 * 生成 ECharts 长度：px 返回 number（四舍五入），% 返回 'xx%' 字符串
 */
export const toEchartsLength = (
  value?: number,
  unit: CssUnit = 'px',
): number | string | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return unit === 'px' ? Math.round(value) : `${value}%`;
};

/**
 * 颜色归一化：支持字符串与 antd ColorPicker 对象（toHexString）
 */
export const normalizeColor = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (
    value &&
    typeof value === 'object' &&
    'toHexString' in (value as Record<string, unknown>) &&
    typeof (value as { toHexString?: unknown }).toHexString === 'function'
  ) {
    try {
      return (value as { toHexString: () => string }).toHexString();
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export type { Rect, RectPartial, CanvasBounds, MinSizeConstraints } from './rect';
export { computeNextRectWithinCanvas, DEFAULT_MIN_SIZE, clampRectToCanvas } from './rect';
