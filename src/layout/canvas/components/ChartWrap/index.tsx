import { memo, type FC } from 'react';
import classNames from '@/utils/classname';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useGlobalStore } from '@/store/globalStore';
import packages from '@/packages';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';

interface ChartWrapProps extends MaterielCanvasItem {
  className?: string;
  style?: React.CSSProperties;
}

const ChartWrap: FC<ChartWrapProps> = memo((props) => {
  const { top, left, className, style, componentName, id, title, width, height } = props;
  const Component = packages.components[componentName];
  const setSelectedComponentId = useGlobalStore(
    useShallow((state) => state.setSelectedComponentId),
  );

  const handleSelect = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedComponentId(id);
  });

  return (
    <div
      className={classNames('absolute', className)}
      style={{ top, left, width, height, ...style }}
      data-id={id}
      data-title={title}
      key={id}
      onMouseDown={handleSelect}
    >
      <Component />
    </div>
  );
});

ChartWrap.displayName = 'ChartWrap';

export default ChartWrap;
