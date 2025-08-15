import type { EChartsOption } from 'echarts';
import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseLineOneProps {
  option: EChartsOption;
}

const BaseLineOne: FC<BaseLineOneProps> = memo((props) => {
  const { option } = props;
  return <BaseECharts option={option} defaultOption={defaultOption} />;
});

BaseLineOne.displayName = 'BaseLineOne';

export default BaseLineOne;
