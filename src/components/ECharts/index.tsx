import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsRef } from './types.ts';
import { type ChartColorsNameType, type EchartsRenderer } from './chartThemes';
import { mergeWithGlobalTheme, resolveThemeName } from './utils';
import type { EChartsOption } from 'echarts';

interface BaseEChartsProps {
  option: EChartsOption;
  theme?: ChartColorsNameType;
  height?: string | number;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  showLoading?: boolean;
  loadingOption?: Record<string, unknown>;
  onEvents?: Record<string, (params: unknown, chart: unknown) => void>;
  renderer?: EchartsRenderer;
}

const ECharts = memo(
  forwardRef<EChartsRef, BaseEChartsProps>((props, ref) => {
    const {
      option,
      theme,
      height = '100%',
      width = '100%',
      className,
      style,
      notMerge,
      lazyUpdate,
      showLoading,
      loadingOption,
      onEvents,
      renderer = 'svg',
    } = props;

    const mergedOption = useMemo(() => mergeWithGlobalTheme(option), [option]);

    const instanceRef = useRef<InstanceType<typeof ReactECharts>>(null);
    useImperativeHandle(ref, () => ({
      getEchartsInstance: () => instanceRef.current!.getEchartsInstance(),
    }));

    const resolvedTheme = useMemo(() => resolveThemeName(theme), [theme]);

    return (
      <ReactECharts
        ref={instanceRef}
        option={mergedOption}
        className={className}
        style={{ height, width, ...style }}
        theme={resolvedTheme}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
        showLoading={showLoading}
        loadingOption={loadingOption}
        onEvents={onEvents}
        opts={{ renderer }}
      />
    );
  }),
);

ECharts.displayName = 'ECharts';

export default ECharts;
