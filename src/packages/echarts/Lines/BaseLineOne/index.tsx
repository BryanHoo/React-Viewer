import BaseECharts from '../../Base';
import { defaultOption } from './config';
import { memo, type FC } from 'react';

interface BaseLineOneProps {
  id: string;
}

const BaseLineOne: FC<BaseLineOneProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} defaultOption={defaultOption} />;
});

BaseLineOne.displayName = 'BaseLineOne';

export default BaseLineOne;
