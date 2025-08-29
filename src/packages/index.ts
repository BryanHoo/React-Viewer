import BaseBarOneMeta from './echarts/Bars/BaseBarOne/meta';
import BaseBarTwoMeta from './echarts/Bars/BaseBarTwo/meta';
import BarLineMeta from './echarts/Bars/BarLine/meta';
import CommonPanel from './components/Panel/CommonPanel';
import CommonRenderer from './echarts/CommonRenderer';

export const echartsItems = [BaseBarOneMeta, BaseBarTwoMeta, BarLineMeta];

const packages: AppPackageConfig = {
  components: { CommonRenderer },
  panels: { CommonPanel },
  config: [...echartsItems],
};

export default packages;
