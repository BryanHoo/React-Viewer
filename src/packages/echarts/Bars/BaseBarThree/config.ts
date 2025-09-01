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

  markPoint: {
    symbol:
      'path://M353.834667 872.490667L588.778667 125.909333l101.386666 45.6-254.944 786.581334-101.386666-45.6z',
    symbolSize: [17, 18],
    label: {
      show: false,
    },
    data: [],
  },
  showBackground: true,

  backgroundStyle: {
    color: 'rgba(110, 193, 244, 0.2)',
  },

  itemStyle: {
    color: (params: any) => {
      const colorList = [
        { offset: 0, color: 'rgba(35,255,101,0)' },
        { offset: 1, color: '#23FF65' },
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
  },
};
export const defaultOption = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'shadow',
    },
    formatter: function (params: any) {
      console.log(params, 'params!@#!@#!@#');
      return `${params[0].name}:${params[0].data.data1}`;
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
