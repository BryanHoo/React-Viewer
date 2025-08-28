import { memo, useMemo } from 'react';
import type { MaterielCanvasItem } from '@/types/materielType';
import { useSortable } from '@dnd-kit/sortable';
import { Lock, PreviewCloseOne, PreviewOpen, Unlock } from '@icon-park/react';
import { useMemoizedFn } from 'ahooks';
import classNames from '@/utils/classname';

interface SortableItemProps {
  item: MaterielCanvasItem;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleLock: (id: string, next: boolean) => void;
  onToggleVisible: (id: string, next: boolean) => void;
}

/**
 * 可排序的图层项组件
 * 支持拖拽排序、锁定、显示/隐藏功能
 */
const SortableItem = memo((props: SortableItemProps) => {
  const { item, isActive, onSelect, onToggleLock, onToggleVisible } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  // 1. 优化样式计算，使用 useMemo 缓存 transform 样式
  const style = useMemo<React.CSSProperties>(
    () => ({
      transform: transform
        ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
        : undefined,
      transition,
    }),
    [transform, transition],
  );

  // 2. 优化 className 计算，使用 useMemo 缓存
  const containerClassName = useMemo(() => {
    return classNames(
      'flex items-center gap-[8px] p-[8px] rounded-md cursor-grab active:cursor-grabbing select-none border-1 mb-[4px]',
      isActive ? 'bg-[rgba(81,214,169,0.2)]' : 'hover:bg-[rgba(255,255,255,0.06)]',
      isActive ? 'border-[var(--n-primary-color)]' : 'border-transparent',
    );
  }, [isActive]);

  // 3. 简化 isVisible 判断逻辑，提取常量
  const isVisible = item.isVisible !== false;
  const isLocked = item.isLocked === true;

  // 4. 使用 useMemoizedFn 优化事件处理函数
  const handleSelect = useMemoizedFn(() => {
    onSelect(item.id);
  });

  const handleToggleLock = useMemoizedFn((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLock(item.id, !isLocked);
  });

  const handleToggleVisible = useMemoizedFn((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisible(item.id, !isVisible);
  });

  // 5. 优化按钮样式计算
  const lockButtonClassName = useMemo(() => {
    return `text-xs ${isLocked ? 'text-[var(--n-primary-color)]' : 'text-[rgba(255,255,255,0.7)]'}`;
  }, [isLocked]);

  const visibleButtonClassName = useMemo(() => {
    return `text-xs ${!isVisible ? 'text-[var(--n-primary-color)]' : 'text-[var(--n-text-color)]'}`;
  }, [isVisible]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClassName}
      onClick={handleSelect}
      {...attributes}
      {...listeners}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-[var(--n-text-color)] truncate">{item.title}</div>
      </div>
      <div className="flex items-center gap-[8px]">
        <button className={lockButtonClassName} onClick={handleToggleLock}>
          {isLocked ? (
            <Lock theme="outline" size="12" fill="currentColor" strokeWidth={3} />
          ) : (
            <Unlock theme="outline" size="12" fill="currentColor" strokeWidth={3} />
          )}
        </button>
        <button className={visibleButtonClassName} onClick={handleToggleVisible}>
          {!isVisible ? (
            <PreviewCloseOne theme="outline" size="12" fill="currentColor" strokeWidth={3} />
          ) : (
            <PreviewOpen theme="outline" size="12" fill="currentColor" strokeWidth={3} />
          )}
        </button>
      </div>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';

export default SortableItem;
