import BaseECharts from '../../Base';
import { memo, type FC } from 'react';

interface BaseLineTwoProps {
  id: string;
}

const BaseLineTwo: FC<BaseLineTwoProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} />;
});

BaseLineTwo.displayName = 'BaseLineTwo';

export default BaseLineTwo;
