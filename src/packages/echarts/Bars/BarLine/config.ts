import dataJson from './data.json';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
// 柱状折线组合图 分别定义series
// 写死name可以定义legend显示的名称
export const barSeriesItem = {
  type: 'bar',
  barWidth: 15,
  label: {
    show: true,
    position: 'top',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 2,
  },
};

export const lineSeriesItem = {
  type: 'line',
  symbol: 'circle',
  label: {
    show: true,
    position: 'top',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },
  symbolSize: 5, //设定实心点的大小
  itemStyle: {
    color: '#FFE47A',
    borderWidth: 1,
  },
  lineStyle: {
    type: 'solid',
    width: 3,
    color: null,
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
    data: null,
  },
  xAxis: {
    show: true,
    type: 'category',
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  dataset: { ...dataJson },
  series: [barSeriesItem, lineSeriesItem],
};
