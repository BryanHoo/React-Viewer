import { memo, useMemo, useCallback } from 'react';
import { Button, List, Popover } from 'antd';
import { useHistoryStore } from '@/store/historyStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import classNames from '@/utils/classname';

interface HistoryPopoverProps {
  size?: 'small' | 'middle' | 'large';
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
}

const HistoryPopover: React.FC<HistoryPopoverProps> = memo((props) => {
  const { size = 'middle', placement = 'top' } = props;

  const { histories, historyIndex } = useHistoryStore(
    useShallow((state) => ({ histories: state.histories, historyIndex: state.historyIndex })),
  );
  const goto = useHistoryStore((state) => state.goto);
  const applyGoto = useCallback(
    (index: number) =>
      goto(index, (map) => {
        useCanvasStore.setState({ componentMap: map });
      }),
    [goto],
  );

  const content = useMemo(() => {
    if (!histories || histories.length === 0) return <div>暂无历史</div>;
    return (
      <div style={{ width: 200, maxHeight: 300, overflowY: 'auto' }}>
        <List
          size="small"
          dataSource={histories}
          renderItem={(item, index) => (
            <List.Item
              onClick={() => applyGoto(index)}
              className={classNames(
                'p-[8px]',
                'cursor-pointer',
                '!border-1',
                '!border-transparent',
                'rounded-md',
                'mb-[4px]',
                index === historyIndex
                  ? '!bg-[rgba(81,214,169,0.2)]'
                  : 'hover:bg-[rgba(255,255,255,0.06)]',
                index === historyIndex ? '!border-[var(--n-primary-color)]' : '!border-transparent',
              )}
            >
              <div className="flex flex-row w-full justify-between">
                <div className="text-[13px] text-[var(--n-text-color)] truncate">{item.label}</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.45)]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }, [histories, historyIndex, applyGoto]);

  return (
    <Popover placement={placement} content={content} trigger="click">
      <Button type="text" size={size}>
        历史记录
      </Button>
    </Popover>
  );
});

HistoryPopover.displayName = 'HistoryPopover';

export default HistoryPopover;
