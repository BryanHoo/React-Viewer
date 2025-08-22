import type { EChartsOption } from 'echarts';
import { useCanvasStore } from '@/store/canvasStore';
import { useMemoizedFn } from 'ahooks';
import { Form, InputNumber, Select } from 'antd';
import { memo, useEffect, useState, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { inferUnitFromValue, toEchartsLength, type CssUnit } from '@/utils';
import type { LegendOption } from 'echarts/types/src/component/legend/LegendModel.js';
import FormRow from '@/components/FormRow';
import type { PanelProps } from '@/types/materielType';
import CustomColorPicker from '@/components/CustomColorPicker';

const Legend: FC<PanelProps> = memo((props) => {
  const { config, id } = props;
  const [form] = Form.useForm<LegendOption>();
  const [unitMap, setUnitMap] = useState<Record<'width' | 'height', CssUnit>>({
    width: 'px',
    height: 'px',
  });

  const { updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      updateComponentById: state.updateComponentById,
    })),
  );

  useEffect(() => {
    const legend = config?.option?.legend as LegendOption | undefined;
    if (!legend) return;

    setUnitMap({
      width: inferUnitFromValue(legend.width),
      height: inferUnitFromValue(legend.height),
    });

    const widthValue = typeof legend.width === 'string' ? parseFloat(legend.width) : legend.width;
    const heightValue =
      typeof legend.height === 'string' ? parseFloat(legend.height) : legend.height;

    form.setFieldsValue({
      width: widthValue,
      height: heightValue,
      top: legend.top,
      left: legend.left,
      orient: legend.orient,
      icon: legend.icon,
      textStyle: {
        color: legend.textStyle?.color,
        fontSize: legend.textStyle?.fontSize,
      },
    });
  }, [config?.option?.legend, form]);

  const writeLegendToStore = useMemoizedFn((allValues: LegendOption) => {
    if (!id) return;
    const legendNext: LegendOption = {};

    // width / height
    legendNext.width = toEchartsLength(allValues.width as number, unitMap.width);
    legendNext.height = toEchartsLength(allValues.height as number, unitMap.height);

    // placement / layout
    if (allValues.left) legendNext.left = allValues.left;
    if (allValues.top) legendNext.top = allValues.top;
    if (allValues.orient) legendNext.orient = allValues.orient;
    if (allValues.icon) legendNext.icon = allValues.icon;

    // textStyle
    const colorString =
      typeof allValues.textStyle?.color === 'string' ? allValues.textStyle?.color : undefined;
    const fontSizeRaw = allValues.textStyle?.fontSize;
    legendNext.textStyle = {
      ...(colorString ? { color: colorString } : {}),
      ...(typeof fontSizeRaw === 'number' ? { fontSize: fontSizeRaw } : {}),
    };

    const currentOption = (config?.option ?? {}) as Record<string, unknown>;
    const currentLegend = (currentOption.legend ?? {}) as Record<string, unknown>;
    const currentLegendTextStyle = (currentLegend.textStyle ?? {}) as Record<string, unknown>;

    const mergedLegend = {
      ...currentLegend,
      ...legendNext,
      textStyle: { ...currentLegendTextStyle, ...(legendNext.textStyle ?? {}) },
    } as Record<string, unknown>;

    updateComponentById(id, {
      option: { ...currentOption, legend: mergedLegend } as EChartsOption,
    });
  });

  const select = useMemoizedFn((key: 'width' | 'height') => {
    return (
      <Select
        value={unitMap[key]}
        onChange={(value) => handleUnitChange(value as CssUnit, key)}
        style={{ width: 50 }}
        options={[
          { label: 'px', value: 'px' },
          { label: '%', value: '%' },
        ]}
      />
    );
  });

  const handleValuesChange = useMemoizedFn((_: Partial<LegendOption>, allValues: LegendOption) => {
    writeLegendToStore(allValues);
  });

  const handleUnitChange = useMemoizedFn((nextUnit: CssUnit, key: 'width' | 'height') => {
    setUnitMap((prev) => ({ ...prev, [key]: nextUnit }));
    const value = form.getFieldValue(key) as number | undefined;
    if (value === undefined) return;
    // 仅写入该字段对应的单位变化
    const allValues = form.getFieldsValue(true) as LegendOption;
    writeLegendToStore({ ...allValues, [key]: value });
  });

  return (
    <Form colon={false} form={form} onValuesChange={handleValuesChange}>
      <FormRow>
        <Form.Item name="width" label="宽度">
          <InputNumber min={1} addonAfter={select('width')} />
        </Form.Item>
        <Form.Item name="height" label="高度">
          <InputNumber min={1} addonAfter={select('height')} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['textStyle', 'color']} label="颜色">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name={['textStyle', 'fontSize']} label="大小">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name="left" label="水平位置" initialValue="auto">
          <Select
            options={[
              { label: '自动', value: 'auto' },
              { label: '居左', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '居右', value: 'right' },
            ]}
          />
        </Form.Item>
        <Form.Item name="top" label="垂直位置" initialValue="auto">
          <Select
            options={[
              { label: '自动', value: 'auto' },
              { label: '居上', value: 'top' },
              { label: '居中', value: 'middle' },
              { label: '居下', value: 'bottom' },
            ]}
          />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name="orient" label="信息方向" initialValue="horizontal">
          <Select
            options={[
              { label: '水平', value: 'horizontal' },
              { label: '垂直', value: 'vertical' },
            ]}
          />
        </Form.Item>
        <Form.Item name="icon" label="信息形状">
          <Select
            options={[
              { label: '无', value: 'none' },
              { label: '圆形', value: 'circle' },
              { label: '方形', value: 'rect' },
              { label: '圆角方形', value: 'roundRect' },
              { label: '三角形', value: 'triangle' },
              { label: '钢笔形', value: 'pin' },
              { label: '箭头形', value: 'arrow' },
            ]}
          />
        </Form.Item>
      </FormRow>
    </Form>
  );
});

Legend.displayName = 'Legend';

export default Legend;
