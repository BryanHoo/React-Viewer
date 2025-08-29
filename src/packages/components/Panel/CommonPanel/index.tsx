import Container from '@/packages/components/Panel/Container';
import Legend from '@/packages/components/Panel/Legend';
import Render from '@/packages/components/Panel/Render';
import AxisOption from '@/packages/components/Panel/AxisOption';
import { useCanvasStore } from '@/store/canvasStore';
import { Collapse, Switch, type CollapseProps } from 'antd';
import { memo, useMemo, type FC } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import { readShowFlag, updateOptionShowFlag } from '@/utils/chart';
import Title from '../Title';
import { isArray } from 'lodash-es';
import TypeItem from '../TypeItem';
import { typeItemConfig } from '../TypeItem/config';

interface CommonPanelProps extends AppPanelProps {
  children?: React.ReactNode;
  // 默认项启用的面板
  defaultItems?: string[];
  // 额外渲染的面板
  extraItems?: CollapseProps['items'];
  // 默认展开的面板
  defaultActiveKey?: string[];
}

const CommonPanel: FC<CommonPanelProps> = memo(
  ({ children, defaultItems, extraItems, config, id, defaultActiveKey }) => {
    const { updateComponentById } = useCanvasStore(
      useShallow((state) => ({
        updateComponentById: state.updateComponentById,
      })),
    );

    const handleToggleShow = useMemoizedFn((key: AppOptionKey, checked: boolean) => {
      if (!id) return;
      const prevOption = config?.option ?? {};
      const nextOption = updateOptionShowFlag(prevOption, key, checked);
      updateComponentById(id, { option: nextOption });
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

    const seriesItems = useMemo(() => {
      if (!isArray(config?.option?.series)) {
        const type = config?.option?.series?.type as keyof typeof typeItemConfig;
        const itemKey = `${type}-${id}`;
        return [
          TypeItem({
            itemKey,
            type,
            label: typeItemConfig[type]?.label,
            allowSwitch: false,
            config,
            id,
          }),
        ];
      }
      return config?.option?.series?.map((item, index) => {
        const type = item?.type as keyof typeof typeItemConfig;
        return TypeItem({
          itemKey: `${type}-${index}`,
          type,
          label: `${typeItemConfig[type]?.label}-${index + 1}`,
          allowSwitch: false,
          config,
          id,
          index,
        });
      });
    }, [id, config]);

    const items: CollapseProps['items'] = useMemo(() => {
      let allItems: CollapseProps['items'] = [];
      const items: CollapseProps['items'] = [
        {
          key: 'render',
          label: '渲染器',
          children: <Render config={config} id={id} />,
        },
        {
          key: 'container',
          label: '容器',
          children: <Container config={config} id={id} />,
        },
        {
          key: 'xOption',
          label: 'X 轴',
          children: <AxisOption axis="x" id={id} />,
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
          children: <AxisOption axis="y" config={config} id={id} />,
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
          children: <Legend config={config} id={id} />,
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
      if (seriesItems?.length) {
        allItems = allItems.concat(seriesItems);
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
      config,
      id,
      seriesItems,
    ]);
    return (
      <div className="w-full h-full">
        <Title id={id} config={config} />
        <Collapse items={items} bordered={false} defaultActiveKey={defaultActiveKey} />
        {children}
      </div>
    );
  },
);

CommonPanel.displayName = 'CommonPanel';

export default CommonPanel;
