import FormRow from '@/components/FormRow';
import { ColorPicker, Form, InputNumber, Select, Switch } from 'antd';
import type { FC } from 'react';
import { memo, useEffect, useMemo } from 'react';
import { getHexColorFromEvent } from '@/utils/chart';
import type { PanelProps } from '@/types/materielType';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { merge } from 'lodash-es';
import { useMemoizedFn } from 'ahooks';

interface BarSeriesFormValues {
  barWidth?: number;
  itemStyle?: {
    borderRadius?: number | number[];
  };
  label?: {
    show?: boolean;
    fontSize?: number;
    color?: string;
    position?: string;
  };
}

const Bar: FC<PanelProps> = memo((props) => {
  const { id, index } = props;
  const [form] = Form.useForm<BarSeriesFormValues>();

  const { componentMap, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      componentMap: state.componentMap,
      updateComponentById: state.updateComponentById,
    })),
  );

  const currentSeries = useMemo(() => {
    if (!id) return undefined;
    const cfg = componentMap.get(id);
    const seriesValue = cfg?.option?.series as unknown;
    if (!seriesValue) return undefined;
    if (Array.isArray(seriesValue)) {
      if (typeof index === 'number' && index >= 0 && index < seriesValue.length) {
        return seriesValue[index] as BarSeriesFormValues | undefined;
      }
      return seriesValue[0] as BarSeriesFormValues | undefined;
    }
    return seriesValue as BarSeriesFormValues | undefined;
  }, [componentMap, id, index]);

  useEffect(() => {
    if (!currentSeries) {
      form.resetFields();
      return;
    }
    const borderRadius = currentSeries?.itemStyle?.borderRadius;
    const normalizedBorderRadius = Array.isArray(borderRadius) ? borderRadius[0] : borderRadius;

    form.setFieldsValue({
      barWidth: currentSeries.barWidth,
      itemStyle: {
        borderRadius: normalizedBorderRadius,
      },
      label: {
        show: currentSeries.label?.show,
        fontSize: currentSeries.label?.fontSize,
        color:
          typeof currentSeries.label?.color === 'string' ? currentSeries.label?.color : undefined,
        position: currentSeries.label?.position,
      },
    });
  }, [currentSeries, form]);

  const handleValuesChange = useMemoizedFn(
    (_: Partial<BarSeriesFormValues>, allValues: BarSeriesFormValues) => {
      if (!id) return;
      const cfg = componentMap.get(id);
      const prevOption = cfg?.option ?? {};
      const prevSeries = prevOption.series as unknown;

      const nextPartial: BarSeriesFormValues = merge({}, allValues);

      if (Array.isArray(prevSeries)) {
        const targetIndex = typeof index === 'number' && index >= 0 ? index : 0;
        const nextSeriesArray = [...prevSeries];
        const prevTarget = (nextSeriesArray[targetIndex] ?? {}) as Record<string, unknown>;
        nextSeriesArray[targetIndex] = merge({}, prevTarget, nextPartial);
        updateComponentById(id, { option: { ...prevOption, series: nextSeriesArray } });
        return;
      }

      const nextSeriesObj = merge({}, (prevSeries ?? {}) as Record<string, unknown>, nextPartial);
      updateComponentById(id, { option: { ...prevOption, series: nextSeriesObj } });
    },
  );

  return (
    <Form colon={false} form={form} onValuesChange={handleValuesChange}>
      <FormRow>
        <Form.Item label="宽度" name="barWidth">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="圆角" name={['itemStyle', 'borderRadius']} initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">标签</p>
      <FormRow>
        <Form.Item label="展示" name={['label', 'show']} initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="大小" name={['label', 'fontSize']} initialValue={12}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item
          label="颜色"
          name={['label', 'color']}
          initialValue="#fff"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="位置" name={['label', 'position']} initialValue="inside">
          <Select
            options={[
              { label: '居上', value: 'top' },
              { label: '居左', value: 'left' },
              { label: '居右', value: 'right' },
              { label: '居下', value: 'bottom' },
              { label: '内部', value: 'inside' },
              { label: '内部居左', value: 'insideLeft' },
              { label: '内部居右', value: 'insideRight' },
              { label: '内部居上', value: 'insideTop' },
              { label: '内部居下', value: 'insideBottom' },
              { label: '内部居左上', value: 'insideTopLeft' },
              { label: '内部居左下', value: 'insideBottomLeft' },
              { label: '内部居右上', value: 'insideTopRight' },
              { label: '内部居右下', value: 'insideBottomRight' },
            ]}
          />
        </Form.Item>
      </FormRow>
    </Form>
  );
});

Bar.displayName = 'Bar';

export default Bar;
