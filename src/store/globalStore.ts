import { create } from 'zustand';
import type { ChartColorsNameType } from '@/components/ECharts/chartThemes';
import { defaultTheme } from '@/components/ECharts/chartThemes';

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
  /** 背景图片（DataURL 或 URL） */
  backgroundImage?: string;
  /** 背景颜色 */
  backgroundColor: string;
  /** 背景适配方式 */
  backgroundFit: 'auto' | 'width' | 'height' | 'cover';
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
  /** echarts渲染器 */
  echartsRenderer: 'svg' | 'canvas';
  /** 全局主题色（ECharts 主题名） */
  themeColor: ChartColorsNameType;
}

/**
 * 全局状态操作方法类型
 */
export interface GlobalActions {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setScale: (scale: number) => void;
  setScaleLock: (scaleLock: boolean) => void;
  setBackgroundImage: (image?: string) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundFit: (fit: 'auto' | 'width' | 'height' | 'cover') => void;
  setShowChart: (showChart: boolean) => void;
  setShowLayer: (showLayer: boolean) => void;
  setShowDetail: (showDetail: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
  setActiveMenu: (activeMenu: string) => void;
  setEchartsRenderer: (echartsRenderer: 'svg' | 'canvas') => void;
  setThemeColor: (theme: ChartColorsNameType) => void;
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
  backgroundImage: undefined,
  backgroundColor: '#232324',
  backgroundFit: 'auto',
  showChart: true,
  showLayer: false,
  showDetail: true,
  isDragging: false,
  activeMenu: 'echarts',
  echartsRenderer: 'svg',
  themeColor: defaultTheme,
  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setScale: (scale) => set({ scale }),
  setScaleLock: (scaleLock) => set({ scaleLock }),
  setBackgroundImage: (image) => set({ backgroundImage: image }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBackgroundFit: (fit) => set({ backgroundFit: fit }),
  setShowChart: (showChart) => set({ showChart }),
  setShowLayer: (showLayer) => set({ showLayer }),
  setShowDetail: (showDetail) => set({ showDetail }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setActiveMenu: (activeMenu) => set({ activeMenu }),
  setEchartsRenderer: (echartsRenderer) => set({ echartsRenderer }),
  setThemeColor: (theme) => set({ themeColor: theme }),
}));
