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
  setSelectedId: (id?: string) => void;
  updateComponentRectById: (
    id: string,
    next: { top?: number; left?: number; width?: number; height?: number },
  ) => void;
  updateComponentById: (id: string, next: Partial<MaterielCanvasItem>) => void;
}

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentMap: new Map<string, MaterielCanvasItem>(),
  selectedId: undefined,
  setComponentMap: (componentMap) => set({ componentMap }),
  addComponent: (component) =>
    set((state) => {
      const nextMap = new Map(state.componentMap);
      nextMap.set(component.id, component);
      return { componentMap: nextMap } as Pick<CanvasComponentState, 'componentMap'>;
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
}));
