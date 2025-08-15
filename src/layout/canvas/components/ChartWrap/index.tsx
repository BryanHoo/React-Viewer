import { memo, type FC } from 'react';
import classNames from '@/utils/classname';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useCanvasStore } from '@/store/canvasStore';
import packages from '@/packages';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';

interface ChartWrapProps extends MaterielCanvasItem {
  className?: string;
  style?: React.CSSProperties;
}

const ChartWrap: FC<ChartWrapProps> = memo((props) => {
  const {
    top,
    left,
    className,
    style,
    componentName,
    id,
    title,
    width,
    height,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;
  const Component = packages.components[componentName];
  const setSelectedId = useCanvasStore(useShallow((state) => state.setSelectedId));

  const handleSelect = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedId(id);
  });

  return (
    <div
      className={classNames('absolute', className)}
      style={{
        top,
        left,
        width,
        height,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        boxSizing: 'border-box',
        ...style,
      }}
      data-id={id}
      data-title={title}
      key={id}
      onMouseDown={handleSelect}
    >
      <Component id={id} />
    </div>
  );
});

ChartWrap.displayName = 'ChartWrap';

export default ChartWrap;
