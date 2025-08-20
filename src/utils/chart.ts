import { globalThemeJson } from '@/components/ECharts/chartThemes';
import type { OptionKey } from '@/types/materielType';
import type { EChartsOption } from 'echarts-for-react';
import { merge } from 'lodash-es';

/**
 * * 合并 color 和全局配置项
 * @param option 配置
 * @param themeSetting 设置
 * @param excludes 排除元素
 * @returns object
 */
export const mergeTheme = <T, U>(option: T, themeSetting: U) => {
  return (option = merge({}, themeSetting, option));
};

/**
 * * ECharts option 统一前置处理
 * @param option
 * @return option
 */
export const mergeOption = (option: EChartsOption): EChartsOption => {
  option['backgroundColor'] = 'rgba(0,0,0,0)';
  return mergeTheme(option, globalThemeJson);
};

// 读取 show 标记：若为数组读取首项；未定义则默认 true
export const readShowFlag = (value: unknown): boolean => {
  const source = Array.isArray(value) ? (value[0] as unknown) : value;
  const showValue = (source as Record<string, unknown> | undefined)?.show as boolean | undefined;
  return showValue === undefined ? true : Boolean(showValue);
};

// 更新指定 key 的 show 标记：数组仅更新首项，其余保持不变
export const updateOptionShowFlag = (
  prev: EChartsOption,
  key: OptionKey,
  checked: boolean,
): EChartsOption => {
  const current = (prev as Record<string, unknown>)[key];
  let nextValue: unknown;
  if (Array.isArray(current)) {
    const first = (current[0] ?? {}) as Record<string, unknown>;
    nextValue = [{ ...first, show: checked }, ...current.slice(1)];
  } else {
    const obj = (current as Record<string, unknown>) ?? {};
    nextValue = { ...obj, show: checked } as Record<string, unknown>;
  }
  return { ...prev, [key]: nextValue };
};

export const getHexColorFromEvent = (_: any, hex?: string) => hex;
