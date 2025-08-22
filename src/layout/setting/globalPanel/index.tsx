import { memo, type FC } from 'react';
import CustomSegmented from '@/components/CustomSegmented';
import { Form, InputNumber, Upload } from 'antd';
import CustomColorPicker from '@/components/CustomColorPicker';
import { PictureOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn, useMount } from 'ahooks';
import ThemeColorSelector from '@/components/ThemeColorSelector';
import type { ChartColorsNameType } from '@/components/ECharts/chartThemes';

const { Dragger } = Upload;

interface GlobalFormType {
  width?: number;
  height?: number;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundFit?: string;
  themeColor?: ChartColorsNameType;
}

const GlobalPanel: FC = memo(() => {
  const [form] = Form.useForm<GlobalFormType>();
  const {
    width,
    height,
    backgroundColor,
    backgroundFit,
    themeColor,
    setWidth,
    setHeight,
    setBackgroundImage,
    setBackgroundColor,
    setBackgroundFit,
    setThemeColor,
  } = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      backgroundColor: state.backgroundColor,
      backgroundFit: state.backgroundFit,
      themeColor: state.themeColor,
      setWidth: state.setWidth,
      setHeight: state.setHeight,
      setBackgroundImage: state.setBackgroundImage,
      setBackgroundColor: state.setBackgroundColor,
      setBackgroundFit: state.setBackgroundFit,
      setThemeColor: state.setThemeColor,
    })),
  );

  const handleFormChange = useMemoizedFn((_, allFields: GlobalFormType) => {
    setWidth(allFields?.width || width);
    setHeight(allFields?.height || height);
    if (typeof allFields?.backgroundColor !== 'undefined') {
      setBackgroundColor(allFields.backgroundColor || '#232324');
    }
    if (typeof allFields?.backgroundFit !== 'undefined') {
      const fit = (allFields.backgroundFit || 'auto') as 'auto' | 'width' | 'height' | 'cover';
      setBackgroundFit(fit);
    }
    if (typeof allFields?.themeColor !== 'undefined') {
      setThemeColor(allFields.themeColor);
    }
  });

  useMount(() => {
    form.setFieldsValue({
      width,
      height,
      backgroundColor,
      backgroundFit,
      themeColor,
    });
  });

  return (
    <div className="w-full h-full flex flex-col gap-[15px] overflow-y-auto">
      <CustomSegmented options={['页面配置']} block size="large" />
      <Form layout="horizontal" colon={false} form={form} onValuesChange={handleFormChange}>
        <div className="flex items-center gap-[15px] w-full justify-between">
          <Form.Item
            label="宽度"
            name="width"
            className="w-[50%]"
            required={false}
            rules={[{ required: true, message: '请输入宽度' }]}
          >
            <InputNumber style={{ width: '100%' }} min={100} max={10000} addonAfter="px" />
          </Form.Item>
          <Form.Item
            label="高度"
            name="height"
            className="w-[50%]"
            required={false}
            rules={[{ required: true, message: '请输入高度' }]}
          >
            <InputNumber style={{ width: '100%' }} min={100} max={10000} addonAfter="px" />
          </Form.Item>
        </div>
        <div className="flex items-center gap-[15px] w-full justify-between h-[150px] mb-[15px]">
          <Form.Item label="背景图" name="backgroundImage" noStyle className="w-full">
            <Dragger
              className="w-full h-full"
              accept="image/*"
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === 'string' ? reader.result : undefined;
                  setBackgroundImage(result);
                  form.setFieldValue('backgroundImage', result);
                };
                reader.readAsDataURL(file);
                return false;
              }}
              onRemove={() => {
                setBackgroundImage(undefined);
                form.setFieldValue('backgroundImage', undefined);
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="ant-upload-drag-icon">
                  <PictureOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持jpg/png/jpeg/gif文件，且不超过5MB</p>
              </div>
            </Dragger>
          </Form.Item>
        </div>
        <Form.Item label="背景颜色" name="backgroundColor" initialValue="#232324">
          <CustomColorPicker showText allowClear />
        </Form.Item>
        <Form.Item label="适配方式" name="backgroundFit">
          <CustomSegmented
            options={[
              { value: 'auto', label: '自适应' },
              { value: 'width', label: '宽度铺满' },
              { value: 'height', label: '高度铺满' },
              { value: 'cover', label: '拉伸铺满' },
            ]}
          />
        </Form.Item>
        <Form.Item name="themeColor">
          <ThemeColorSelector />
        </Form.Item>
      </Form>
    </div>
  );
});

GlobalPanel.displayName = 'GlobalPanel';

export default GlobalPanel;
