import type { PackageConfig } from '@/types/materielType';
import echartsConfig, { echartsComponents, echartsPanels } from './echarts';

const packages: PackageConfig = {
  components: { ...echartsComponents },
  panels: { ...echartsPanels },
  config: [...echartsConfig],
};

export default packages;
