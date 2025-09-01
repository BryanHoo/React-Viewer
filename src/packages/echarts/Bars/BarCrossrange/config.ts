import dataJson from './data.json';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: null,
  label: {
    show: true,
    position: 'right',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 0,
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
  xAxis: {
    show: true,
    type: 'value',
  },
  yAxis: {
    show: true,
    type: 'category',
  },
  dataset: { ...dataJson },
  series: [seriesItem, seriesItem],
};
