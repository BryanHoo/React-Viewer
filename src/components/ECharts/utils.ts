import type { EChartsOption } from 'echarts';
import { merge } from 'lodash-es';
import { chartColors, defaultTheme, globalThemeJson } from './chartThemes';
import * as echartsNs from 'echarts';

export function mergeWithGlobalTheme(option: EChartsOption): EChartsOption {
  // 不修改入参，返回新对象
  return merge({}, globalThemeJson, option);
}

export function resolveThemeName(theme?: string): string {
  if (theme && (chartColors as Record<string, unknown>)[theme]) return theme;
  return defaultTheme;
}

export function registerAllEChartsThemes(echarts: typeof echartsNs): void {
  try {
    Object.entries(chartColors).forEach(([name, theme]) => {
      echarts.registerTheme(name, theme);
    });
  } catch {
    // 重复注册等情况忽略
  }
}
