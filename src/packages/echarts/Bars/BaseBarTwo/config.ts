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
    color: (params: any) => {
      const colorList = [
        { offset: 0, color: 'rgba(35,255,101,0)' }, // 渐变起始颜色
        { offset: 1, color: '#23FF65' }, // 渐变结束颜色
      ];
      // 判断奇偶柱子的渐变色
      if (params.dataIndex % 2 === 0) {
        colorList[1].color = '#1BC1FF';
        colorList[0].color = 'rgba(27, 193, 255, 0)';
      }
      return {
        type: 'linear',
        x: 0,
        y: 0,
        colorStops: colorList,
      };
    },
    borderColor: 'rgba(27,193,255,0.5)', // 设置边框颜色
    borderWidth: 1, // 设置边框宽度
    borderType: 'solid', // 设置边框类型为实线
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
  // backgroundStyle: {
  //   color: '16212c'
  // },
  // itemStyle: {
  //   colorStops: [
  //     {
  //       offset: 0,
  //       color: 'pink' // 0% 处的颜色
  //     },
  //     {
  //       offset: 0.7,
  //       color: '#2378f7' // 70% 处的颜色
  //     },
  //     {
  //       offset: 1,
  //       color: '#83bff6' // 100% 处的颜色
  //     }
  //   ]
  // },
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
