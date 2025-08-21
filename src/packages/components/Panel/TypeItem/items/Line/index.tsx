import FormRow from '@/components/FormRow';
import type { PanelProps } from '@/types/materielType';
import { Form, InputNumber, Select, Switch } from 'antd';
import { memo, type FC, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { merge } from 'lodash-es';
import { useMemoizedFn } from 'ahooks';
import Label from '../../components/Label';
import type { EChartsOption } from 'echarts';

interface LineSeriesFormValues {
  lineStyle?: {
    width?: number;
    type?: 'solid' | 'dashed' | 'dotted';
  };
  smooth?: boolean;
  symbolSize?: number;
  label?: {
    show?: boolean;
    fontSize?: number;
    color?: string;
    position?: string;
  };
}

const Line: FC<PanelProps> = memo((props) => {
  const { id, index } = props;
  const [form] = Form.useForm<LineSeriesFormValues>();

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
        return seriesValue[index] as LineSeriesFormValues | undefined;
      }
      return seriesValue[0] as LineSeriesFormValues | undefined;
    }
    return seriesValue as LineSeriesFormValues | undefined;
  }, [componentMap, id, index]);

  useEffect(() => {
    if (!currentSeries) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      lineStyle: {
        width: currentSeries.lineStyle?.width,
        type: currentSeries.lineStyle?.type,
      },
      smooth: currentSeries.smooth,
      symbolSize: currentSeries.symbolSize,
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
    (_: Partial<LineSeriesFormValues>, allValues: LineSeriesFormValues) => {
      if (!id) return;
      const cfg = componentMap.get(id);
      const prevOption = cfg?.option ?? {};
      const prevSeries = prevOption.series as unknown;

      const nextPartial: LineSeriesFormValues = merge({}, allValues);

      if (Array.isArray(prevSeries)) {
        const targetIndex = typeof index === 'number' && index >= 0 ? index : 0;
        const nextSeriesArray = [...prevSeries];
        const prevTarget = (nextSeriesArray[targetIndex] ?? {}) as Record<string, unknown>;
        nextSeriesArray[targetIndex] = merge({}, prevTarget, nextPartial);
        updateComponentById(id, {
          option: { ...prevOption, series: nextSeriesArray as EChartsOption['series'] },
        });
        return;
      }

      const nextSeriesObj = merge({}, (prevSeries ?? {}) as Record<string, unknown>, nextPartial);
      updateComponentById(id, {
        option: { ...prevOption, series: nextSeriesObj as EChartsOption['series'] },
      });
    },
  );

  return (
    <Form colon={false} labelCol={{ span: 7 }} form={form} onValuesChange={handleValuesChange}>
      <FormRow>
        <Form.Item label="宽度" name={['lineStyle', 'width']} initialValue={2}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="类型" name={['lineStyle', 'type']} initialValue="solid">
          <Select
            options={[
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
            ]}
          />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item label="曲线" name="smooth" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item label="点大小" name="symbolSize" initialValue={4}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <Label />
    </Form>
  );
});

Line.displayName = 'Line';

export default Line;
