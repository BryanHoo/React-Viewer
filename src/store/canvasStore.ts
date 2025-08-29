import { create } from 'zustand';
import { useGlobalStore } from '@/store/globalStore';
import { computeNextRectWithinCanvas } from '@/utils/rect';
import { useHistoryStore } from '@/store/historyStore';
import type { HistoryAction } from '@/store/historyStore';
import { cloneDeep } from 'lodash-es';
import { generateId, getHighestZIndex } from '@/utils';
import { buildOrderAfterSendToBack, buildOrderAfterMoveDown, buildOrderAfterMoveUp } from '@/utils';

export interface CanvasComponentState {
  componentMap: Map<string, AppMaterielCanvasItem>;
  selectedId?: string;
  clipboard?: AppMaterielCanvasItem;
}

export interface CanvasComponentActions {
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

export const useCanvasStore = create<CanvasComponentState & CanvasComponentActions>()((set) => ({
  componentMap: new Map<string, AppMaterielCanvasItem>(),
  selectedId: undefined,
  clipboard: undefined,
  setComponentMap: (componentMap) =>
    set(() => {
      const nextMap = componentMap;
      useHistoryStore.getState().commit(nextMap, { action: 'update', label: '更新组件集' });
      return { componentMap: nextMap };
    }),
  addComponent: (component) =>
    set((state) => {
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      const withLayer: AppMaterielCanvasItem = {
        ...component,
        isLocked: component.isLocked ?? false,
        isVisible: component.isVisible ?? true,
        zIndex: component.zIndex ?? highest + 1,
      };
      nextMap.set(withLayer.id, withLayer);
      useHistoryStore.getState().commit(nextMap, {
        action: 'add',
        label: `新增 - ${withLayer.title ?? withLayer.type ?? '组件'}`,
        componentId: withLayer.id,
      });
      return { componentMap: nextMap };
    }),
  removeComponentById: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {};
      const nextMap = new Map(state.componentMap);
      const removed = nextMap.get(id);
      nextMap.delete(id);
      // 如果被删除的是当前选中项，则清空选中
      const nextSelectedId = state.selectedId === id ? undefined : state.selectedId;
      useHistoryStore.getState().commit(nextMap, {
        action: 'delete',
        label: `删除 - ${removed?.title ?? removed?.type ?? '组件'}`,
        componentId: id,
      });
      return { componentMap: nextMap, selectedId: nextSelectedId };
    }),
  setSelectedId: (id) => set({ selectedId: id }),
  clearAll: () =>
    set((state) => {
      if (state.componentMap.size === 0) return {};
      const nextMap = new Map<string, AppMaterielCanvasItem>();
      useHistoryStore.getState().commit(nextMap, { action: 'delete', label: '清空画布' });
      return { componentMap: nextMap, selectedId: undefined };
    }),
  updateComponentRectById: (id, next) =>
    set((state) => {
      const { width: canvasWidth, height: canvasHeight } = useGlobalStore.getState();

      const current = state.componentMap.get(id);
      if (!current) return {};

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
      nextMap.set(id, { ...current, ...computed } as AppMaterielCanvasItem);

      // 仅当有变更时记录
      const changed =
        before.left !== computed.left ||
        before.top !== computed.top ||
        before.width !== computed.width ||
        before.height !== computed.height;

      if (!changed) {
        return { componentMap: nextMap };
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
      });

      return { componentMap: nextMap };
    }),
  updateComponentById: (id, next) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, ...next } as AppMaterielCanvasItem);
      useHistoryStore.getState().commit(nextMap, {
        action: 'update',
        label: `更新 - ${current.title ?? current.type ?? '组件'}`,
        componentId: id,
      });
      return { componentMap: nextMap };
    }),
  bringToFront: (id) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      nextMap.set(id, { ...current, zIndex: highest + 1 });
      useHistoryStore.getState().commit(nextMap, { action: 'reorder', label: '置顶' });
      return { componentMap: nextMap };
    }),
  reorderByIds: (descIds) =>
    set((state) => {
      if (!descIds || descIds.length === 0) return {};
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
        nextMap.set(id, { ...item, zIndex });
      });

      useHistoryStore.getState().commit(nextMap, { action: 'reorder', label: '调整层级' });
      return { componentMap: nextMap };
    }),
  setLockById: (id, isLocked) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isLocked });
      useHistoryStore
        .getState()
        .commit(nextMap, { action: 'update', label: isLocked ? '锁定' : '解锁' });
      return { componentMap: nextMap };
    }),
  setVisibleById: (id, isVisible) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      const nextMap = new Map(state.componentMap);
      nextMap.set(id, { ...current, isVisible });
      useHistoryStore
        .getState()
        .commit(nextMap, { action: 'update', label: isVisible ? '显示' : '隐藏' });
      return { componentMap: nextMap };
    }),
  sendToBack: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {};
      const ordered = buildOrderAfterSendToBack(state.componentMap, id);
      // 复用 reorderByIds 归一化 zIndex
      useCanvasStore.getState().reorderByIds(ordered);
      return {};
    }),
  moveUp: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {};
      const ordered = buildOrderAfterMoveUp(state.componentMap, id);
      useCanvasStore.getState().reorderByIds(ordered);
      return {};
    }),
  moveDown: (id) =>
    set((state) => {
      if (!state.componentMap.has(id)) return {};
      const ordered = buildOrderAfterMoveDown(state.componentMap, id);
      useCanvasStore.getState().reorderByIds(ordered);
      return {};
    }),
  copyById: (id) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      // 深拷贝 option，其余为浅拷贝即可
      const copied: AppMaterielCanvasItem = {
        ...current,
        option: cloneDeep(current.option ?? {}),
      };
      return { clipboard: copied };
    }),
  cutById: (id) =>
    set((state) => {
      const current = state.componentMap.get(id);
      if (!current) return {};
      const copied: AppMaterielCanvasItem = {
        ...current,
        option: cloneDeep(current.option ?? {}),
      };
      // 先设置剪贴板，再删除
      const next: Partial<CanvasComponentState> = { clipboard: copied };
      // 删除将记录历史
      useCanvasStore.getState().removeComponentById(id);
      return next;
    }),
  pasteFromClipboard: () =>
    set((state) => {
      const clip = state.clipboard;
      if (!clip) return {};
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      const offset = 10;
      const id = generateId('comp_');
      const nextComponent: AppMaterielCanvasItem = {
        ...clip,
        id,
        left: (clip.left ?? 0) + offset,
        top: (clip.top ?? 0) + offset,
        zIndex: Math.max(highest + 1, (clip.zIndex ?? 0) + 1),
        isLocked: false,
        isVisible: true,
        option: cloneDeep(clip.option ?? {}),
      };
      nextMap.set(id, nextComponent);
      useHistoryStore.getState().commit(nextMap, {
        action: 'add',
        label: `粘贴 - ${nextComponent.title ?? nextComponent.type ?? '组件'}`,
        componentId: id,
      });
      return { componentMap: nextMap, selectedId: id };
    }),
  pasteFromClipboardAt: (left, top) =>
    set((state) => {
      const clip = state.clipboard;
      if (!clip) return {};
      const nextMap = new Map(state.componentMap);
      const highest = getHighestZIndex(nextMap);
      const id = generateId('comp_');
      const nextComponent: AppMaterielCanvasItem = {
        ...clip,
        id,
        left: Math.round(left),
        top: Math.round(top),
        zIndex: Math.max(highest + 1, (clip.zIndex ?? 0) + 1),
        isLocked: false,
        isVisible: true,
        option: cloneDeep(clip.option ?? {}),
      };
      nextMap.set(id, nextComponent);
      useHistoryStore.getState().commit(nextMap, {
        action: 'add',
        label: `粘贴 - ${nextComponent.title ?? nextComponent.type ?? '组件'}`,
        componentId: id,
      });
      return { componentMap: nextMap, selectedId: id };
    }),
  undo: () =>
    set(() => {
      useHistoryStore.getState().undo((map) => set({ componentMap: map }));
      return {};
    }),
  redo: () =>
    set(() => {
      useHistoryStore.getState().redo((map) => set({ componentMap: map }));
      return {};
    }),
  gotoHistory: (index: number) =>
    set(() => {
      useHistoryStore.getState().goto(index, (map) => set({ componentMap: map }));
      return {};
    }),
}));
