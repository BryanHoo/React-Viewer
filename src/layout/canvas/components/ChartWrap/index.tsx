import { memo, type FC, useState } from 'react';
import classNames from '@/utils/classname';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useCanvasStore } from '@/store/canvasStore';
import packages from '@/packages';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import ContextMenu from './ContextMenu';

interface ChartWrapProps extends MaterielCanvasItem {
  className?: string;
  style?: React.CSSProperties;
}

const ChartWrap: FC<ChartWrapProps> = memo((props) => {
  const { style, className, ...rest } = props;
  const {
    top,
    left,
    componentName,
    id,
    title,
    width,
    height,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    zIndex,
    isLocked,
    isVisible,
  } = rest;
  const Component = packages.components[componentName];
  const { setSelectedId, selectedId } = useCanvasStore(
    useShallow((state) => ({
      setSelectedId: state.setSelectedId,
      selectedId: state.selectedId,
    })),
  );

  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);

  const handleSelect = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isLocked) return;
    setSelectedId(id);
  });

  const openContextMenu = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLocked && selectedId !== id) {
      setSelectedId(id);
    }
    setIsContextOpen(true);
  });

  const handleCloseContextMenu = useMemoizedFn(() => {
    setIsContextOpen(false);
  });

  return (
    <Popover
      open={isContextOpen}
      onOpenChange={(open) => setIsContextOpen(open)}
      trigger={['contextMenu']}
      placement="rightTop"
      content={<ContextMenu onClose={handleCloseContextMenu} />}
    >
      <div
        className={classNames('absolute', `rv-comp-${id}`, className)}
        style={{
          top,
          left,
          width,
          height,
          minWidth: 80,
          minHeight: 60,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          boxSizing: 'border-box',
          zIndex,
          display: isVisible ? undefined : 'none',
          ...style,
        }}
        data-id={id}
        data-title={title}
        key={id}
        onMouseDown={handleSelect}
        onContextMenu={openContextMenu}
      >
        <Component id={id} config={rest} />
      </div>
    </Popover>
  );
});

ChartWrap.displayName = 'ChartWrap';

export default ChartWrap;
