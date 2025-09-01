import dataJson from './data.json';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem1 = {
  label: {
    show: false,
    position: 'top',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },
  xAxisIndex: 1,
  itemStyle: {
    color: 'rgba(45,64,81,0.4)',
  },
  barWidth: 30,
  type: 'bar',
  data: Array(dataJson.source.length).fill(Math.max(...dataJson.source.map((item) => item.data1))),
};
export const seriesItem2 = {
  type: 'bar',
  barWidth: 10,
  label: {
    show: true,
    position: 'top',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },

  itemStyle: {
    color: {
      type: 'linear',
      x: 0,
      y: 1,
      x1: 0,
      y1: 0, // 将 y1 设为 1，使渐变方向变为垂直
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
  xAxis: [
    {
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
    { show: false, type: 'category' },
  ],
  dataset: { ...dataJson },
  series: [seriesItem1, seriesItem2],
};
