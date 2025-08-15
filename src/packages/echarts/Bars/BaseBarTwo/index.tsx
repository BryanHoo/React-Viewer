import type { EChartsOption } from 'echarts';
import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseBarTwoProps {
  option: EChartsOption;
}

const BaseBarTwo: FC<BaseBarTwoProps> = memo((props) => {
  const { option } = props;
  return <BaseECharts option={option} defaultOption={defaultOption} />;
});

BaseBarTwo.displayName = 'BaseBarTwo';

export default BaseBarTwo;
