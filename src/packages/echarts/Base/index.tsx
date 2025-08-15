import ECharts from '@/components/ECharts';
import type { EChartsOption } from 'echarts';
import { memo, useMemo, type FC } from 'react';
import { mergeOption } from '@/utils/chart';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globalStore';
import useComponent from '@/hooks/useComponent';

interface BarCommonProps {
  id: string;
  defaultOption: EChartsOption;
}

const BaseECharts: FC<BarCommonProps> = memo((props) => {
  const { id, defaultOption } = props;
  const { echartsRenderer } = useGlobalStore(
    useShallow((state) => ({
      echartsRenderer: state.echartsRenderer,
    })),
  );

  const { config } = useComponent({ id });

  const mergedOption = useMemo(
    () => mergeOption({ ...defaultOption, ...config?.option }) as EChartsOption,
    [config?.option, defaultOption],
  );

  const renderer = useMemo(() => {
    if (config?.renderer && config.renderer !== 'inherit') return config.renderer;
    return echartsRenderer;
  }, [config?.renderer, echartsRenderer]);

  return <ECharts option={mergedOption} renderer={renderer} />;
});

BaseECharts.displayName = 'BaseECharts';

export default BaseECharts;
