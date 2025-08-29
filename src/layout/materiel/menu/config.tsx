import {
  ChartHistogramTwo,
  FileTxt,
  Optimize,
  Picture,
  TableFile,
  Ungroup,
} from '@icon-park/react';

import { echartsItems } from '@/packages';

export const menuConfig: AppMenuConfig = {
  echarts: {
    title: '图表',
    icon: <ChartHistogramTwo theme="outline" size="18" />,
    items: echartsItems,
  },
  info: {
    title: '信息',
    icon: <FileTxt theme="outline" size="18" />,
    items: [],
  },
  list: {
    title: '列表',
    icon: <TableFile theme="outline" size="18" />,
    items: [],
  },
  widget: {
    title: '小组件',
    icon: <Ungroup theme="outline" size="18" />,
    items: [],
  },
  image: {
    title: '图片',
    icon: <Picture theme="outline" size="18" />,
    items: [],
  },
  icon: {
    title: '图标',
    icon: <Optimize theme="outline" size="18" />,
    items: [],
  },
};
