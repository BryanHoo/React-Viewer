import ECharts from '@/components/ECharts';
import { memo, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globalStore';
import type { BaseEChartsProps } from '@/types/materielType';
import classNames from '@/utils/classname';

const BaseECharts: FC<BaseEChartsProps> = memo((props) => {
  const { config } = props;
  const { echartsRenderer, themeColor } = useGlobalStore(
    useShallow((state) => ({
      echartsRenderer: state.echartsRenderer,
      themeColor: state.themeColor,
    })),
  );

  const renderer = useMemo(() => {
    if (config?.renderer && config.renderer !== 'inherit') return config.renderer;
    return echartsRenderer;
  }, [config?.renderer, echartsRenderer]);

  const className = useMemo(() => {
    if (!config?.animation) return '';
    return classNames({
      animate__animated: true,
      [config?.animation]: true,
    });
  }, [config?.animation]);

  // const onEvents = useMemo(() => {
  //   return Object.entries(config?.event ?? {}).reduce(
  //     (acc, [key, value]) => {
  //       acc[key] = (params: unknown, chart: unknown) => {
  //       };
  //       return acc;
  //     },
  //     {} as Record<string, (params: any, chart: any) => void>,
  //   );
  // }, [config?.event]);

  return (
    <ECharts
      option={config?.option ?? {}}
      className={className}
      renderer={renderer}
      theme={themeColor}
      // onEvents={onEvents}
    />
  );
});

BaseECharts.displayName = 'BaseECharts';

export default BaseECharts;
