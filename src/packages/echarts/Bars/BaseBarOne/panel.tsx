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
      children: <Render selectedId={selectedId} />,
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: <p>{text}</p>,
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
      <Collapse items={items} defaultActiveKey={['1']} bordered={false} />
    </div>
  );
});

BaseBarOnePanel.displayName = 'BaseBarOnePanel';

export default BaseBarOnePanel;
