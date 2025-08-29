import Bar from './items/Bar';
import Line from './items/Line';

export const typeItemConfig: Record<string, AppTypeItemConfig> = {
  bar: {
    label: '柱状图',
    value: 'bar',
    component: Bar,
  },
  line: {
    label: '折线图',
    value: 'line',
    component: Line,
  },
};
