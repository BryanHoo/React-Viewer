import GlobalPanel from '@/packages/components/Panel/GlobalPanel';
import { memo, type FC } from 'react';

const BaseBarOnePanel: FC = memo(() => {
  return <GlobalPanel />;
});

BaseBarOnePanel.displayName = 'BaseBarOnePanel';

export default BaseBarOnePanel;
