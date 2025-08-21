import type { TypeItemConfig } from '@/types/materielType';
import Bar from './items/Bar';
import Line from './items/Line';

export const typeItemConfig: Record<string, TypeItemConfig> = {
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
