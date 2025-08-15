import packages from '@/packages';
import { useCanvasStore } from '@/store/canvasStore';
import { memo, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';

const Customize: FC = memo(() => {
  const { selectedId, componentMap } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      componentMap: state.componentMap,
    })),
  );
  const PanelComponent = useMemo(() => {
    const config = selectedId ? componentMap.get(selectedId) : undefined;
    if (!config?.panel) return null;
    return packages.panels[config.panel];
  }, [selectedId, componentMap]);

  return (
    <div className="w-full h-full">
      {PanelComponent && selectedId && <PanelComponent selectedId={selectedId} />}
    </div>
  );
});

Customize.displayName = 'Customize';

export default Customize;
