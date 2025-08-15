import { create } from 'zustand';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useGlobalStore } from '@/store/globalStore';
import { computeNextRectWithinCanvas } from '@/utils/rect';

export interface CanvasComponentState {
  componentList: MaterielCanvasItem[];
  selectedId: string | null;
}

export interface CanvasComponentActions {
  setComponentList: (componentList: MaterielCanvasItem[]) => void;
  setSelectedId: (id: string | null) => void;
  updateComponentRectById: (
    id: string,
    next: { top?: number; left?: number; width?: number; height?: number },
  ) => void;
  updateComponentById: (id: string, next: Partial<MaterielCanvasItem>) => void;
}

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentList: [],
  selectedId: null,
  setComponentList: (componentList) => set({ componentList }),
  setSelectedId: (id) => set({ selectedId: id }),
  updateComponentRectById: (id, next) =>
    set((state) => {
      const { width: canvasWidth, height: canvasHeight } = useGlobalStore.getState();

      const updatedList: MaterielCanvasItem[] = state.componentList.map(
        (item): MaterielCanvasItem => {
          if (item.id !== id) return item;

          const computed = computeNextRectWithinCanvas(
            { left: item.left, top: item.top, width: item.width, height: item.height },
            next,
            { width: canvasWidth, height: canvasHeight },
          );

          return { ...item, ...computed } as MaterielCanvasItem;
        },
      );

      return { componentList: updatedList } as Pick<CanvasComponentState, 'componentList'>;
    }),
  updateComponentById: (id, next) =>
    set((state) => {
      const updatedList: MaterielCanvasItem[] = state.componentList.map((item) =>
        item.id === id ? ({ ...item, ...next } as MaterielCanvasItem) : item,
      );
      return { componentList: updatedList } as Pick<CanvasComponentState, 'componentList'>;
    }),
}));
