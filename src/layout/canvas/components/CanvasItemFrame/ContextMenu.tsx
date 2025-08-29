import { memo, type FC } from 'react';
import {
  Copy,
  CopyOne,
  CuttingOne,
  DeleteOne,
  DownSmall,
  Lock,
  PreviewCloseOne,
  ToBottomOne,
  ToTopOne,
  Unlock,
  UpSmall,
} from '@icon-park/react';
import { useMemoizedFn } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import { useCanvasStore } from '@/store/canvasStore';

interface ContextMenuProps {
  onClose?: () => void;
}

const ContextMenu: FC<ContextMenuProps> = memo(({ onClose }) => {
  const {
    selectedId,
    componentMap,
    setLockById,
    setVisibleById,
    copyById,
    cutById,
    pasteFromClipboard,
    bringToFront,
    sendToBack,
    moveUp,
    moveDown,
    removeComponentById,
  } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      componentMap: state.componentMap,
      setLockById: state.setLockById,
      setVisibleById: state.setVisibleById,
      copyById: state.copyById,
      cutById: state.cutById,
      pasteFromClipboard: state.pasteFromClipboard,
      bringToFront: state.bringToFront,
      sendToBack: state.sendToBack,
      moveUp: state.moveUp,
      moveDown: state.moveDown,
      removeComponentById: state.removeComponentById,
    })),
  );

  const current = selectedId ? componentMap.get(selectedId) : undefined;
  const isLocked = current?.isLocked ?? false;
  const isVisible = current?.isVisible ?? true;

  const handleToggleLock = useMemoizedFn(() => {
    if (!selectedId) return;
    setLockById(selectedId, !isLocked);
    onClose?.();
  });
  const handleToggleVisible = useMemoizedFn(() => {
    if (!selectedId) return;
    setVisibleById(selectedId, !isVisible);
    onClose?.();
  });
  const handleCopy = useMemoizedFn(() => {
    if (!selectedId) return;
    copyById(selectedId);
    onClose?.();
  });
  const handleCut = useMemoizedFn(() => {
    if (!selectedId) return;
    cutById(selectedId);
    onClose?.();
  });
  const handlePaste = useMemoizedFn(() => {
    pasteFromClipboard();
    onClose?.();
  });
  const handleBringToFront = useMemoizedFn(() => {
    if (!selectedId) return;
    bringToFront(selectedId);
    onClose?.();
  });
  const handleSendToBack = useMemoizedFn(() => {
    if (!selectedId) return;
    sendToBack(selectedId);
    onClose?.();
  });
  const handleMoveUp = useMemoizedFn(() => {
    if (!selectedId) return;
    moveUp(selectedId);
    onClose?.();
  });
  const handleMoveDown = useMemoizedFn(() => {
    if (!selectedId) return;
    moveDown(selectedId);
    onClose?.();
  });
  const handleDelete = useMemoizedFn(() => {
    if (!selectedId) return;
    removeComponentById(selectedId);
    onClose?.();
  });

  const baseItemClass =
    'flex items-center gap-2 justify-start px-3 py-2 cursor-pointer select-none rounded-md text-[12px] leading-none text-[color:var(--n-item-text-color)] hover:bg-[color:var(--n-item-color-hover)] active:bg-[color:var(--n-item-color-active)] transition-colors';

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="w-[100px] bg-[color:var(--n-color)] p-1 rounded-lg border border-[color:var(--n-border-color)] shadow-xl"
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onContextMenu={stopPropagation}
    >
      <div className={baseItemClass} onClick={handleToggleLock}>
        {isLocked ? (
          <Unlock theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        ) : (
          <Lock theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        )}
        {isLocked ? '解锁' : '锁定'}
      </div>
      <div className={baseItemClass} onClick={handleToggleVisible}>
        <PreviewCloseOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        {isVisible ? '隐藏' : '显示'}
      </div>
      <div className="h-px my-2 bg-[color:var(--n-divider-color)]" />
      <div className={baseItemClass} onClick={handleCopy}>
        <Copy theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        复制
      </div>
      <div className={baseItemClass} onClick={handleCut}>
        <CuttingOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        剪切
      </div>
      <div className={baseItemClass} onClick={handlePaste}>
        <CopyOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        粘贴
      </div>
      <div className="h-px my-2 bg-[color:var(--n-divider-color)]" />
      <div className={baseItemClass} onClick={handleBringToFront}>
        <ToTopOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        置顶
      </div>
      <div className={baseItemClass} onClick={handleSendToBack}>
        <ToBottomOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        置底
      </div>
      <div className={baseItemClass} onClick={handleMoveUp}>
        <UpSmall theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        上移
      </div>
      <div className={baseItemClass} onClick={handleMoveDown}>
        <DownSmall theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        下移
      </div>
      <div className="h-px my-2 bg-[color:var(--n-divider-color)]" />
      <div className={baseItemClass} onClick={handleDelete}>
        <DeleteOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
        删除
      </div>
    </div>
  );
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;
