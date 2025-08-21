import type { PackageConfig } from '@/types/materielType';
import BaseBarOne from './echarts/Bars/BaseBarOne';
import BaseBarTwo from './echarts/Bars/BaseBarTwo';
import BaseBarOnePanel from './echarts/Bars/BaseBarOne/panel';
import BaseBarTwoPanel from './echarts/Bars/BaseBarTwo/panel';
import BaseBarOneMeta from './echarts/Bars/BaseBarOne/meta';
import BaseBarTwoMeta from './echarts/Bars/BaseBarTwo/meta';
import BarLineMeta from './echarts/Bars/BarLine/meta';
import BarLine from './echarts/Bars/BarLine';
import BarLinePanel from './echarts/Bars/BarLine/panel';

export const echartsItems = [BaseBarOneMeta, BaseBarTwoMeta, BarLineMeta];

const packages: PackageConfig = {
  components: { BaseBarOne, BaseBarTwo, BarLine },
  panels: { BaseBarOnePanel, BaseBarTwoPanel, BarLinePanel },
  config: [...echartsItems],
};

export default packages;
