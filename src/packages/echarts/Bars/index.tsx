import type { MaterielItem } from '@/types/materielType';
import BaseBarOne from './BaseBarOne';
import baseBarOneImage from '@/assets/images/chart/charts/bar/BaseBarOne-view.png';
import baseBarTwoImage from '@/assets/images/chart/charts/bar/BaseBarTwo-view.png';
import BaseBarTwo from './BaseBarTwo';
import BaseBarOnePanel from './BaseBarOne/panel';

export const barComponents = { BaseBarOne, BaseBarTwo };
export const barPanels = { BaseBarOnePanel };

const bars: MaterielItem[] = [
  {
    id: 'BaseBarOne',
    title: '基础柱状图-样式一',
    image: baseBarOneImage,
    type: '柱状图',
    componentName: 'BaseBarOne',
    panel: 'BaseBarOnePanel',
  },
  {
    id: 'BaseBarTwo',
    title: '基础柱状图-样式二',
    image: baseBarTwoImage,
    type: '柱状图',
    componentName: 'BaseBarTwo',
  },
];

export default bars;
