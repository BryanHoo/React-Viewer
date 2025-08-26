import type { PackageConfig } from '@/types/materielType';
import BaseBarOneMeta from './echarts/Bars/BaseBarOne/meta';
import BaseBarTwoMeta from './echarts/Bars/BaseBarTwo/meta';
import BarLineMeta from './echarts/Bars/BarLine/meta';
import CommonPanel from './components/Panel/CommonPanel';
import BaseECharts from './echarts/Base';

export const echartsItems = [BaseBarOneMeta, BaseBarTwoMeta, BarLineMeta];

const packages: PackageConfig = {
  components: { BaseECharts },
  panels: { CommonPanel },
  config: [...echartsItems],
};

export default packages;
