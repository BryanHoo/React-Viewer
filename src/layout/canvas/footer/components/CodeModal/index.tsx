import JsonFormEditor from '@/components/JsonFormEditor';
import { Button, Drawer, App } from 'antd';
import { memo, type FC, useMemo } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useShallow } from 'zustand/shallow';
import { getIdsOrderedByZIndexDesc } from '@/utils';
import { useMemoizedFn } from 'ahooks';

interface CodeModalProps {
  open: boolean;
  onCancel: () => void;
}

const CodeModal: FC<CodeModalProps> = memo((props) => {
  const { open, onCancel } = props;
  const { message } = App.useApp();

  const global = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      scale: state.scale,
      scaleLock: state.scaleLock,
      backgroundImage: state.backgroundImage,
      backgroundColor: state.backgroundColor,
      backgroundFit: state.backgroundFit,
      echartsRenderer: state.echartsRenderer,
      themeColor: state.themeColor,
    })),
  );

  const { componentMap } = useCanvasStore(
    useShallow((state) => ({ componentMap: state.componentMap })),
  );

  const sourceData = useMemo(() => {
    const orderedIds = getIdsOrderedByZIndexDesc(componentMap);
    const componentList = orderedIds.map((id) => componentMap.get(id)).filter((item) => !!item);

    return {
      global,
      componentList,
    };
  }, [componentMap, global]);

  const handleCopy = useMemoizedFn(() => {
    void navigator.clipboard.writeText(JSON.stringify(sourceData, null, 2));
    message.success('复制成功');
  });

  return (
    <Drawer
      open={open}
      onClose={onCancel}
      footer={null}
      title="源代码"
      width={500}
      extra={<Button onClick={handleCopy}>复制</Button>}
    >
      <JsonFormEditor value={sourceData} viewOnly className="h-full" />
    </Drawer>
  );
});

CodeModal.displayName = 'CodeModal';

export default CodeModal;
