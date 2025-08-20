import BaseECharts from '../../Base';
import { memo, type FC } from 'react';

interface BaseBarOneProps {
  id: string;
}

const BaseBarOne: FC<BaseBarOneProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} />;
});

BaseBarOne.displayName = 'BaseBarOne';

export default BaseBarOne;
