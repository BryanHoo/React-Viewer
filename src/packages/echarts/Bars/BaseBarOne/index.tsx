import type { EChartsOption } from 'echarts';
import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseBarOneProps {
  id: string;
}

const BaseBarOne: FC<BaseBarOneProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} defaultOption={defaultOption as EChartsOption} />;
});

BaseBarOne.displayName = 'BaseBarOne';

export default BaseBarOne;
