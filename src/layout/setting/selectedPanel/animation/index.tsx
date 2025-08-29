import { memo, type FC, useMemo } from 'react';

import { Button, Collapse } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { useCanvasStore } from '@/store/canvasStore';
import { animationGroups } from './config';

const Animation: FC<AppPanelProps> = memo((props) => {
  const { id, config } = props;
  const { updateComponentById } = useCanvasStore();

  const handlePreviewEnter = useMemoizedFn((e: React.MouseEvent<HTMLElement>, key: string) => {
    const target = e.currentTarget as HTMLElement;
    const animatedClass = 'animate__animated';
    const animationClass = `animate__${key}`;
    target.dataset.hovering = '1';
    if (target.dataset.hoverFired === '1') return;
    if (target.dataset.hoverTimerId) return;
    const timerId = window.setTimeout(() => {
      delete target.dataset.hoverTimerId;
      if (target.dataset.hovering !== '1') return;
      if (target.dataset.hoverFired === '1') return;
      if (target.dataset.animating === '1') return;
      target.dataset.animating = '1';
      target.dataset.hoverFired = '1';
      target.classList.add(animatedClass, animationClass);
      const onEnd = () => {
        target.classList.remove(animatedClass, animationClass);
        delete target.dataset.animating;
      };
      target.addEventListener('animationend', onEnd, { once: true });
    }, 500);
    target.dataset.hoverTimerId = String(timerId);
  });

  const handlePreviewLeave = useMemoizedFn((e: React.MouseEvent<HTMLElement>, key: string) => {
    const target = e.currentTarget as HTMLElement;
    target.dataset.hovering = '0';
    if (target.dataset.hoverTimerId) {
      window.clearTimeout(Number(target.dataset.hoverTimerId));
      delete target.dataset.hoverTimerId;
    }
    if (target.dataset.animating === '1') return;
    target.classList.remove('animate__animated', `animate__${key}`);
    delete target.dataset.hoverFired;
  });

  const handleSelectAnimation = useMemoizedFn((key: string) => {
    if (!id) return;
    updateComponentById(id, { animation: `animate__${key}` });
  });

  const selectedAnimationKey = useMemo(() => {
    const value = config?.animation;
    if (!value) return undefined;
    return value.replace(/^animate__/, '');
  }, [config?.animation]);

  const items = useMemo(() => {
    return animationGroups.map((group) => ({
      key: group.groupKey,
      label: group.groupLabel,
      children: (
        <div className="flex flex-row flex-wrap gap-2 justify-start items-center">
          {group.items.map((item) => (
            <Button
              key={item.key}
              className="w-[30%]"
              aria-pressed={selectedAnimationKey === item.key}
              style={
                selectedAnimationKey === item.key
                  ? { borderColor: 'var(--n-item-text-color-active)' }
                  : undefined
              }
              onMouseEnter={(e) => handlePreviewEnter(e, item.key)}
              onMouseLeave={(e) => handlePreviewLeave(e, item.key)}
              onClick={() => handleSelectAnimation(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ),
    }));
  }, [handlePreviewEnter, handlePreviewLeave, handleSelectAnimation, selectedAnimationKey]);

  const handleClear = useMemoizedFn(() => {
    if (!id) return;
    updateComponentById(id, { animation: undefined });
  });

  return (
    <div className="flex flex-col h-full">
      <Button block onClick={handleClear}>
        清除动画
      </Button>
      <Collapse bordered={false} items={items} defaultActiveKey={['attention_seekers']} />
    </div>
  );
});

Animation.displayName = 'Animation';

export default Animation;
