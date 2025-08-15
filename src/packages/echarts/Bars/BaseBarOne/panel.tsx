import Container from '@/packages/components/Container';
import PanelCommon from '@/packages/components/PanelCommon';
import Render from '@/packages/components/Render';
import type { PanelProps } from '@/types/materielType';
import { Collapse, type CollapseProps } from 'antd';
import { memo, type FC } from 'react';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const BaseBarOnePanel: FC<PanelProps> = memo(({ selectedId }) => {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '渲染器',
      children: <Render />,
    },
    {
      key: '2',
      label: '容器',
      children: <Container />,
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
  ];
  return (
    <div className="w-full h-full">
      <PanelCommon selectedId={selectedId} />
      <Collapse items={items} bordered={false} />
    </div>
  );
});

BaseBarOnePanel.displayName = 'BaseBarOnePanel';

export default BaseBarOnePanel;
