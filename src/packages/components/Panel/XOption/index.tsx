import { Form, Input, InputNumber, Select, Switch } from 'antd';
import type { FormProps } from 'antd';
import type { XAXisOption } from 'echarts/types/dist/shared';
import { memo, useEffect, useMemo, type FC } from 'react';
import FormRow from '@/components/FormRow';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { merge } from 'lodash-es';
import type { MaterielCanvasItem } from '@/types/materielType';
import CustomColorPicker from '@/components/CustomColorPicker';

interface XOptionProps {
  config?: MaterielCanvasItem;
  id: string;
}

const XOption: FC<XOptionProps> = memo((props) => {
  const { id } = props;
  const [form] = Form.useForm<XAXisOption>();
  const { componentMap, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      componentMap: state.componentMap,
      updateComponentById: state.updateComponentById,
    })),
  );

  const currentXAxis = useMemo(() => {
    if (!id) return undefined;
    const cfg = componentMap.get(id);
    const x = cfg?.option?.xAxis;
    if (!x) return undefined;
    return Array.isArray(x) ? x[0] : x;
  }, [componentMap, id]);

  useEffect(() => {
    if (currentXAxis) {
      form.setFieldsValue(currentXAxis);
    } else {
      form.resetFields();
    }
  }, [currentXAxis, form]);

  const handleValuesChange: FormProps<XAXisOption>['onValuesChange'] = (
    _changedValues,
    allValues,
  ) => {
    if (!id) return;
    const cfg = componentMap.get(id);
    const prevOption = cfg?.option ?? {};
    const xAxisValue = prevOption.xAxis;
    const rawPrevXAxis = Array.isArray(xAxisValue) ? xAxisValue[0] : xAxisValue;

    const nextXAxis = merge({}, rawPrevXAxis ?? {}, allValues);

    updateComponentById(id, { option: { ...prevOption, xAxis: nextXAxis } });
  };

  return (
    <Form colon={false} labelCol={{ span: 7 }} form={form} onValuesChange={handleValuesChange}>
      <p className="text-sm text-gray-400">单位</p>
      <FormRow>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name={['nameTextStyle', 'color']} label="颜色">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
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
        <Form.Item name={['axisLabel', 'color']} label="颜色">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
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
        <Form.Item name={['axisLine', 'lineStyle', 'color']} label="颜色" initialValue="#333">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name={['axisLine', 'lineStyle', 'width']} label="粗细" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="position" label="位置">
          <Select
            options={[
              { label: '顶部', value: 'top' },
              { label: '底部', value: 'bottom' },
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
        <Form.Item name={['axisTick', 'lineStyle', 'color']} label="颜色">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <p className="text-sm text-gray-400">分割线</p>
      <FormRow>
        <Form.Item name={['splitLine', 'show']} label="展示" initialValue={true}>
          <Switch></Switch>
        </Form.Item>
        <Form.Item name={['splitLine', 'lineStyle', 'color']} label="颜色" initialValue="#ccc">
          <CustomColorPicker allowClear showText style={{ width: '100%' }} />
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

XOption.displayName = 'XOption';

export default XOption;
