import type { EChartsOption } from 'echarts';
import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseBarOneProps {
  option: EChartsOption;
}

const BaseBarOne: FC<BaseBarOneProps> = memo((props) => {
  const { option } = props;
  return <BaseECharts option={option} defaultOption={defaultOption} />;
});

BaseBarOne.displayName = 'BaseBarOne';

export default BaseBarOne;
