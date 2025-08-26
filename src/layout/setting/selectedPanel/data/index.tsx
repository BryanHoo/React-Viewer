import { Form, Select } from 'antd';
import { memo, useEffect, type FC } from 'react';
import JsonFormEditor from '@/components/JsonFormEditor';
import { useCanvasStore } from '@/store/canvasStore';
import { useDebounceFn } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import type { PanelProps } from '@/types/materielType';

const restrict = ({ key }: any) => {
  return key === 'dimensions' || key === 'source' || key === 'root';
};

// 限制删除：
// 1) 不允许删除 `dimensions`、`source`、`root` 这些集合节点本身
// 2) 对 `dimensions` 和 `source` 的子项，至少保留 1 个，若仅剩一个则禁止删除
const restrictDelete = ({ key, path, parentData }: any) => {
  if (key === 'dimensions' || key === 'source' || key === 'root') return true;

  const parentKey = Array.isArray(path) && path.length >= 2 ? path[path.length - 2] : undefined;
  if (parentKey === 'dimensions' || parentKey === 'source') {
    if (Array.isArray(parentData) && parentData.length <= 1) return true;
  }

  return false;
};

const defaultValue = ({ key }: any) => {
  return key === 'source' ? {} : null;
};

const SelectedPanelData: FC<PanelProps> = memo((props) => {
  const { config, id } = props;
  const [form] = Form.useForm();
  const { updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      updateComponentById: state.updateComponentById,
    })),
  );

  useEffect(() => {
    console.log('🚀 ~ config:', config);
    if (!config) return;
    form.setFieldsValue({
      apiType: config?.apiType ?? 'static',
      option: {
        dataset: config.option?.dataset ?? {},
      },
    });
  }, [form, config]);

  const { run: handleValuesChange } = useDebounceFn(
    (_: any, allValues: any) => {
      if (!config) return;
      const nextDataset = allValues?.option?.dataset;
      const prevOption = config.option ?? {};
      if (nextDataset !== undefined) {
        updateComponentById(id, {
          option: { ...prevOption, dataset: nextDataset },
        });
      }
    },
    { wait: 500 },
  );

  return (
    <Form form={form} onValuesChange={handleValuesChange} layout="vertical">
      <Form.Item label="请求方式" name="apiType" initialValue="static">
        <Select
          options={[
            { label: '静态数据', value: 'static' },
            { label: '公共接口', value: 'public' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="数据集"
        name={['option', 'dataset']}
        tooltip="请谨慎修改数据集，否则可能会导致页面异常"
      >
        <JsonFormEditor
          restrictEdit={restrict}
          restrictDelete={restrictDelete}
          restrictDrag={restrict}
          enableClipboard={false}
          defaultValue={defaultValue}
        />
      </Form.Item>
    </Form>
  );
});

SelectedPanelData.displayName = 'SelectedPanelData';

export default SelectedPanelData;
