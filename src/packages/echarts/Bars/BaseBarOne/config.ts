import type { EChartsOption } from 'echarts-for-react';
import dataJson from './data.json';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: 10,
  label: {
    show: false,
    position: 'top',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },
  showBackground: true,

  backgroundStyle: {
    color: 'rgba(110, 193, 244, 0.2)',
  },

  itemStyle: {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      colorStops: [
        {
          offset: 0,
          color: '#0BFFFC',
        },
        {
          offset: 1,
          color: '#1BC1FF',
        },
      ],
    },
  },
};
export const defaultOption: EChartsOption = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'shadow',
    },
  },
  legend: {
    show: false,
  },
  xAxis: {
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
  yAxis: {
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
