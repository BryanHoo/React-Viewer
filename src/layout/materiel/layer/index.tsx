import { useGlobalStore } from '@/store/globalStore';
import { memo } from 'react';
import { useShallow } from 'zustand/shallow';

const Layer = memo(() => {
  const { showLayer } = useGlobalStore(
    useShallow((state) => ({
      showLayer: state.showLayer,
    })),
  );
  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 ${showLayer ? 'w-[150px] opacity-100' : 'w-0 opacity-0'}`}
    >
      <div className="h-[40px] flex items-center justify-center p-[10px] text-sm text-[var(--n-text-color)]">
        图层
      </div>
    </div>
  );
});

export default Layer;

Layer.displayName = 'Layer';
