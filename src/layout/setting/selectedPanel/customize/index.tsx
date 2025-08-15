import packages from '@/packages';
import { useCanvasStore } from '@/store/canvasStore';
import { memo, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';

const Customize: FC = memo(() => {
  const { selectedId, componentList } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      componentList: state.componentList,
    })),
  );
  const PanelComponent = useMemo(() => {
    const config = selectedId ? componentList.get(selectedId) : undefined;
    if (!config?.panel) return null;
    return packages.panels[config.panel];
  }, [selectedId, componentList]);

  return (
    <div className="w-full h-full">
      {PanelComponent && selectedId && <PanelComponent selectedId={selectedId} />}
    </div>
  );
});

Customize.displayName = 'Customize';

export default Customize;
