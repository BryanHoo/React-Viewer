import { memo, useRef, useState, useMemo, useEffect } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import styles from './index.module.css';
import classNames from '@/utils/classname';
import { useMemoizedFn, useSize } from 'ahooks';
import Guides from '@scena/react-guides';
import Footer from './footer';
import { useGlobalStore } from '@/store/globalStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { generateId } from '@/utils';
import ChartWrap from './components/ChartWrap';
import Moveable from 'react-moveable';
import useMoveableHandlers from './hooks/useMoveableHandlers';
import type { MaterielItem } from '@/types/materielType';
import { clampRectToCanvas, isMaterielItem } from '@/utils/rect';
import type { Rect, CanvasBounds } from '@/utils/rect';
import useComponent from '@/hooks/useComponent';

const Canvas: React.FC = memo(() => {
  const { width, height, scale, setScale, isDragging } = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      scale: state.scale,
      setScale: state.setScale,
      isDragging: state.isDragging,
    })),
  );
  const { componentMap, addComponent, selectedId, setSelectedId, updateComponentRectById } =
    useCanvasStore(
      useShallow((state) => ({
        componentMap: state.componentMap,
        addComponent: state.addComponent,
        selectedId: state.selectedId,
        setSelectedId: state.setSelectedId,
        updateComponentRectById: state.updateComponentRectById,
      })),
    );
  const { config: selectedItem } = useComponent({ id: selectedId });
  const componentList = useMemo(() => Array.from(componentMap.values()), [componentMap]);
  const zoom = useMemo(() => scale / 100, [scale]);
  const unit = useMemo(() => Math.round(50 / zoom), [zoom]);
  const containerRef = useRef<HTMLDivElement>(null);
  const infiniteViewerRef = useRef<InfiniteViewer>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);
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
      const defaultWidth = 400;
      const defaultHeight = 200;
      const realX = x / zoom - defaultWidth / 2;
      const realY = y / zoom - defaultHeight / 2;

      // 裁剪到画布范围内并四舍五入
      const clamped: Rect = (
        clampRectToCanvas as unknown as (rect: Rect, canvas: CanvasBounds) => Rect
      )({ left: realX, top: realY, width: defaultWidth, height: defaultHeight }, { width, height });

      const raw = e.dataTransfer.getData('materielConfig');
      let materielConfig: MaterielItem;
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (!isMaterielItem(parsed)) return;
        materielConfig = parsed;
      } catch {
        return;
      }
      const newId = generateId(materielConfig.id);
      addComponent({
        ...materielConfig,
        id: newId,
        top: clamped.top,
        left: clamped.left,
        width: clamped.width,
        height: clamped.height,
      });
      setTimeout(() => {
        setSelectedId(newId);
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
      selectedId,
      canvasWidth: width,
      canvasHeight: height,
      unit,
      updateComponentRectById,
    });

  // 当选中组件的矩形（top/left/width/height）由外部表单或其它逻辑更新时，
  // 主动通知 Moveable 重新计算选择框位置
  useEffect(() => {
    moveableRef.current?.updateRect?.();
  }, [
    selectedId,
    selectedItem?.left,
    selectedItem?.top,
    selectedItem?.width,
    selectedItem?.height,
  ]);

  // 取消选中：点击画布空白区域
  const handleCanvasMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 点击 Moveable 控件不取消选中
    if (target.closest('.moveable') || target.closest('.moveable-control')) return;
    setSelectedId(undefined);
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
            'overflow-hidden',
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
            ref={moveableRef}
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
