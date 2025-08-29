import EChartsRenderer from '../../CommonRenderer';
import { memo, type FC } from 'react';

interface BaseLineOneProps {
  id: string;
}

const BaseLineOne: FC<BaseLineOneProps> = memo((props) => {
  const { id } = props;
  return <EChartsRenderer id={id} />;
});

BaseLineOne.displayName = 'BaseLineOne';

export default BaseLineOne;
