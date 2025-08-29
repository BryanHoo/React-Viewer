import image from '@/assets/images/chart/charts/bar/BaseBarOne-view.png';
import { defaultOption } from './config';

export default {
  id: 'BaseBarOne',
  title: '基础柱状图',
  image,
  type: '柱状图',
  componentName: 'CommonRenderer',
  panel: 'CommonPanel',
  option: defaultOption,
};
