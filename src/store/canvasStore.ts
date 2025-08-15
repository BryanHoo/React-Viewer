import { create } from 'zustand';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useGlobalStore } from '@/store/globalStore';
import { computeNextRectWithinCanvas } from '@/utils/rect';

export interface CanvasComponentState {
  componentList: Map<string, MaterielCanvasItem>;
  selectedId: string | null;
}

export interface CanvasComponentActions {
  setComponentList: (componentList: Map<string, MaterielCanvasItem>) => void;
  addComponent: (component: MaterielCanvasItem) => void;
  setSelectedId: (id: string | null) => void;
  updateComponentRectById: (
    id: string,
    next: { top?: number; left?: number; width?: number; height?: number },
  ) => void;
  updateComponentById: (id: string, next: Partial<MaterielCanvasItem>) => void;
}

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentList: new Map<string, MaterielCanvasItem>(),
  selectedId: null,
  setComponentList: (componentList) => set({ componentList }),
  addComponent: (component) =>
    set((state) => {
      const nextMap = new Map(state.componentList);
      nextMap.set(component.id, component);
      return { componentList: nextMap } as Pick<CanvasComponentState, 'componentList'>;
    }),
  setSelectedId: (id) => set({ selectedId: id }),
  updateComponentRectById: (id, next) =>
    set((state) => {
      const { width: canvasWidth, height: canvasHeight } = useGlobalStore.getState();

      const current = state.componentList.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentList'>;

      const computed = computeNextRectWithinCanvas(
        { left: current.left, top: current.top, width: current.width, height: current.height },
        next,
        { width: canvasWidth, height: canvasHeight },
      );

      const nextMap = new Map(state.componentList);
      nextMap.set(id, { ...current, ...computed } as MaterielCanvasItem);

      return { componentList: nextMap } as Pick<CanvasComponentState, 'componentList'>;
    }),
  updateComponentById: (id, next) =>
    set((state) => {
      const current = state.componentList.get(id);
      if (!current) return {} as Pick<CanvasComponentState, 'componentList'>;
      const nextMap = new Map(state.componentList);
      nextMap.set(id, { ...current, ...next } as MaterielCanvasItem);
      return { componentList: nextMap } as Pick<CanvasComponentState, 'componentList'>;
    }),
}));
