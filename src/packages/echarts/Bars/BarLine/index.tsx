import BaseECharts from '../../Base';
import { memo, type FC } from 'react';

interface BarLineProps {
  id: string;
}

const BarLine: FC<BarLineProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} />;
});

BarLine.displayName = 'BarLine';

export default BarLine;
