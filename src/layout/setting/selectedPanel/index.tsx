import CustomSegmented from '@/components/CustomSegmented';
import type { SegmentedValue } from 'antd/es/segmented';
import { memo, useMemo, useState, type FC } from 'react';
import Customize from './customize';
import SelectedPanelData from './data';
import type { PanelProps } from '@/types/materielType';

const options = ['定制', '动画', '数据', '事件'];

const SelectedPanel: FC<PanelProps> = memo((props) => {
  const { config, id } = props;
  const [activeTab, setActiveTab] = useState<SegmentedValue>('定制');

  const PanelComponent = useMemo(() => {
    if (activeTab === '定制') return <Customize config={config} id={id} />;
    if (activeTab === '数据') return <SelectedPanelData config={config} id={id} />;
  }, [activeTab, config, id]);

  return (
    <div className="w-full h-full flex flex-col gap-[15px]">
      <CustomSegmented
        options={options}
        block
        size="large"
        value={activeTab}
        onChange={setActiveTab}
      />
      <div className="flex-1 overflow-auto h-0">{PanelComponent}</div>
    </div>
  );
});

SelectedPanel.displayName = 'SelectedPanel';

export default SelectedPanel;
