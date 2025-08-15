import { Form, InputNumber, Select } from 'antd';
import { memo, useEffect, useMemo, useState, type FC } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import useComponent from '@/hooks/useComponent';
import { useMemoizedFn } from 'ahooks';
import { normalize, toCss } from '@/utils';
import type { MaterielCanvasItem } from '@/types/materielType';

interface ContainerFormValues {
  paddingTop?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
}

const Container: FC = memo(() => {
  const [form] = Form.useForm<ContainerFormValues>();
  const { selectedId, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      updateComponentById: state.updateComponentById,
    })),
  );
  const { config } = useComponent({ id: selectedId });

  const [unit, setUnit] = useState<'px' | '%'>('px');

  const selectAfter = useMemo(
    () => (
      <Select
        value={unit}
        onChange={setUnit}
        style={{ width: 50 }}
        options={[
          { label: 'px', value: 'px' },
          { label: '%', value: '%' },
        ]}
      />
    ),
    [unit],
  );

  useEffect(() => {
    if (!config) return;
    const paddings = [
      config.paddingTop,
      config.paddingRight,
      config.paddingBottom,
      config.paddingLeft,
    ];
    const firstWithUnit = paddings.find((v) => typeof v === 'string' && v.trim().length > 0);
    if (firstWithUnit?.includes('%')) setUnit('%');
    else setUnit('px');

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
      const top = toCss(normalize(all.paddingTop), unit);
      const right = toCss(normalize(all.paddingRight), unit);
      const bottom = toCss(normalize(all.paddingBottom), unit);
      const left = toCss(normalize(all.paddingLeft), unit);

      // 始终显式写入，允许通过 undefined 清除样式
      next.paddingTop = top;
      next.paddingRight = right;
      next.paddingBottom = bottom;
      next.paddingLeft = left;

      updateComponentById(selectedId, next);
    },
  );

  return (
    <Form colon={false} onValuesChange={handleValuesChange} form={form}>
      <Form.Item noStyle>
        <div className="flex items-center justify-between gap-2 w-full">
          <Form.Item name="paddingTop" label="上边距" getValueFromEvent={normalize}>
            <InputNumber className="w-full" addonAfter={selectAfter} min={0} />
          </Form.Item>
          <Form.Item name="paddingBottom" label="下边距" getValueFromEvent={normalize}>
            <InputNumber className="w-full" addonAfter={selectAfter} min={0} />
          </Form.Item>
        </div>
        <div className="flex items-center justify-between gap-2 w-full">
          <Form.Item name="paddingLeft" label="左边距" getValueFromEvent={normalize}>
            <InputNumber className="w-full" addonAfter={selectAfter} min={0} />
          </Form.Item>
          <Form.Item name="paddingRight" label="右边距" getValueFromEvent={normalize}>
            <InputNumber className="w-full" addonAfter={selectAfter} min={0} />
          </Form.Item>
        </div>
      </Form.Item>
    </Form>
  );
});

Container.displayName = 'Container';

export default Container;
