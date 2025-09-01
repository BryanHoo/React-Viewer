import image from '@/assets/images/chart/charts/bar_y.png';
import { defaultOption } from './config';

export default {
  id: 'BarCrossrange',
  title: '横向双轴柱状图',
  image,
  type: '柱状图',
  componentName: 'CommonRenderer',
  panel: 'CommonPanel',
  option: defaultOption,
};
