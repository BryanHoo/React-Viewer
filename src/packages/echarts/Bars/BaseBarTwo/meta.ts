import image from '@/assets/images/chart/charts/bar_x.png';
import { defaultOption } from './config';

export default {
  id: 'BaseBarTwo',
  title: '双柱状图',
  image,
  type: '柱状图',
  componentName: 'BaseECharts',
  panel: 'CommonPanel',
  option: defaultOption,
};
