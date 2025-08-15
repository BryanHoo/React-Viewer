import { globalThemeJson } from '@/components/ECharts/chartThemes';
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
