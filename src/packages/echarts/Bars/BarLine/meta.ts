import image from '@/assets/images/chart/charts/bar_line.png';
import { defaultOption } from './config';

export default {
  id: 'BarLine',
  title: '柱状折线图',
  image,
  type: '柱状图',
  componentName: 'BarLine',
  panel: 'BarLinePanel',
  option: defaultOption,
};
