import CodeMirrorForm from '@/components/CodeMirrorForm';

import { Collapse, Form } from 'antd';
import { memo, useEffect, useMemo, type FC } from 'react';
import { eventConfig } from './config';
import { useMemoizedFn } from 'ahooks';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';

const Event: FC<AppPanelProps> = memo((props) => {
  const { config, id } = props;
  const { updateComponentById } = useCanvasStore(
    useShallow((state) => ({
      updateComponentById: state.updateComponentById,
    })),
  );

  const [form] = Form.useForm();

  const items = useMemo(() => {
    return eventConfig.map((item) => ({
      key: item.value,
      label: item.label,
      styles: {
        body: {
          padding: 0,
        },
      },
      children: (
        <Form.Item name={['event', item.value]}>
          <CodeMirrorForm height="160px" />
        </Form.Item>
      ),
    }));
  }, []);

  useEffect(() => {
    if (config?.event) {
      form.setFieldsValue({ event: config.event });
    }
  }, [config?.event, form, id]);

  const onValuesChange = useMemoizedFn((_, allFields) => {
    const nextEvent = allFields?.event;
    if (nextEvent !== undefined) {
      updateComponentById(id, {
        event: nextEvent,
      });
    }
  });

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <Collapse items={items} defaultActiveKey={['click']} />
    </Form>
  );
});

Event.displayName = 'Event';

export default Event;
