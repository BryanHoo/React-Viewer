import { ColorPicker, Form, Input, InputNumber, Select, Switch } from 'antd';
import type { FormProps } from 'antd';
import type { YAXisOption } from 'echarts/types/dist/shared';
import { memo, useEffect, useMemo, type FC } from 'react';
import FormRow from '@/components/FormRow';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { merge } from 'lodash-es';
import type { MaterielCanvasItem } from '@/types/materielType';
import { getHexColorFromEvent } from '@/utils/chart';

interface YOptionProps {
  config?: MaterielCanvasItem;
  id: string;
}

const YOption: FC<YOptionProps> = memo((props) => {
  const { id } = props;
  const [form] = Form.useForm<YAXisOption>();
  const { componentMap, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      componentMap: state.componentMap,
      updateComponentById: state.updateComponentById,
    })),
  );

  const currentYAxis = useMemo(() => {
    if (!id) return undefined;
    const cfg = componentMap.get(id);
    const y = cfg?.option?.yAxis;
    if (!y) return undefined;
    return Array.isArray(y) ? y[0] : y;
  }, [componentMap, id]);

  useEffect(() => {
    if (currentYAxis) {
      form.setFieldsValue(currentYAxis);
    } else {
      form.resetFields();
    }
  }, [currentYAxis, form]);

  const handleValuesChange: FormProps<YAXisOption>['onValuesChange'] = (
    _changedValues,
    allValues,
  ) => {
    if (!id) return;
    const cfg = componentMap.get(id);
    const prevOption = cfg?.option ?? {};
    const yAxisValue = prevOption.yAxis as unknown;
    const rawPrevYAxis = Array.isArray(yAxisValue) ? yAxisValue[0] : yAxisValue;

    const nextYAxis = merge({}, rawPrevYAxis ?? {}, allValues);

    updateComponentById(id, { option: { ...prevOption, yAxis: nextYAxis } });
  };

  return (
    <Form colon={false} labelCol={{ span: 7 }} form={form} onValuesChange={handleValuesChange}>
      <p className="text-sm text-gray-400">单位</p>
      <FormRow>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item
          name={['nameTextStyle', 'color']}
          label="颜色"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['nameTextStyle', 'fontSize']} label="大小" initialValue={12}>
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="nameGap" label="偏移量" initialValue={15}>
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">标签</p>
      <FormRow>
        <Form.Item name={['axisLabel', 'show']} label="展示" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item
          name={['axisLabel', 'color']}
          label="颜色"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['axisLabel', 'fontSize']} label="大小" initialValue={12}>
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name={['axisLabel', 'rotate']} label="偏移量" initialValue={0}>
          <InputNumber min={-90} max={90} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">轴线</p>
      <FormRow>
        <Form.Item name={['axisLine', 'show']} label="展示" initialValue={true}>
          <Switch></Switch>
        </Form.Item>
        <Form.Item
          name={['axisLine', 'lineStyle', 'color']}
          label="颜色"
          initialValue="#333"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['axisLine', 'lineStyle', 'width']} label="粗细" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="position" label="位置">
          <Select
            options={[
              { label: '左侧', value: 'left' },
              { label: '右侧', value: 'right' },
            ]}
          />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['axisLine', 'onZero']} label="对齐零" initialValue={true}>
          <Switch></Switch>
        </Form.Item>
        <Form.Item name="inverse" label="反向">
          <Switch></Switch>
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">刻度</p>
      <FormRow>
        <Form.Item name={['axisTick', 'show']} label="展示" initialValue={true}>
          <Switch></Switch>
        </Form.Item>
        <Form.Item name={['axisTick', 'length']} label="长度" initialValue={5}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['axisTick', 'lineStyle', 'width']} label="粗细" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name={['axisTick', 'lineStyle', 'color']}
          label="颜色"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">分割线</p>
      <FormRow>
        <Form.Item name={['splitLine', 'show']} label="展示" initialValue={true}>
          <Switch></Switch>
        </Form.Item>
        <Form.Item
          name={['splitLine', 'lineStyle', 'color']}
          label="颜色"
          initialValue="#ccc"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['splitLine', 'lineStyle', 'width']} label="粗细" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name={['splitLine', 'lineStyle', 'type']} label="类型" initialValue="solid">
          <Select
            options={[
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
            ]}
          />
        </Form.Item>
      </FormRow>
    </Form>
  );
});

YOption.displayName = 'YOption';

export default YOption;
