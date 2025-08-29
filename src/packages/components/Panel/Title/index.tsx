import SettingAlign from '@/components/SettingAlign';
import { useCanvasStore } from '@/store/canvasStore';
import { useDebounceFn } from 'ahooks';
import { Form, Input, InputNumber } from 'antd';
import { memo, useEffect, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globalStore';
import { useMemoizedFn } from 'ahooks';
import FormRow from '@/components/FormRow';

interface PanelFormValues {
  title?: string;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

const Title: FC<AppPanelProps> = memo((props) => {
  const { config: selectedItem } = props;
  const [form] = Form.useForm<PanelFormValues>();
  const { updateComponentRectById, updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      componentMap: state.componentMap,
      updateComponentRectById: state.updateComponentRectById,
      updateComponentById: state.updateComponentById,
    })),
  );

  const { width: canvasWidth, height: canvasHeight } = useGlobalStore(
    useShallow((state) => ({ width: state.width, height: state.height })),
  );

  useEffect(() => {
    if (!selectedItem) return;
    form.setFieldsValue({
      title: selectedItem.title,
      width: selectedItem.width,
      height: selectedItem.height,
      top: selectedItem.top,
      left: selectedItem.left,
    });
  }, [form, selectedItem]);

  const { run: handleValuesChange } = useDebounceFn(
    (_: Partial<PanelFormValues>, allValues: PanelFormValues) => {
      if (!selectedItem) return;
      const { title, width, height, top, left } = allValues;
      // 更新标题等非矩形属性
      if (title !== selectedItem.title) {
        updateComponentById(selectedItem.id, { title });
      }
      // 更新矩形属性，使用受约束的方法
      const rectNext: { top?: number; left?: number; width?: number; height?: number } = {};
      if (typeof width === 'number' && width !== selectedItem.width) rectNext.width = width;
      if (typeof height === 'number' && height !== selectedItem.height) rectNext.height = height;
      if (typeof top === 'number' && top !== selectedItem.top) rectNext.top = top;
      if (typeof left === 'number' && left !== selectedItem.left) rectNext.left = left;
      if (Object.keys(rectNext).length > 0) {
        updateComponentRectById(selectedItem.id, rectNext);
      }
    },
    { wait: 1000 },
  );

  const handleAlignChange = useMemoizedFn((next: { top?: number; left?: number }) => {
    if (!selectedItem) return;
    updateComponentRectById(selectedItem.id, next);
    form.setFieldsValue({
      top: next.top ?? selectedItem.top,
      left: next.left ?? selectedItem.left,
    });
  });

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      labelAlign="left"
      colon={false}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="名称" name="title">
        <Input />
      </Form.Item>
      <Form.Item label="尺寸">
        <FormRow>
          <Form.Item name="width" noStyle>
            <InputNumber className="w-full" prefix="宽度" addonAfter="px" />
          </Form.Item>
          <Form.Item name="height" noStyle>
            <InputNumber className="w-full" prefix="高度" addonAfter="px" />
          </Form.Item>
        </FormRow>
      </Form.Item>
      <Form.Item label="位置">
        <FormRow>
          <Form.Item name="top" noStyle>
            <InputNumber className="w-full" prefix="上" addonAfter="px" />
          </Form.Item>
          <Form.Item name="left" noStyle>
            <InputNumber className="w-full" prefix="左" addonAfter="px" />
          </Form.Item>
        </FormRow>
      </Form.Item>
      <Form.Item label="对齐方式">
        <SettingAlign
          containerWidth={canvasWidth}
          containerHeight={canvasHeight}
          targetWidth={selectedItem?.width ?? 0}
          targetHeight={selectedItem?.height ?? 0}
          onChange={handleAlignChange}
        />
      </Form.Item>
    </Form>
  );
});

Title.displayName = 'Title';

export default Title;
