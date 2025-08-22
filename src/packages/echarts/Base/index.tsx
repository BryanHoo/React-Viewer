import ECharts from '@/components/ECharts';
import { memo, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globalStore';
import useComponent from '@/hooks/useComponent';

interface BarCommonProps {
  id: string;
}

const BaseECharts: FC<BarCommonProps> = memo((props) => {
  const { id } = props;
  const { echartsRenderer, themeColor } = useGlobalStore(
    useShallow((state) => ({
      echartsRenderer: state.echartsRenderer,
      themeColor: state.themeColor,
    })),
  );

  const { config } = useComponent({ id });

  const renderer = useMemo(() => {
    if (config?.renderer && config.renderer !== 'inherit') return config.renderer;
    return echartsRenderer;
  }, [config?.renderer, echartsRenderer]);

  return <ECharts option={config?.option ?? {}} renderer={renderer} theme={themeColor} />;
});

BaseECharts.displayName = 'BaseECharts';

export default BaseECharts;
