import { useRef } from 'react';
import { useKeyPress, useMemoizedFn } from 'ahooks';
import { useCanvasStore } from '@/store/canvasStore';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { cloneDeep } from 'lodash-es';
import { generateId } from '@/utils';
import type { MaterielCanvasItem } from '@/types/materielType';
import { computeNextRectWithinCanvas } from '@/utils/rect';

function isFormEditingTarget(target: EventTarget | null): boolean {
  if (!target || !(target as HTMLElement).closest) return false;
  const el = (target as HTMLElement).closest<HTMLElement>(
    'input, textarea, [contenteditable="true"]',
  );
  return Boolean(el);
}

/**
 * useKeyboardShortcuts
 * - Cmd/Ctrl + C: 复制当前选中组件
 * - Cmd/Ctrl + V: 粘贴为新组件（位置偏移并限制在画布内）
 * - Delete / Backspace: 删除当前选中组件
 */
export default function useKeyboardShortcuts(): void {
  const { width: canvasWidth, height: canvasHeight } = useGlobalStore(
    useShallow((state) => ({ width: state.width, height: state.height })),
  );

  const { componentMap, selectedId, addComponent, removeComponentById, setSelectedId } =
    useCanvasStore(
      useShallow((state) => ({
        componentMap: state.componentMap,
        selectedId: state.selectedId,
        addComponent: state.addComponent,
        removeComponentById: state.removeComponentById,
        setSelectedId: state.setSelectedId,
      })),
    );

  const clipboardRef = useRef<MaterielCanvasItem | null>(null);

  const handleCopy = useMemoizedFn((e: KeyboardEvent) => {
    if (isFormEditingTarget(e.target)) return;
    if (!selectedId) return;
    const current = componentMap.get(selectedId);
    if (!current) return;
    clipboardRef.current = { ...current, option: cloneDeep(current.option) } as MaterielCanvasItem;
  });

  const handlePaste = useMemoizedFn((e: KeyboardEvent) => {
    if (isFormEditingTarget(e.target)) return;
    const template = clipboardRef.current;
    if (!template) return;

    const nextLeft = (template.left ?? 0) + template.width;
    const nextTop = (template.top ?? 0) + template.height;

    const computed = computeNextRectWithinCanvas(
      { left: template.left, top: template.top, width: template.width, height: template.height },
      { left: nextLeft, top: nextTop },
      { width: canvasWidth, height: canvasHeight },
    );

    const newId = generateId(template.id);
    const nextItem: MaterielCanvasItem = {
      ...template,
      id: newId,
      left: computed.left,
      top: computed.top,
      width: computed.width,
      height: computed.height,
      option: cloneDeep(template.option),
      isVisible: true,
    } as MaterielCanvasItem;

    addComponent(nextItem);
    // 等待下一帧渲染出新 DOM 再设置选中，避免目标元素未挂载
    setTimeout(() => {
      setSelectedId(newId);
    }, 0);
    // 连续粘贴继续在上一次的基础上偏移
    clipboardRef.current = nextItem;
  });

  const handleDelete = useMemoizedFn((e: KeyboardEvent) => {
    if (isFormEditingTarget(e.target)) return;
    if (!selectedId) return;
    const current = componentMap.get(selectedId);
    if (current?.isLocked) return;
    removeComponentById(selectedId);
  });

  // 复制：Cmd/Ctrl + C
  useKeyPress(
    ['meta.c', 'ctrl.c'],
    (e) => {
      e.preventDefault();
      handleCopy(e as unknown as KeyboardEvent);
    },
    { exactMatch: true },
  );

  // 粘贴：Cmd/Ctrl + V
  useKeyPress(
    ['meta.v', 'ctrl.v'],
    (e) => {
      e.preventDefault();
      handlePaste(e as unknown as KeyboardEvent);
    },
    { exactMatch: true },
  );

  // 删除和退格
  useKeyPress(
    (event) => event.key === 'Backspace' || event.key === 'Delete',
    (e) => {
      e.preventDefault();
      handleDelete(e as unknown as KeyboardEvent);
    },
  );
}
