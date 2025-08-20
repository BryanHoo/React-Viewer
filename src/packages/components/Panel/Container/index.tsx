import { Form, InputNumber, Select } from 'antd';
import { memo, useEffect, useState, type FC } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import useComponent from '@/hooks/useComponent';
import { useMemoizedFn } from 'ahooks';
import { normalize, toCss, inferUnitFromValue, type CssUnit } from '@/utils';
import type { MaterielCanvasItem } from '@/types/materielType';
import FormRow from '@/components/FormRow';

interface ContainerFormValues {
  paddingTop?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
}

type PaddingKey = 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight';

const Container: FC = memo(() => {
  const [form] = Form.useForm<ContainerFormValues>();
  const { selectedId, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      updateComponentById: state.updateComponentById,
    })),
  );
  const { config } = useComponent({ id: selectedId });

  const [unitMap, setUnitMap] = useState<Record<PaddingKey, CssUnit>>({
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
      if (!selectedId) return;

      const next: Partial<MaterielCanvasItem> = {};
      const top = toCss(normalize(all.paddingTop), unitMap.paddingTop);
      const right = toCss(normalize(all.paddingRight), unitMap.paddingRight);
      const bottom = toCss(normalize(all.paddingBottom), unitMap.paddingBottom);
      const left = toCss(normalize(all.paddingLeft), unitMap.paddingLeft);

      next.paddingTop = top;
      next.paddingRight = right;
      next.paddingBottom = bottom;
      next.paddingLeft = left;

      updateComponentById(selectedId, next);
    },
  );

  const handleUnitChange = useMemoizedFn((nextUnit: CssUnit, key: PaddingKey) => {
    if (!selectedId) return;
    setUnitMap((prev) => ({ ...prev, [key]: nextUnit }));
    const value = form.getFieldValue(key) as number | undefined;
    if (value === undefined) return;
    const css = toCss(normalize(value), nextUnit);
    updateComponentById(selectedId, { [key]: css });
  });

  const select = useMemoizedFn((key: PaddingKey) => {
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
