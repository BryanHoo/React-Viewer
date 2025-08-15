import type { EChartsOption } from 'echarts-for-react';
import dataJson from './data.json';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'line',
  label: {
    show: false,
    position: 'top',
    color: '#fff',
    fontSize: 12,
  },
  // symbol: 'circle',
  symbolSize: 0,
  lineStyle: {
    type: 'solid',
    width: 3,
    color: 'rgba(27, 193, 255, 1)',
  },
  emphasis: {
    focus: 'series',
    itemStyle: {
      color: 'rgba(0, 0, 0, 1)', // 高亮时标记点的颜色
      borderColor: '#fff',
      borderWidth: 5,
    },
  },
};

export const defaultOption: EChartsOption = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  legend: {
    show: false,
  },
  yAxis: {
    show: true,
    type: 'value',
    axisLabel: {
      fontSize: '12px',
      fontFamily: 'PingFangSC, PingFang SC',
      fontWeight: '400',
      color: 'rgba(185,236,255,0.5)',
    },
    axisLine: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#1E3448',
        width: 3,
        type: 'dotted',
      },
    },
    axisTick: {
      show: false,
    },
  },
  xAxis: {
    show: true,
    type: 'category',
    axisLabel: {
      fontSize: '12px',
      fontFamily: 'Alibaba-PuHuiTi, Alibaba-PuHuiTi',
      fontWeight: 'normal',
      color: '#1BC1FF',
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#1E3448',
        width: 3,
      },
    },
    splitLine: {
      show: false,
    },
  },
  dataset: { ...dataJson },
  series: [seriesItem],
};
