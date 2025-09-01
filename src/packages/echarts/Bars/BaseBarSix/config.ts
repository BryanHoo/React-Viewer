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
      'path://M130.1 223.7l950 550c32.9 19 44.1 61 25.2 93.9s-61 44.1-93.9 25.2l-950-550c-32.9-19-44.1-61-25.2-93.9 19-32.9 61-44.1 93.9-25.2z',
    symbolSize: [20, 10],
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
        x: 1,
        y: 1,
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
