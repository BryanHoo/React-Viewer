import { create } from 'zustand';

import { cloneComponentMap, createSnapshot } from '@/utils';

export type HistoryAction = AppHistoryAction;

export interface HistorySnapshot extends AppHistorySnapshotMeta {
  id: string;
  timestamp: number;
  componentSnapshotMap: Map<string, AppMaterielCanvasItem>;
}

export interface HistoryState {
  histories: HistorySnapshot[];
  historyIndex: number;
}

export interface HistoryActions {
  commit: (map: Map<string, AppMaterielCanvasItem>, meta: AppHistorySnapshotMeta) => void;
  undo: (apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
  redo: (apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
  goto: (index: number, apply: (map: Map<string, AppMaterielCanvasItem>) => void) => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState & HistoryActions>()((set, get) => ({
  histories: [
    // 最新在上：初始化时只有一条初始化记录
    createSnapshot(new Map<string, AppMaterielCanvasItem>(), {
      action: 'init',
      label: '画布初始化',
    }),
  ],
  // 当前指针，指向 histories 中的当前状态；最新为 0，越大越旧
  historyIndex: 0,
  commit: (map, meta) =>
    set((state) => {
      const snap = createSnapshot(map, meta);
      // 丢弃“未来”记录：最新在上时，0..historyIndex-1 都是未来
      const remain = state.histories.slice(state.historyIndex);
      return {
        histories: [snap, ...remain],
        historyIndex: 0,
      } as Pick<HistoryState, 'histories' | 'historyIndex'>;
    }),
  undo: (apply) => {
    const { historyIndex, histories } = get();
    // 最新在上：向“更旧”撤回 -> index + 1
    if (historyIndex >= histories.length - 1) return;
    const newIndex = historyIndex + 1;
    const snap = histories[newIndex];
    apply(cloneComponentMap(snap.componentSnapshotMap));
    set({ historyIndex: newIndex });
  },
  redo: (apply) => {
    const { historyIndex, histories } = get();
    // 恢复到“更新”的记录 -> index - 1
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const snap = histories[newIndex];
    apply(cloneComponentMap(snap.componentSnapshotMap));
    set({ historyIndex: newIndex });
  },
  goto: (index, apply) => {
    const { histories } = get();
    if (index < 0 || index >= histories.length) return;
    const snap = histories[index];
    apply(cloneComponentMap(snap.componentSnapshotMap));
    set({ historyIndex: index });
  },
  reset: () =>
    set({
      histories: [
        createSnapshot(new Map<string, AppMaterielCanvasItem>(), {
          action: 'init',
          label: '画布初始化',
        }),
      ],
      historyIndex: 0,
    }),
}));
