import CustomSegmented from '@/components/CustomSegmented';
import type { SegmentedValue } from 'antd/es/segmented';
import { memo, useState, type FC } from 'react';
import Customize from './customize';

const options = ['定制', '动画', '数据', '事件'];

const SelectedPanel: FC = memo(() => {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('定制');

  return (
    <div className="w-full h-full flex flex-col gap-[15px]">
      <CustomSegmented
        options={options}
        block
        size="large"
        value={activeTab}
        onChange={setActiveTab}
      />
      <div className="flex-1 overflow-auto h-0">{activeTab === '定制' && <Customize />}</div>
    </div>
  );
});

SelectedPanel.displayName = 'SelectedPanel';

export default SelectedPanel;
