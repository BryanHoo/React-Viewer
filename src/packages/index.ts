import type { PackageConfig } from '@/types/materielType';
import echartsConfig, { echartsComponents, echartsPanels } from './echarts';

const packages: PackageConfig = {
  components: { ...echartsComponents } as PackageConfig['components'],
  panels: { ...echartsPanels } as PackageConfig['panels'],
  config: [...echartsConfig],
};

export default packages;
