import { useGlobalStore } from '@/store/globalStore';
import { memo, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useCanvasStore } from '@/store/canvasStore';
// import type { MaterielCanvasItem } from '@/types/materielType';
import { useMemoizedFn } from 'ahooks';
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import SortableItem from './components/SortableItem';

const Layer = memo(() => {
  const { showLayer } = useGlobalStore(
    useShallow((state) => ({
      showLayer: state.showLayer,
    })),
  );
  const { componentMap, selectedId, setSelectedId, reorderByIds, setLockById, setVisibleById } =
    useCanvasStore(
      useShallow((state) => ({
        componentMap: state.componentMap,
        selectedId: state.selectedId,
        setSelectedId: state.setSelectedId,
        reorderByIds: state.reorderByIds,
        setLockById: state.setLockById,
        setVisibleById: state.setVisibleById,
      })),
    );

  const items = useMemo(() => {
    const list = Array.from(componentMap.values());
    // 顶层优先（zIndex 大在前）
    return list.sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
  }, [componentMap]);

  const ids = useMemo(() => items.map((it) => it.id), [items]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: { y: 6 } } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: { y: 8, x: 8 } } }),
  );

  const handleSelect = useMemoizedFn((id: string) => {
    setSelectedId(id);
  });
  const handleToggleLock = useMemoizedFn((id: string, next: boolean) => {
    setLockById(id, next);
  });
  const handleToggleVisible = useMemoizedFn((id: string, next: boolean) => {
    setVisibleById(id, next);
  });

  const handleDragEnd = useMemoizedFn((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const nextIds = arrayMove(ids, oldIndex, newIndex);
    reorderByIds(nextIds);
  });
  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 ${showLayer ? 'w-[150px] opacity-100' : 'w-0 opacity-0'}`}
    >
      <div className="h-[40px] flex items-center justify-center p-[10px] text-sm text-[var(--n-text-color)]">
        图层
      </div>
      <div className="flex-1 overflow-auto px-[8px] pb-[8px]">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                isActive={selectedId === item.id}
                onSelect={handleSelect}
                onToggleLock={handleToggleLock}
                onToggleVisible={handleToggleVisible}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
});

export default Layer;

Layer.displayName = 'Layer';
