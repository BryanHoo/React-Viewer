import { memo, type FC } from 'react';

import { useGlobalStore } from '@/store/globalStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import GlobalPanel from './globalPanel';
import SelectedPanel from './selectedPanel';
import useComponent from '@/hooks/useComponent';

const Config: FC = memo(() => {
  const { showDetail } = useGlobalStore(
    useShallow((state) => ({
      showDetail: state.showDetail,
    })),
  );
  const selectedId = useCanvasStore((state) => state.selectedId);
  const { config } = useComponent({ id: selectedId });
  return (
    <div
      className={`h-full bg-[var(--n-color)] text-[var(--n-text-color)] p-[10px] overflow-hidden transition-all duration-500 ${showDetail ? 'w-[350px] opacity-100' : 'w-0 opacity-0'}`}
    >
      {selectedId ? <SelectedPanel config={config} id={selectedId} /> : <GlobalPanel />}
    </div>
  );
});

Config.displayName = 'Config';

export default Config;
