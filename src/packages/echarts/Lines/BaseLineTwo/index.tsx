import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseLineTwoProps {
  id: string;
}

const BaseLineTwo: FC<BaseLineTwoProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} defaultOption={defaultOption} />;
});

BaseLineTwo.displayName = 'BaseLineTwo';

export default BaseLineTwo;
