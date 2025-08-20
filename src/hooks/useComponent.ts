import { useCanvasStore } from '@/store/canvasStore';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

interface UseComponentProps {
  id?: string;
}

const useComponent = (props: UseComponentProps) => {
  const { id } = props;
  const { componentMap } = useCanvasStore(
    useShallow((state) => ({ componentMap: state.componentMap })),
  );

  const config = useMemo(() => (id ? componentMap.get(id) : undefined), [componentMap, id]);

  return { config };
};

export default useComponent;
