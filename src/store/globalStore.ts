import type { MaterielCanvasItem } from '@/types/materielType';
import { create } from 'zustand';

/**
 * 全局状态类型定义
 */
export interface GlobalState {
  /** 画布宽度 */
  width: number;
  /** 画布高度 */
  height: number;
  /** 画布缩放比例 */
  scale: number;
  /** 画布缩放比例锁定 */
  scaleLock: boolean;
  /** 显示图表 */
  showChart?: boolean;
  /** 显示图层 */
  showLayer?: boolean;
  /** 显示详情设置 */
  showDetail?: boolean;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 当前激活的菜单 */
  activeMenu: string;
  /** 画布内当前组件列表 */
  componentList: MaterielCanvasItem[];
  /** 当前选中组件的 ID，未选中为 null */
  selectedComponentId: string | null;
}

/**
 * 全局状态操作方法类型
 */
export interface GlobalActions {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setScale: (scale: number) => void;
  setScaleLock: (scaleLock: boolean) => void;
  setShowChart: (showChart: boolean) => void;
  setShowLayer: (showLayer: boolean) => void;
  setShowDetail: (showDetail: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
  setActiveMenu: (activeMenu: string) => void;
  setComponentList: (componentList: MaterielCanvasItem[]) => void;
  /** 设置当前选中组件的 ID */
  setSelectedComponentId: (id: string | null) => void;
  /** 根据 ID 更新组件的矩形信息（仅变更提供的字段），会自动进行取整与边界/最小尺寸钳制 */
  updateComponentRectById: (
    id: string,
    next: { top?: number; left?: number; width?: number; height?: number },
  ) => void;
}

/**
 * useGlobalStore: 全局状态管理 hook
 * @description 管理页面级公共数据
 */
export const useGlobalStore = create<GlobalState & GlobalActions>()((set) => ({
  width: 1920,
  height: 1080,
  scale: 100,
  autoScale: undefined,
  scaleLock: false,
  showChart: true,
  showLayer: false,
  showDetail: true,
  isDragging: false,
  activeMenu: 'echarts',
  componentList: [],
  selectedComponentId: null,
  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setScale: (scale) => set({ scale }),
  setScaleLock: (scaleLock) => set({ scaleLock }),
  setShowChart: (showChart) => set({ showChart }),
  setShowLayer: (showLayer) => set({ showLayer }),
  setShowDetail: (showDetail) => set({ showDetail }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setActiveMenu: (activeMenu) => set({ activeMenu }),
  setComponentList: (componentList) => set({ componentList }),
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  updateComponentRectById: (id, next) =>
    set((state) => {
      const MIN_WIDTH = 80;
      const MIN_HEIGHT = 60;
      const canvasWidth = state.width;
      const canvasHeight = state.height;

      const updatedList = state.componentList.map((item) => {
        if (item.id !== id) return item;

        const rawLeft = next.left ?? item.left;
        const rawTop = next.top ?? item.top;
        const rawWidth = next.width ?? item.width;
        const rawHeight = next.height ?? item.height;

        // 取整
        let left = Math.round(rawLeft);
        let top = Math.round(rawTop);
        let width = Math.round(rawWidth);
        let height = Math.round(rawHeight);

        // 最小尺寸
        width = Math.max(MIN_WIDTH, width);
        height = Math.max(MIN_HEIGHT, height);

        // 画布边界钳制
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left + width > canvasWidth) {
          if (width > canvasWidth) {
            width = canvasWidth;
            left = 0;
          } else {
            left = canvasWidth - width;
          }
        }
        if (top + height > canvasHeight) {
          if (height > canvasHeight) {
            height = canvasHeight;
            top = 0;
          } else {
            top = canvasHeight - height;
          }
        }

        return { ...item, left, top, width, height };
      });

      return { componentList: updatedList };
    }),
}));
