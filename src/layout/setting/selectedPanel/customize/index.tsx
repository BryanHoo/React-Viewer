import packages from '@/packages';
import { useGlobalStore } from '@/store/globalStore';
import { memo, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';

const Customize: FC = memo(() => {
  const { selectedComponentId, componentList } = useGlobalStore(
    useShallow((state) => ({
      selectedComponentId: state.selectedComponentId,
      componentList: state.componentList,
    })),
  );
  const PanelComponent = useMemo(() => {
    const config = componentList.find((item) => item.id === selectedComponentId);
    if (!config?.panel) return null;
    return packages.panels[config.panel] as FC;
  }, [selectedComponentId, componentList]);

  return <div className="w-full h-full">{PanelComponent && <PanelComponent />}</div>;
});

Customize.displayName = 'Customize';

export default Customize;
