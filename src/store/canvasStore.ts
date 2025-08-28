import { create } from 'zustand';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useGlobalStore } from '@/store/globalStore';
import { computeNextRectWithinCanvas } from '@/utils/rect';
import { useHistoryStore } from '@/store/historyStore';
import type { HistorySnapshotMeta, HistoryAction } from '@/store/historyStore';

export interface CanvasComponentState {
  componentMap: Map<string, MaterielCanvasItem>;
  selectedId?: string;
}

export interface CanvasComponentActions {
  setComponentMap: (componentMap: Map<string, MaterielCanvasItem>) => void;
  addComponent: (component: MaterielCanvasItem) => void;
  removeComponentById: (id: string) => void;
  setSelectedId: (id?: string) => void;
  updateComponentRectById: (
    id: string,
    next: { top?: number; left?: number; width?: number; height?: number },
  ) => void;
  updateComponentById: (id: string, next: Partial<MaterielCanvasItem>) => void;
  bringToFront: (id: string) => void;
  reorderByIds: (descIds: string[]) => void;
  setLockById: (id: string, isLocked: boolean) => void;
  setVisibleById: (id: string, isVisible: boolean) => void;
  undo: () => void;
  redo: () => void;
  gotoHistory: (index: number) => void;
}

function getHighestZIndex(map: Map<string, MaterielCanvasItem>): number {
  let max = 0;
  map.forEach((item) => {
    const z = item.zIndex ?? 0;
    if (z > max) max = z;
  });
  return max;
}

// clone handled in historyStore, no need here

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentMap: new Map<string, MaterielCanvasItem>(),
  selectedId: undefined,
  setComponentMap: (componentMap) =>
    set(() => {
      const nextMap = componentMap;
      useHistoryStore.getState().commit(nextMap, { action: 'update', label: '更新组件集' });
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  addComponent: (component) =>
    set((state) => {
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      const withLayer: MaterielCanvasItem = {
        isLocked: false,
        isVisible: true,
        zIndex: component.zIndex ?? highest + 1,
        ...component,
      } as MaterielCanvasItem;
      nextMap.set(withLayer.id, withLayer);
      useHistoryStore.getState().commit(nextMap, {
        action: 'add',
        label: `新增 - ${withLayer.title ?? withLayer.type ?? '组件'}`,
        componentId: withLayer.id,
      } as HistorySnapshotMeta);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  removeComponentById: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      const removed = nextMap.get(id);
      nextMap.delete(id);
      // 如果被删除的是当前选中项，则清空选中
      const nextSelectedId = state.selectedId === id ? undefined : state.selectedId;
      useHistoryStore.getState().commit(nextMap, {
        action: 'delete',
        label: `删除 - ${removed?.title ?? removed?.type ?? '组件'}`,
        componentId: id,
      } as HistorySnapshotMeta);
      return { componentMap: nextMap, selectedId: nextSelectedId } as Pick<
        CanvasComponentState,
        'componentMap' | 'selectedId'
      >;
    }),
  setSelectedId: (id) => set({ selectedId: id }),
  updateComponentRectById: (id, next) =>
    set((state) => {
      const { width: canvasWidth, height: canvasHeight } = useGlobalStore.getState();

      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;

      const computed = computeNextRectWithinCanvas(
        { left: current.left, top: current.top, width: current.width, height: current.height },
        next,
        { width: canvasWidth, height: canvasHeight },
      );

      const nextMap = new Map(state.componentMap);
      const before = {
        left: current.left,
        top: current.top,
        width: current.width,
        height: current.height,
      };
      nextMap.set(id, { ...current, ...computed } as MaterielCanvasItem);

      // 仅当有变更时记录
      const changed =
        before.left !== computed.left ||
        before.top !== computed.top ||
        before.width !== computed.width ||
        before.height !== computed.height;

      if (!changed) {
        return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
      }

      const action: HistoryAction =
        next.width !== undefined || next.height !== undefined ? 'resize' : 'move';
      useHistoryStore.getState().commit(nextMap, {
        action,
        label:
          action === 'move'
            ? `移动 - ${current.title ?? current.type ?? '组件'}`
            : `调整大小 - ${current.title ?? current.type ?? '组件'}`,
        componentId: id,
      } as HistorySnapshotMeta);

      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  updateComponentById: (id, next) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, ...next } as MaterielCanvasItem);
      useHistoryStore.getState().commit(nextMap, {
        action: 'update',
        label: `更新 - ${current.title ?? current.type ?? '组件'}`,
        componentId: id,
      } as HistorySnapshotMeta);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  bringToFront: (id) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      nextMap.set(id, { ...current, zIndex: highest + 1 } as MaterielCanvasItem);
      useHistoryStore.getState().commit(nextMap, { action: 'reorder', label: '置顶' });
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  reorderByIds: (descIds) =>
    set((state) => {
      if (!descIds || descIds.length === 0) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);

      const idsSet = new Set(descIds);
      const ordered: string[] = [...descIds];
      // 将未包含的 id 追加到底部，保持原相对顺序
      state.componentMap.forEach((_, id) => {
        if (!idsSet.has(id)) ordered.push(id);
      });

      const total = ordered.length;
      ordered.forEach((id, index) => {
        const item = nextMap.get(id);
        if (!item) return;
        // 顶部 index=0 -> zIndex=total，底部 index=total-1 -> zIndex=1
        const zIndex = total - index;
        nextMap.set(id, { ...item, zIndex } as MaterielCanvasItem);
      });

      useHistoryStore.getState().commit(nextMap, { action: 'reorder', label: '调整层级' });
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  setLockById: (id, isLocked) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isLocked } as MaterielCanvasItem);
      useHistoryStore
        .getState()
        .commit(nextMap, { action: 'update', label: isLocked ? '锁定' : '解锁' });
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  setVisibleById: (id, isVisible) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isVisible } as MaterielCanvasItem);
      useHistoryStore
        .getState()
        .commit(nextMap, { action: 'update', label: isVisible ? '显示' : '隐藏' });
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  undo: () =>
    set(() => {
      useHistoryStore.getState().undo((map) => set({ componentMap: map }));
      return {} as Pick<CanvasComponentState, 'componentMap'>;
    }),
  redo: () =>
    set(() => {
      useHistoryStore.getState().redo((map) => set({ componentMap: map }));
      return {} as Pick<CanvasComponentState, 'componentMap'>;
    }),
  gotoHistory: (index: number) =>
    set(() => {
      useHistoryStore.getState().goto(index, (map) => set({ componentMap: map }));
      return {} as Pick<CanvasComponentState, 'componentMap'>;
    }),
}));
