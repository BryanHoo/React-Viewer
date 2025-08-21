import FormRow from '@/components/FormRow';
import { getHexColorFromEvent } from '@/utils/chart';
import { ColorPicker, Form, InputNumber, Select, Switch } from 'antd';
import { type FC, memo } from 'react';

const Label: FC = memo(() => {
  return (
    <>
      <p className="text-sm text-gray-400">标签</p>
      <FormRow>
        <Form.Item label="展示" name={['label', 'show']} initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="大小" name={['label', 'fontSize']} initialValue={12}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </FormRow>
      <FormRow>
        <Form.Item
          label="颜色"
          name={['label', 'color']}
          initialValue="#fff"
          getValueFromEvent={getHexColorFromEvent}
        >
          <ColorPicker allowClear showText format="hex" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="位置" name={['label', 'position']} initialValue="inside">
          <Select
            options={[
              { label: '居上', value: 'top' },
              { label: '居左', value: 'left' },
              { label: '居右', value: 'right' },
              { label: '居下', value: 'bottom' },
              { label: '内部', value: 'inside' },
              { label: '内部居左', value: 'insideLeft' },
              { label: '内部居右', value: 'insideRight' },
              { label: '内部居上', value: 'insideTop' },
              { label: '内部居下', value: 'insideBottom' },
              { label: '内部居左上', value: 'insideTopLeft' },
              { label: '内部居左下', value: 'insideBottomLeft' },
              { label: '内部居右上', value: 'insideTopRight' },
              { label: '内部居右下', value: 'insideBottomRight' },
            ]}
          />
        </Form.Item>
      </FormRow>
    </>
  );
});

Label.displayName = 'Label';

export default Label;
