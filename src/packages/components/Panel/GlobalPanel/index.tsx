import useComponent from '@/hooks/useComponent';
import Container from '@/packages/components/Panel/Container';
import Legend from '@/packages/components/Panel/Legend';
import PanelCommon from '@/packages/components/Panel/PanelCommon';
import Render from '@/packages/components/Panel/Render';
import XOption from '@/packages/components/Panel/XOption';
import YOption from '@/packages/components/Panel/YOption';
import { useCanvasStore } from '@/store/canvasStore';
import { Collapse, Switch, type CollapseProps } from 'antd';
import { memo, useMemo, type FC } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import { readShowFlag, updateOptionShowFlag } from '@/utils/chart';
import type { OptionKey } from '@/types/materielType';

interface GlobalPanelProps {
  children?: React.ReactNode;
  // 默认项启用的面板
  defaultItems?: string[];
  // 额外渲染的面板
  extraItems?: CollapseProps['items'];
}

const GlobalPanel: FC<GlobalPanelProps> = memo(({ children, defaultItems, extraItems }) => {
  const { selectedId, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      updateComponentById: state.updateComponentById,
    })),
  );
  const { config } = useComponent({ id: selectedId });

  const handleToggleShow = useMemoizedFn((key: OptionKey, checked: boolean) => {
    if (!selectedId) return;
    const prevOption = config?.option ?? {};
    const nextOption = updateOptionShowFlag(prevOption, key, checked);
    updateComponentById(selectedId, { option: nextOption });
  });

  const xAxisShowChecked = useMemo(
    () => readShowFlag(config?.option?.xAxis as unknown),
    [config?.option?.xAxis],
  );
  const yAxisShowChecked = useMemo(
    () => readShowFlag(config?.option?.yAxis as unknown),
    [config?.option?.yAxis],
  );
  const legendShowChecked = useMemo(
    () => readShowFlag(config?.option?.legend as unknown),
    [config?.option?.legend],
  );

  const handleClick = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  });

  const items: CollapseProps['items'] = useMemo(() => {
    let allItems: CollapseProps['items'] = [];
    const items: CollapseProps['items'] = [
      {
        key: 'render',
        label: '渲染器',
        children: <Render />,
      },
      {
        key: 'container',
        label: '容器',
        children: <Container />,
      },
      {
        key: 'xOption',
        label: 'X 轴',
        children: <XOption />,
        extra: (
          <div onClick={handleClick}>
            <Switch
              checked={xAxisShowChecked}
              onChange={(checked) => handleToggleShow('xAxis', checked)}
            />
          </div>
        ),
      },
      {
        key: 'yOption',
        label: 'Y 轴',
        children: <YOption />,
        extra: (
          <div onClick={handleClick}>
            <Switch
              checked={yAxisShowChecked}
              onChange={(checked) => handleToggleShow('yAxis', checked)}
            />
          </div>
        ),
      },
      {
        key: 'legend',
        label: '图例',
        children: <Legend />,
        extra: (
          <div onClick={handleClick}>
            <Switch
              checked={legendShowChecked}
              onChange={(checked) => handleToggleShow('legend', checked)}
            />
          </div>
        ),
      },
    ];
    if (defaultItems?.length) {
      allItems = items.filter((item) => defaultItems.includes(item.key as string));
    } else {
      allItems = items;
    }
    if (extraItems?.length) {
      allItems = allItems.concat(extraItems);
    }
    return allItems;
  }, [
    defaultItems,
    extraItems,
    xAxisShowChecked,
    yAxisShowChecked,
    legendShowChecked,
    handleToggleShow,
    handleClick,
  ]);
  return (
    <div className="w-full h-full">
      <PanelCommon />
      <Collapse items={items} bordered={false} />
      {children}
    </div>
  );
});

GlobalPanel.displayName = 'GlobalPanel';

export default GlobalPanel;
