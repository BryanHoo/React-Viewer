import classNames from '@/utils/classname';
import { Button, ConfigProvider, Select, Slider } from 'antd';
import { memo, type FC, useState } from 'react';
import { Lock, Unlock } from '@icon-park/react';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';
import HistoryPopover from './components/HistoryPopover';
import CodeModal from './components/CodeModal';

interface FooterProps {
  handleScaleChange: () => void;
}

const Footer: FC<FooterProps> = memo(({ handleScaleChange: handleScaleChangeProps }) => {
  const { scale, setScale, scaleLock, setScaleLock } = useGlobalStore(
    useShallow((state) => ({
      scale: state.scale,
      setScale: state.setScale,
      scaleLock: state.scaleLock,
      setScaleLock: state.setScaleLock,
    })),
  );

  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const handleCodeModalOpen = useMemoizedFn(() => {
    setCodeModalOpen(true);
  });

  const handleCodeModalClose = useMemoizedFn(() => {
    setCodeModalOpen(false);
  });

  const handleScaleChange = useMemoizedFn((value: number | string) => {
    if (scaleLock) return;
    if (typeof value === 'string') {
      if (value === 'auto') {
        handleScaleChangeProps();
      }
    } else {
      setScale(value);
    }
  });

  const handleScaleLock = useMemoizedFn(() => {
    setScaleLock(!scaleLock);
  });

  return (
    <div
      className={classNames(
        'absolute bottom-0 left-[20px] w-[calc(100%-20px)] h-[40px] z-12 bg-[#232324] border-[#373739] border--[1px]',
        'flex items-center justify-between flex-nowrap px-[10px]',
      )}
    >
      <div className="flex items-center flex-nowrap gap-[8px]">
        <HistoryPopover placement="top" />
        <Button type="text" onClick={handleCodeModalOpen}>
          源代码
        </Button>
      </div>
      <div className="flex items-center justify-between flex-nowrap gap-[10px] pr-[10px]">
        <Button
          icon={scaleLock ? <Lock theme="outline" /> : <Unlock theme="outline" />}
          type="text"
          onClick={handleScaleLock}
        />
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                trackBg: '#51d6a9',
                handleColor: '#51d6a9',
                trackHoverBg: '#51d6a9',
              },
            },
          }}
        >
          <Slider
            value={scale}
            className="w-[100px]"
            tooltip={{ formatter: (value) => `${value}%` }}
            min={1}
            max={200}
            onChange={handleScaleChange}
            disabled={scaleLock}
          />
        </ConfigProvider>
        <Select
          value={`${scale}%`}
          className="w-[80px]"
          onChange={handleScaleChange}
          disabled={scaleLock}
          options={[
            { value: 150, label: '150%' },
            { value: 100, label: '100%' },
            { value: 50, label: '50%' },
            { value: 'auto', label: '自适应' },
          ]}
        />
      </div>

      <CodeModal open={codeModalOpen} onCancel={handleCodeModalClose} />
    </div>
  );
});

Footer.displayName = 'Footer';

export default Footer;
