import { memo, type FC, useEffect, useRef, useState } from 'react';
import type React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import type { Extension } from '@codemirror/state';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';

interface CodeMirrorFormProps {
  value?: string;
  onChange?: (next?: string) => void;

  // Common passthroughs for @uiw/react-codemirror
  height?: string;
  theme?: 'light' | 'dark' | 'none' | Extension;
  extensions?: Extension[];
  placeholder?: string | HTMLElement;
  readOnly?: boolean;
  editable?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

const defaultExtensions = [javascript()];

const CodeMirrorForm: FC<CodeMirrorFormProps> = memo((props) => {
  const {
    value,
    onChange,
    height = '240px',
    theme = vscodeDark,
    extensions,
    placeholder,
    readOnly,
    editable,
    className,
    style,
  } = props;

  const [draftValue, setDraftValue] = useState<string | undefined>(value);
  const isFocusedRef = useRef(false);
  const lastPropValueRef = useRef(value);

  // Sync external value when not focused (avoid cursor jump while editing)
  useEffect(() => {
    if (!isFocusedRef.current && value !== lastPropValueRef.current) {
      setDraftValue(value);
      lastPropValueRef.current = value;
    }
  }, [value]);

  const handleInternalChange = (next: string) => {
    setDraftValue(next);
  };

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = () => {
    isFocusedRef.current = true;
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = () => {
    isFocusedRef.current = false;
    if (onChange) {
      // 仅在失焦时回传，兼容 antd Form (value/onChange)
      onChange(draftValue);
      lastPropValueRef.current = draftValue;
    }
  };

  return (
    <div className={className} style={style} onFocus={handleFocus} onBlur={handleBlur}>
      <CodeMirror
        value={draftValue ?? ''}
        height={height}
        theme={theme}
        extensions={extensions || defaultExtensions}
        placeholder={placeholder}
        readOnly={readOnly}
        editable={editable}
        onChange={handleInternalChange}
      />
    </div>
  );
});

CodeMirrorForm.displayName = 'CodeMirrorForm';

export default CodeMirrorForm;
