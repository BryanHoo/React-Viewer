import { memo, type FC, useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import { useCanvasStore } from '@/store/canvasStore';

interface CanvasContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onRequestClose: () => void;
  pastePosition: { left: number; top: number };
}

const CanvasContextMenu: FC<CanvasContextMenuProps> = memo((props) => {
  const { isOpen, position, onRequestClose, pastePosition } = props;

  const { pasteFromClipboardAt, clearAll } = useCanvasStore(
    useShallow((state) => ({
      pasteFromClipboardAt: state.pasteFromClipboardAt,
      clearAll: state.clearAll,
    })),
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const handleStop = useMemoizedFn((e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  });

  const handlePaste = useMemoizedFn(() => {
    pasteFromClipboardAt(pastePosition.left, pastePosition.top);
    onRequestClose();
  });

  const handleClear = useMemoizedFn(() => {
    clearAll();
    onRequestClose();
  });

  // 点击菜单外部关闭（捕获阶段，避免被 stopPropagation 阻止）
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalPointer = (e: Event) => {
      const target = e.target as Node | null;
      if (!rootRef.current) return;
      if (target && rootRef.current.contains(target)) return;
      onRequestClose();
    };
    document.addEventListener('mousedown', handleGlobalPointer, true);
    document.addEventListener('contextmenu', handleGlobalPointer, true);
    return () => {
      document.removeEventListener('mousedown', handleGlobalPointer, true);
      document.removeEventListener('contextmenu', handleGlobalPointer, true);
    };
  }, [isOpen, onRequestClose]);

  if (!isOpen) return null;

  const baseItemClass =
    'flex items-center gap-2 justify-start px-3 py-2 cursor-pointer select-none rounded-md text-[12px] leading-none text-[color:var(--n-item-text-color)] hover:bg-[color:var(--n-item-color-hover)] active:bg-[color:var(--n-item-color-active)] transition-colors';

  return (
    <div
      ref={rootRef}
      style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 9999 }}
      className="w-[100px] bg-[color:var(--n-color)] p-1 rounded-lg border border-[color:var(--n-border-color)] shadow-xl"
      onMouseDown={handleStop}
      onClick={handleStop}
      onContextMenu={handleStop}
    >
      <div className={baseItemClass} onClick={handlePaste}>
        粘贴
      </div>
      <div className={baseItemClass} onClick={handleClear}>
        清空
      </div>
    </div>
  );
});

CanvasContextMenu.displayName = 'CanvasContextMenu';

export default CanvasContextMenu;
