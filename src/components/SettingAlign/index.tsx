import { memo } from 'react';
import { Button, Tooltip } from 'antd';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';

export type AlignDirection =
  | 'top'
  | 'vertical-center'
  | 'bottom'
  | 'left'
  | 'horizontal-center'
  | 'right';

interface SettingAlignProps {
  containerWidth: number;
  containerHeight: number;
  targetWidth: number;
  targetHeight: number;
  onChange?: (next: { top?: number; left?: number }) => void;
  disabled?: boolean;
}

const SettingAlign = memo((props: SettingAlignProps) => {
  const {
    containerWidth,
    containerHeight,
    targetWidth,
    targetHeight,
    onChange,
    disabled = false,
  } = props;

  const handleAlignTop = useMemoizedFn(() => onChange?.({ top: 0 }));
  const handleAlignMiddle = useMemoizedFn(() =>
    onChange?.({ top: Math.round((containerHeight - targetHeight) / 2) }),
  );
  const handleAlignBottom = useMemoizedFn(() =>
    onChange?.({ top: containerHeight - targetHeight }),
  );
  const handleAlignLeft = useMemoizedFn(() => onChange?.({ left: 0 }));
  const handleAlignCenter = useMemoizedFn(() =>
    onChange?.({ left: Math.round((containerWidth - targetWidth) / 2) }),
  );
  const handleAlignRight = useMemoizedFn(() => onChange?.({ left: containerWidth - targetWidth }));

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <Tooltip title="顶部对齐">
        <Button icon={<VerticalAlignTopOutlined />} onClick={handleAlignTop} disabled={disabled} />
      </Tooltip>
      <Tooltip title="垂直居中对齐">
        <Button
          icon={<VerticalAlignMiddleOutlined />}
          onClick={handleAlignMiddle}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="底部对齐">
        <Button
          icon={<VerticalAlignBottomOutlined />}
          onClick={handleAlignBottom}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="左对齐">
        <Button icon={<AlignLeftOutlined />} onClick={handleAlignLeft} disabled={disabled} />
      </Tooltip>
      <Tooltip title="水平居中对齐">
        <Button icon={<AlignCenterOutlined />} onClick={handleAlignCenter} disabled={disabled} />
      </Tooltip>
      <Tooltip title="右对齐">
        <Button icon={<AlignRightOutlined />} onClick={handleAlignRight} disabled={disabled} />
      </Tooltip>
    </div>
  );
});

SettingAlign.displayName = 'SettingAlign';

export default SettingAlign;
