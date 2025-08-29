import type { EChartsOption } from 'echarts';
import type { ComponentType, ReactNode } from 'react';

declare global {
  // 基础与通用
  type AppCssUnit = 'px' | '%';

  // 画布/物料领域
  type AppEventKey =
    | 'click'
    | 'dblclick'
    | 'mousedown'
    | 'mousemove'
    | 'mouseup'
    | 'mouseover'
    | 'mouseout';

  interface AppMaterielItem {
    id: string;
    title: string;
    image: string;
    type: string;
    componentName: string;
    panel?: string;
    renderer?: 'svg' | 'canvas' | 'inherit';
    option?: EChartsOption;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    apiType?: 'static' | 'public';
    animation?: string;
    event?: Record<AppEventKey, string>;
  }

  interface AppMaterielCanvasItem extends AppMaterielItem {
    top: number;
    left: number;
    width: number;
    height: number;
    zIndex?: number;
    isLocked?: boolean;
    isVisible: boolean;
  }

  interface AppPanelProps {
    config?: AppMaterielCanvasItem;
    id: string;
    index?: number;
  }

  interface AppBaseEChartsProps {
    id: string;
    config?: AppMaterielCanvasItem;
  }

  interface AppPackageConfig {
    config: AppMaterielItem[];
    components: Record<string, ComponentType<any>>;
    panels: Record<string, ComponentType<AppPanelProps>>;
  }

  type AppOptionKey = 'xAxis' | 'yAxis' | 'legend';

  interface AppTypeItemConfig {
    label: string;
    value: string;
    component: ComponentType<AppPanelProps>;
  }

  // 菜单
  interface AppMenuConfig {
    [key: string]: {
      title: string;
      icon: ReactNode;
      items: AppMaterielItem[];
    };
  }

  // Store：History
  type AppHistoryAction = 'init' | 'add' | 'delete' | 'move' | 'resize' | 'update' | 'reorder';

  interface AppHistorySnapshotMeta {
    action: AppHistoryAction;
    label: string;
    componentId?: string;
  }

  interface AppHistorySnapshot extends AppHistorySnapshotMeta {
    id: string;
    timestamp: number;
    componentSnapshotMap: Map<string, AppMaterielCanvasItem>;
  }

  interface AppHistoryState {
    histories: AppHistorySnapshot[];
    historyIndex: number;
  }

  interface AppHistoryActions {
    commit: (map: Map<string, AppMaterielCanvasItem>, meta: AppHistorySnapshotMeta) => void;
    undo: (apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
    redo: (apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
    goto: (index: number, apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
    reset: () => void;
  }

  // Store：Canvas
  interface AppCanvasComponentState {
    componentMap: Map<string, AppMaterielCanvasItem>;
    selectedId?: string;
    clipboard?: AppMaterielCanvasItem;
  }

  interface AppCanvasComponentActions {
    setComponentMap: (componentMap: Map<string, AppMaterielCanvasItem>) => void;
    addComponent: (component: AppMaterielCanvasItem) => void;
    removeComponentById: (id: string) => void;
    setSelectedId: (id?: string) => void;
    clearAll: () => void;
    updateComponentRectById: (
      id: string,
      next: { top?: number; left?: number; width?: number; height?: number },
    ) => void;
    updateComponentById: (id: string, next: Partial<AppMaterielCanvasItem>) => void;
    bringToFront: (id: string) => void;
    reorderByIds: (descIds: string[]) => void;
    setLockById: (id: string, isLocked: boolean) => void;
    setVisibleById: (id: string, isVisible: boolean) => void;
    sendToBack: (id: string) => void;
    moveUp: (id: string) => void;
    moveDown: (id: string) => void;
    copyById: (id: string) => void;
    cutById: (id: string) => void;
    pasteFromClipboard: () => void;
    pasteFromClipboardAt: (left: number, top: number) => void;
    undo: () => void;
    redo: () => void;
    gotoHistory: (index: number) => void;
  }

  // 几何与尺寸
  interface AppRect {
    left: number;
    top: number;
    width: number;
    height: number;
  }
  type AppRectPartial = Partial<AppRect>;
  interface AppCanvasBounds {
    width: number;
    height: number;
  }
  interface AppMinSizeConstraints {
    minWidth: number;
    minHeight: number;
  }

  // ECharts
  interface AppEChartsRef {
    getEchartsInstance: () => any;
  }
  type AppEchartsRenderer = 'svg' | 'canvas';
}

export {};
