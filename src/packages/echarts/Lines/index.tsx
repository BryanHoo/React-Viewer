import type { MaterielItem } from '@/types/materielType';
import BaseLineOne from './BaseLineOne';
import baseLineOneImage from '@/assets/images/chart/charts/line/BaseLineOne-view.png';
import baseLineTwoImage from '@/assets/images/chart/charts/line/BaseLineTwo-view.png';
import BaseLineTwo from './BaseLineTwo';

export const lineComponents = { BaseLineOne, BaseLineTwo };

const lines: MaterielItem[] = [
  {
    id: 'BaseLineOne',
    title: '基础折线图-样式一',
    image: baseLineOneImage,
    type: '折线图',
    componentName: 'BaseLineOne',
  },
  {
    id: 'BaseLineTwo',
    title: '基础折线图-样式二',
    image: baseLineTwoImage,
    type: '折线图',
    componentName: 'BaseLineTwo',
  },
];

export default lines;
