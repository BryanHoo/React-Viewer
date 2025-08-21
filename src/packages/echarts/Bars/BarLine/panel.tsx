import CommonPanel from '@/packages/components/Panel/CommonPanel';
import type { PanelProps } from '@/types/materielType';
import { memo, type FC } from 'react';

const BarLinePanel: FC<PanelProps> = memo((props) => {
  const { config, id } = props;

  return <CommonPanel config={config} id={id} />;
});

BarLinePanel.displayName = 'BarLinePanel';

export default BarLinePanel;
