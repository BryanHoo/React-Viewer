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
import type { Rect } from '@/utils/rect';
import useComponent from '@/hooks/useComponent';
import { cloneDeep } from 'lodash-es';
import useWheelZoomOrScroll from './hooks/useWheelZoomOrScroll';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { defaultEvent } from '../setting/selectedPanel/event/config';
import CanvasContextMenu from './components/CanvasContextMenu';

const Canvas: React.FC = memo(() => {
  const {
    width,
    height,
    scale,
    setScale,
    isDragging,
    scaleLock,
    backgroundColor,
    backgroundImage,
    backgroundFit,
  } = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      backgroundColor: state.backgroundColor,
      backgroundImage: state.backgroundImage,
      backgroundFit: state.backgroundFit,
      scale: state.scale,
      setScale: state.setScale,
      isDragging: state.isDragging,
      scaleLock: state.scaleLock,
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

  // 使用选择器，无需元素注册表

  const computedBackgroundSize = useMemo(() => {
    return backgroundFit === 'cover'
      ? 'cover'
      : backgroundFit === 'width'
        ? '100% auto'
        : backgroundFit === 'height'
          ? 'auto 100%'
          : 'auto';
  }, [backgroundFit]);

  useWheelZoomOrScroll({
    containerRef,
    scale,
    setScale,
    scaleLock,
    minScale: 10,
    maxScale: 200,
  });

  // 键盘快捷键：复制/粘贴/删除 选中组件
  useKeyboardShortcuts();

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
      const clamped: Rect = clampRectToCanvas(
        { left: realX, top: realY, width: defaultWidth, height: defaultHeight },
        { width, height },
      );

      const raw = e.dataTransfer.getData('materielConfig');
      let materielConfig: MaterielItem;
      try {
        const parsed = JSON.parse(raw);
        if (!isMaterielItem(parsed)) return;
        materielConfig = parsed;
      } catch {
        return;
      }
      const newId = generateId(materielConfig.id);
      addComponent({
        ...materielConfig,
        option: cloneDeep(materielConfig.option),
        id: newId,
        top: clamped.top,
        left: clamped.left,
        width: clamped.width,
        height: clamped.height,
        isVisible: true,
        event: defaultEvent,
      });
      setSelectedId(newId);
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

  const { onDrag, onDragEnd, onResize, onResizeEnd } = useMoveableHandlers({
    selectedId,
    updateComponentRectById,
  });

  // 以类选择器作为 target
  const targetSelector = useMemo(() => {
    if (!selectedId || !selectedItem?.isVisible) return null;
    return `.rv-comp-${selectedId}`;
  }, [selectedId, selectedItem?.isVisible]);

  // 以类选择器数组作为 elementGuidelines
  const elementGuidelines = useMemo(() => {
    return componentList
      .filter((c) => c.id !== selectedId && c.isVisible)
      .map((c) => ({ element: `.rv-comp-${c.id}`, className: 'rv-comp-guideline' }));
  }, [componentList, selectedId]);

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

  // 选择器目标发生变化时，通知 Moveable 重新解析选择器
  useEffect(() => {
    moveableRef.current?.updateSelectors?.();
  }, [targetSelector, elementGuidelines]);

  // 取消选中：点击画布空白区域（仅左键）
  const handleCanvasMouseDown = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    // 仅在左键点击时取消选中，避免右键菜单交互被打断
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    // 点击 Moveable 控件不取消选中
    if (target.closest('.moveable') || target.closest('.moveable-control')) return;
    setSelectedId(undefined);
  });

  // 画布级右键菜单
  const [isCanvasMenuOpen, setIsCanvasMenuOpen] = useState<boolean>(false);
  const [canvasMenuPosition, setCanvasMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pastePosition, setPastePosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  const handleCanvasContextMenu = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsCanvasMenuOpen(true);
    setCanvasMenuPosition({ x: e.clientX, y: e.clientY });
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const left = cx / zoom;
      const top = cy / zoom;
      setPastePosition({ left: Math.round(left), top: Math.round(top) });
    }
  });

  const handleCloseCanvasMenu = useMemoizedFn(() => {
    setIsCanvasMenuOpen(false);
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
            'relative',
            'overflow-hidden',
            styles.moveableTheme,
          )}
          style={{
            width,
            height,
            backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: computedBackgroundSize,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleCanvasMouseDown}
          onContextMenu={handleCanvasContextMenu}
        >
          {componentList.map((item) => (
            <ChartWrap {...item} key={item.id} />
          ))}

          {targetSelector ? (
            <Moveable
              ref={moveableRef}
              target={targetSelector}
              className={styles.moveableTheme}
              container={canvasRef.current}
              snapContainer={canvasRef.current}
              origin={false}
              edge={false}
              draggable={selectedItem?.isLocked ? false : true}
              resizable={selectedItem?.isLocked ? false : true}
              rotatable={false}
              keepRatio={false}
              zoom={zoom}
              bounds={{ left: 0, top: 0, right: width, bottom: height }}
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
          ) : null}
        </div>
      </InfiniteViewer>
      <CanvasContextMenu
        isOpen={isCanvasMenuOpen}
        position={canvasMenuPosition}
        pastePosition={pastePosition}
        onRequestClose={handleCloseCanvasMenu}
      />
      <Footer handleScaleChange={handleScaleChange} />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
