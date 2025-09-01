import BaseBarOneMeta from './echarts/Bars/BaseBarOne/meta';
import BaseBarTwoMeta from './echarts/Bars/BaseBarTwo/meta';
import BarLineMeta from './echarts/Bars/BarLine/meta';
import CommonPanel from './components/Panel/CommonPanel';
import CommonRenderer from './echarts/CommonRenderer';
import BaseBarFiveMeta from './echarts/Bars/BaseBarFive/meta';
import BaseBarThreeMeta from './echarts/Bars/BaseBarThree/meta';
import BaseBarFourMeta from './echarts/Bars/BaseBarFour/meta';
import BarCrossrangeMeta from './echarts/Bars/BarCrossrange/meta';
import BaseBarSixMeta from './echarts/Bars/BaseBarSix/meta';

export const echartsItems = [
  BaseBarOneMeta,
  BaseBarSixMeta,
  BaseBarThreeMeta,
  BaseBarFourMeta,
  BaseBarFiveMeta,
  BarLineMeta,
  BaseBarTwoMeta,
  BarCrossrangeMeta,
];

const packages: AppPackageConfig = {
  components: { CommonRenderer },
  panels: { CommonPanel },
  config: [...echartsItems],
};

export default packages;
