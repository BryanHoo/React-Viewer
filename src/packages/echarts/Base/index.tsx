import ECharts from '@/components/ECharts';
import type { EChartsOption } from 'echarts';
import { memo, useMemo, type FC } from 'react';
import { mergeOption } from '@/utils/chart';

interface BarCommonProps {
  option: EChartsOption;
  defaultOption: EChartsOption;
}

const BaseECharts: FC<BarCommonProps> = memo((props) => {
  const { option, defaultOption } = props;

  const mergedOption = useMemo(
    () => mergeOption({ ...defaultOption, ...option }) as EChartsOption,
    [option, defaultOption],
  );

  return <ECharts option={mergedOption} />;
});

BaseECharts.displayName = 'BaseECharts';

export default BaseECharts;
