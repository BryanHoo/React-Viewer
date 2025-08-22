import React, { memo, useMemo, useCallback } from 'react';
import { Tooltip } from 'antd';
import classes from './index.module.css';
import { chartColors } from '../ECharts/chartThemes';
import type { ChartColorsNameType } from '../ECharts/chartThemes';

interface ThemeColorSelectorProps {
  value?: ChartColorsNameType;
  onChange?: (value: ChartColorsNameType) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  colorSize?: number;
  colorRadius?: number;
  rowGap?: number;
  showTooltip?: boolean;
  themeList?: { key: ChartColorsNameType; name: string; colors?: string[] }[];
}

const ThemeColorSelector: React.FC<ThemeColorSelectorProps> = memo((props) => {
  const {
    value,
    onChange,
    disabled = false,
    className,
    style,
    colorSize = 20,
    colorRadius = 4,
    rowGap = 8,
    showTooltip = true,
    themeList: externalThemeList,
  } = props;

  const defaultThemeList = useMemo(() => {
    return Object.entries(chartColors).map(([key, theme]) => ({
      key: key as ChartColorsNameType,
      name: (theme as any).name ?? key,
      colors: (theme as any).color as string[] | undefined,
    }));
  }, []);

  const themeList = useMemo(
    () => externalThemeList ?? defaultThemeList,
    [externalThemeList, defaultThemeList],
  );

  const containerStyle: React.CSSProperties = useMemo(() => ({ gap: rowGap }), [rowGap]);
  const swatchStyle: React.CSSProperties = useMemo(
    () => ({ width: colorSize, height: colorSize, borderRadius: colorRadius }),
    [colorSize, colorRadius],
  );

  const handleSelect = useCallback(
    (key: ChartColorsNameType) => {
      if (disabled) return;
      if (onChange) {
        onChange(key);
      }
    },
    [disabled, onChange],
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const key = (e.currentTarget.dataset.key as ChartColorsNameType | undefined) ?? undefined;
      if (key) {
        handleSelect(key);
      }
    },
    [disabled, handleSelect],
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = (e.currentTarget.dataset.key as ChartColorsNameType | undefined) ?? undefined;
        if (key) {
          handleSelect(key);
        }
      }
    },
    [disabled, handleSelect],
  );

  return (
    <div className={className} style={style}>
      <div className={classes.container} style={containerStyle}>
        {themeList.map((item) => {
          const isSelected = item.key === value;
          const rowClass = [
            classes.row,
            isSelected ? classes.rowSelected : '',
            disabled ? classes.rowDisabled : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div
              key={item.key}
              className={rowClass}
              data-key={item.key}
              onClick={handleRowClick}
              role="button"
              aria-pressed={isSelected}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={handleRowKeyDown}
            >
              <div className={classes.name}>
                <span title={item.name}>{item.name}</span>
              </div>
              <div className={classes.palette} aria-hidden>
                {(item.colors ?? []).slice(0, 6).map((c) => {
                  const swatch = (
                    <span
                      key={c}
                      className={classes.swatch}
                      style={{ ...swatchStyle, backgroundColor: c }}
                    />
                  );
                  return showTooltip ? (
                    <Tooltip key={c} title={c}>
                      {swatch}
                    </Tooltip>
                  ) : (
                    swatch
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ThemeColorSelector.displayName = 'ThemeColorSelector';

export default ThemeColorSelector;
