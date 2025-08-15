import CustomSegmented from '@/components/CustomSegmented';
import { useCanvasStore } from '@/store/canvasStore';
import { useGlobalStore } from '@/store/globalStore';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { memo, useEffect, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';

interface RenderProps {
  selectedId: string;
}

interface RenderForm {
  globalRenderType: 'svg' | 'canvas';
  componentRenderType: 'svg' | 'canvas' | 'inherit';
}

const Render: FC<RenderProps> = memo(({ selectedId }) => {
  const [form] = Form.useForm<RenderForm>();
  const { echartsRenderer, setEchartsRenderer } = useGlobalStore(
    useShallow((state) => ({
      echartsRenderer: state.echartsRenderer,
      setEchartsRenderer: state.setEchartsRenderer,
    })),
  );
  const { componentList, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      componentList: state.componentList,
      updateComponentById: state.updateComponentById,
    })),
  );

  const config = useMemo(() => componentList.get(selectedId), [componentList, selectedId]);

  const handleValuesChange = useMemoizedFn((changedFields: RenderForm) => {
    if (changedFields.globalRenderType) {
      setEchartsRenderer(changedFields.globalRenderType);
    }
    if (changedFields.componentRenderType) {
      updateComponentById(selectedId, { renderer: changedFields.componentRenderType });
    }
  });

  useEffect(() => {
    form.setFieldsValue({
      globalRenderType: echartsRenderer,
      componentRenderType: config?.renderer || 'inherit',
    });
  }, [echartsRenderer, form, config?.renderer]);

  return (
    <Form colon={false} onValuesChange={handleValuesChange} form={form}>
      <Form.Item
        label="全局渲染器"
        name="globalRenderType"
        tooltip="所有echarts图表组件默认都将采用所选的渲染器进行渲染"
      >
        <CustomSegmented
          options={[
            { label: 'svg', value: 'svg' },
            { label: 'canvas', value: 'canvas' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="组件渲染器"
        name="componentRenderType"
        tooltip="组件渲染器将覆盖全局渲染器，inherit 表示继承全局渲染器"
      >
        <CustomSegmented
          options={[
            { label: 'svg', value: 'svg' },
            { label: 'canvas', value: 'canvas' },
            { label: 'inherit', value: 'inherit' },
          ]}
        />
      </Form.Item>
    </Form>
  );
});

Render.displayName = 'Render';

export default Render;
