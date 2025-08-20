import { memo, type FC } from 'react';

import { useGlobalStore } from '@/store/globalStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import GlobalPanel from './globalPanel';
import SelectedPanel from './selectedPanel';

const Config: FC = memo(() => {
  const { showDetail } = useGlobalStore(
    useShallow((state) => ({
      showDetail: state.showDetail,
    })),
  );
  const selectedId = useCanvasStore((state) => state.selectedId);
  return (
    <div
      className={`h-full bg-[var(--n-color)] text-[var(--n-text-color)] p-[10px] overflow-hidden transition-all duration-500 ${showDetail ? 'w-[350px] opacity-100' : 'w-0 opacity-0'}`}
    >
      {selectedId ? <SelectedPanel /> : <GlobalPanel />}
    </div>
  );
});

Config.displayName = 'Config';

export default Config;
