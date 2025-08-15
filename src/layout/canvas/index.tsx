import { memo, useRef, useState, useMemo, useEffect } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import styles from './index.module.css';
import classNames from '@/utils/classname';
import { useMemoizedFn, useSize } from 'ahooks';
import Guides from '@scena/react-guides';
import Footer from './footer';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { generateId } from '@/utils';
import ChartWrap from './components/ChartWrap';
import Moveable from 'react-moveable';
import useMoveableHandlers from './hooks/useMoveableHandlers';
import type { MaterielCanvasItem } from '@/types/materielType';

const Canvas: React.FC = memo(() => {
  const {
    width,
    height,
    scale,
    setScale,
    isDragging,
    componentList,
    setComponentList,
    selectedComponentId,
    setSelectedComponentId,
    updateComponentRectById,
  } = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      scale: state.scale,
      setScale: state.setScale,
      isDragging: state.isDragging,
      componentList: state.componentList,
      setComponentList: state.setComponentList,
      selectedComponentId: state.selectedComponentId,
      setSelectedComponentId: state.setSelectedComponentId,
      updateComponentRectById: state.updateComponentRectById,
    })),
  );
  const zoom = useMemo(() => scale / 100, [scale]);
  const unit = useMemo(() => Math.round(50 / zoom), [zoom]);
  const containerRef = useRef<HTMLDivElement>(null);
  const infiniteViewerRef = useRef<InfiniteViewer>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const handleScroll = useMemoizedFn((e: { scrollLeft: number; scrollTop: number }) => {
    setScrollLeft(e.scrollLeft);
    setScrollTop(e.scrollTop);
  });

  const handleScaleChange = useMemoizedFn(() => {
    if (size?.width) {
      const scale = Math.round((size.width / width) * 100);
      setScale(scale);
      infiniteViewerRef.current?.scrollCenter();
    }
  });

  const handleDrop = useMemoizedFn((e: React.DragEvent<HTMLDivElement>) => {
    if (canvasRef.current && isDragging) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      const realX = x / zoom - 200;
      const realY = y / zoom - 100;
      const config = e.dataTransfer.getData('materielConfig');
      const materielConfig = JSON.parse(config) as MaterielCanvasItem;
      const newId = generateId(materielConfig.id);
      setComponentList([
        ...componentList,
        {
          ...materielConfig,
          id: newId,
          top: realY,
          left: realX,
          width: 400,
          height: 200,
        },
      ]);
      setTimeout(() => {
        setSelectedComponentId(newId);
      }, 0);
    }
  });

  const handleDragOver = useMemoizedFn((e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
    }
  });

  useEffect(() => {
    handleScaleChange();
  }, [handleScaleChange, size?.width, width]);

  const { targetElement, elementGuidelines, onDrag, onDragEnd, onResize, onResizeEnd } =
    useMoveableHandlers({
      canvasRef,
      selectedComponentId,
      canvasWidth: width,
      canvasHeight: height,
      unit,
      updateComponentRectById,
    });

  // 取消选中：点击画布空白区域
  const handleCanvasMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 点击 Moveable 控件不取消选中
    if (target.closest('.moveable') || target.closest('.moveable-control')) return;
    setSelectedComponentId(null);
  });

  return (
    <div ref={containerRef} className="w-full h-full relative pl-[20px] flex-1">
      <div className="absolute top-0 left-0 w-full h-[20px] z-2">
        <Guides
          type="horizontal"
          zoom={zoom}
          unit={unit}
          scrollPos={scrollLeft}
          width={size?.width || 0}
          height={30}
          backgroundColor="#17171a"
          lineColor="rgba(255, 255, 255, 0.3)"
          textColor="rgba(255,255,255,0.5)"
          guideStyle={{ backgroundColor: '#51d6a9' }}
          dragGuideStyle={{ backgroundColor: '#51d6a9' }}
          displayGuidePos={false}
          displayDragPos={false}
        />
      </div>
      <div className="absolute top-0 left-0 w-[20px] h-full z-1">
        <Guides
          type="vertical"
          zoom={zoom}
          unit={unit}
          scrollPos={scrollTop}
          width={30}
          height={size?.height || 0}
          backgroundColor="#17171a"
          lineColor="rgba(255, 255, 255, 0.3)"
          textColor="rgba(255,255,255,0.5)"
          guideStyle={{ backgroundColor: '#51d6a9' }}
          dragGuideStyle={{ backgroundColor: '#51d6a9' }}
          displayGuidePos={false}
          displayDragPos={false}
        />
      </div>
      <InfiniteViewer
        className={classNames(styles['dot-canvas'], 'bg-black w-full h-full')}
        ref={infiniteViewerRef}
        useAutoZoom={false}
        usePinch={true}
        zoom={zoom}
        minZoom={0.1}
        maxZoom={10}
        onScroll={handleScroll}
      >
        <div
          ref={canvasRef}
          className={classNames(
            'flex items-center justify-center',
            'bg-[#232324]',
            'relative',
            styles.moveableTheme,
          )}
          style={{
            width,
            height,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleCanvasMouseDown}
        >
          {componentList.map((item) => (
            <ChartWrap {...item} key={item.id} />
          ))}

          <Moveable
            target={targetElement}
            className={styles.moveableTheme}
            container={canvasRef.current}
            origin={false}
            edge={false}
            draggable
            resizable
            rotatable={false}
            keepRatio={false}
            renderDirections={['nw', 'ne', 'sw', 'se', 'n', 'w', 's', 'e']}
            snappable
            snapGridWidth={unit}
            snapGridHeight={unit}
            snapThreshold={6}
            elementGuidelines={elementGuidelines}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onResize={onResize}
            onResizeEnd={onResizeEnd}
          />
        </div>
      </InfiniteViewer>
      <Footer handleScaleChange={handleScaleChange} />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
