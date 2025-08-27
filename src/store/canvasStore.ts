import { create } from 'zustand';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useGlobalStore } from '@/store/globalStore';
import { computeNextRectWithinCanvas } from '@/utils/rect';

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
}

function getHighestZIndex(map: Map<string, MaterielCanvasItem>): number {
  let max = 0;
  map.forEach((item) => {
    const z = item.zIndex ?? 0;
    if (z > max) max = z;
  });
  return max;
}

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentMap: new Map<string, MaterielCanvasItem>(),
  selectedId: undefined,
  setComponentMap: (componentMap) => set({ componentMap }),
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
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  removeComponentById: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.delete(id);
      // 如果被删除的是当前选中项，则清空选中
      const nextSelectedId = state.selectedId === id ? undefined : state.selectedId;
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
      nextMap.set(id, { ...current, ...computed } as MaterielCanvasItem);

      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  updateComponentById: (id, next) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, ...next } as MaterielCanvasItem);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  bringToFront: (id) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      nextMap.set(id, { ...current, zIndex: highest + 1 } as MaterielCanvasItem);
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

      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  setLockById: (id, isLocked) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isLocked } as MaterielCanvasItem);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
  setVisibleById: (id, isVisible) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentMap'>;
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isVisible } as MaterielCanvasItem);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
    }),
}));
