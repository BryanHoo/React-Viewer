import { ColorPicker, type ColorPickerProps } from 'antd';
import { memo, type FC } from 'react';

interface CustomColorPickerProps
  extends Omit<
    ColorPickerProps,
    'value' | 'defaultValue' | 'onChange' | 'onChangeComplete' | 'format'
  > {
  value?: string;
  defaultValue?: string;
  onChange?: (hex?: string) => void;
}

const CustomColorPicker: FC<CustomColorPickerProps> = memo((props) => {
  const { value, defaultValue, onChange, ...rest } = props;

  return (
    <ColorPicker
      value={value}
      defaultValue={defaultValue}
      format="hex"
      onChange={(_, css) => onChange?.(css)}
      onClear={() => onChange?.(undefined)}
      {...rest}
    />
  );
});

CustomColorPicker.displayName = 'CustomColorPicker';

export default CustomColorPicker;
