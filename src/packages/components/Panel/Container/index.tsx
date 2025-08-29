import { Form, InputNumber, Select } from 'antd';
import { memo, useEffect, useState, type FC } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';
import { normalize, toCss, inferUnitFromValue } from '@/utils';
import FormRow from '@/components/FormRow';

interface ContainerFormValues {
  paddingTop?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
}

type PaddingKey = 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight';

const Container: FC<AppPanelProps> = memo((props) => {
  const { config, id } = props;
  const [form] = Form.useForm<ContainerFormValues>();
  const { updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      updateComponentById: state.updateComponentById,
    })),
  );

  const [unitMap, setUnitMap] = useState<Record<PaddingKey, AppCssUnit>>({
    paddingTop: 'px',
    paddingRight: 'px',
    paddingBottom: 'px',
    paddingLeft: 'px',
  });

  useEffect(() => {
    if (!config) return;
    setUnitMap({
      paddingTop: inferUnitFromValue(config.paddingTop),
      paddingRight: inferUnitFromValue(config.paddingRight),
      paddingBottom: inferUnitFromValue(config.paddingBottom),
      paddingLeft: inferUnitFromValue(config.paddingLeft),
    });

    form.setFieldsValue({
      paddingTop: typeof config.paddingTop === 'string' ? parseFloat(config.paddingTop) : undefined,
      paddingRight:
        typeof config.paddingRight === 'string' ? parseFloat(config.paddingRight) : undefined,
      paddingBottom:
        typeof config.paddingBottom === 'string' ? parseFloat(config.paddingBottom) : undefined,
      paddingLeft:
        typeof config.paddingLeft === 'string' ? parseFloat(config.paddingLeft) : undefined,
    });
  }, [config, form]);

  const handleValuesChange = useMemoizedFn(
    (_: Partial<ContainerFormValues>, all: ContainerFormValues) => {
      if (!id) return;

      const next: Partial<AppMaterielCanvasItem> = {};
      const top = toCss(normalize(all.paddingTop), unitMap.paddingTop);
      const right = toCss(normalize(all.paddingRight), unitMap.paddingRight);
      const bottom = toCss(normalize(all.paddingBottom), unitMap.paddingBottom);
      const left = toCss(normalize(all.paddingLeft), unitMap.paddingLeft);

      next.paddingTop = top;
      next.paddingRight = right;
      next.paddingBottom = bottom;
      next.paddingLeft = left;

      updateComponentById(id, next);
    },
  );

  const handleUnitChange = useMemoizedFn((nextUnit: AppCssUnit, key: PaddingKey) => {
    if (!id) return;
    setUnitMap((prev) => ({ ...prev, [key]: nextUnit }));
    const value = form.getFieldValue(key) as number | undefined;
    if (value === undefined) return;
    const css = toCss(normalize(value), nextUnit);
    updateComponentById(id, { [key]: css });
  });

  const select = useMemoizedFn((key: PaddingKey) => {
    return (
      <Select
        value={unitMap[key]}
        onChange={(value) => handleUnitChange(value as AppCssUnit, key)}
        style={{ width: 50 }}
        options={[
          { label: 'px', value: 'px' },
          { label: '%', value: '%' },
        ]}
      />
    );
  });

  return (
    <Form colon={false} onValuesChange={handleValuesChange} form={form}>
      <FormRow>
        <Form.Item name="paddingTop" label="上边距" getValueFromEvent={normalize}>
          <InputNumber className="w-full" addonAfter={select('paddingTop')} min={0} />
        </Form.Item>
        <Form.Item name="paddingBottom" label="下边距" getValueFromEvent={normalize}>
          <InputNumber className="w-full" addonAfter={select('paddingBottom')} min={0} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item name="paddingLeft" label="左边距" getValueFromEvent={normalize}>
          <InputNumber className="w-full" addonAfter={select('paddingLeft')} min={0} />
        </Form.Item>
        <Form.Item name="paddingRight" label="右边距" getValueFromEvent={normalize}>
          <InputNumber className="w-full" addonAfter={select('paddingRight')} min={0} />
        </Form.Item>
      </FormRow>
    </Form>
  );
});

Container.displayName = 'Container';

export default Container;
