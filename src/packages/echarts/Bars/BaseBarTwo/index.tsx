import BaseECharts from '../../Base';
import { memo, type FC } from 'react';

interface BaseBarTwoProps {
  id: string;
}

const BaseBarTwo: FC<BaseBarTwoProps> = memo((props) => {
  const { id } = props;
  return <BaseECharts id={id} />;
});

BaseBarTwo.displayName = 'BaseBarTwo';

export default BaseBarTwo;
