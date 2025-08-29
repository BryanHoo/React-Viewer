import EChartsRenderer from '../../CommonRenderer';
import { memo, type FC } from 'react';

interface BaseLineTwoProps {
  id: string;
}

const BaseLineTwo: FC<BaseLineTwoProps> = memo((props) => {
  const { id } = props;
  return <EChartsRenderer id={id} />;
});

BaseLineTwo.displayName = 'BaseLineTwo';

export default BaseLineTwo;
