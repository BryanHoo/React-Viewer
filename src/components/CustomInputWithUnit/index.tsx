import { memo, type FC, useMemo } from 'react';
import { InputNumber, Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { CSSProperties } from 'react';
import { inferUnitFromValue, type CssUnit } from '@/utils';

interface CustomInputWithUnitProps {
  value?: string;
  onChange?: (next?: string) => void;
  units?: CssUnit[];
  defaultUnit?: CssUnit;

  // passthrough for InputNumber
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  placeholder?: string;
  size?: SizeType;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  selectClassName?: string;
  selectStyle?: CSSProperties;
}

const CustomInputWithUnit: FC<CustomInputWithUnitProps> = memo((props) => {
  const {
    value,
    onChange,
    units = ['px', '%'],
    defaultUnit = 'px',
    min,
    max,
    step,
    precision,
    placeholder,
    size,
    disabled,
    className,
    style,
    selectClassName,
    selectStyle,
  } = props;

  const { numberValue, unitValue } = useMemo(() => {
    const unit = inferUnitFromValue(value) || defaultUnit;
    const num = typeof value === 'string' ? parseFloat(value) : undefined;
    return {
      numberValue: Number.isFinite(num as number) ? (num as number) : undefined,
      unitValue: units.includes(unit) ? unit : defaultUnit,
    };
  }, [value, units, defaultUnit]);

  const handleNumberChange = (next: number | null) => {
    if (!onChange) return;
    if (typeof next !== 'number' || Number.isNaN(next)) {
      onChange(undefined);
      return;
    }
    onChange(`${next}${unitValue}`);
  };

  const handleUnitChange = (nextUnit: CssUnit) => {
    if (!onChange) return;
    if (typeof numberValue !== 'number') {
      onChange(undefined);
      return;
    }
    onChange(`${numberValue}${nextUnit}`);
  };

  return (
    <InputNumber
      className={className}
      style={style}
      value={numberValue}
      onChange={handleNumberChange}
      min={min}
      max={max}
      step={step}
      precision={precision}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      controls
      addonAfter={
        <Select
          className={selectClassName}
          style={{ width: 50, ...(selectStyle ?? {}) }}
          value={unitValue}
          onChange={(val) => handleUnitChange(val as CssUnit)}
          options={units.map((u) => ({ label: u, value: u }))}
        />
      }
    />
  );
});

CustomInputWithUnit.displayName = 'CustomInputWithUnit';

export default CustomInputWithUnit;
