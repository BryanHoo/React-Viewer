import type { EChartsOption } from 'echarts';
import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseLineTwoProps {
  option: EChartsOption;
}

const BaseLineTwo: FC<BaseLineTwoProps> = memo((props) => {
  const { option } = props;
  return <BaseECharts option={option} defaultOption={defaultOption} />;
});

BaseLineTwo.displayName = 'BaseLineTwo';

export default BaseLineTwo;
