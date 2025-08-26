import { memo, type FC } from 'react';
import type React from 'react';
import { JsonEditor, githubDarkTheme, type JsonEditorProps } from 'json-edit-react';
import classNames from '@/utils/classname';

interface JsonFormEditorProps extends Omit<JsonEditorProps, 'onChange' | 'setData' | 'data'> {
  value?: Record<string, unknown> | unknown[];
  onChange?: (next: any) => void;
  className?: string;
  style?: React.CSSProperties;
  rootFontSize?: number | string;
}

const JsonFormEditor: FC<JsonFormEditorProps> = memo((props) => {
  const { value, onChange, className, style, rootFontSize = 14, ...rest } = props;

  return (
    <div className={classNames(className, 'w-full h-[500px] overflow-y-auto')} style={style}>
      <JsonEditor
        data={value as any}
        setData={onChange}
        theme={githubDarkTheme}
        rootFontSize={rootFontSize}
        showCollectionCount={false}
        {...rest}
      />
    </div>
  );
});

JsonFormEditor.displayName = 'JsonFormEditor';

export default JsonFormEditor;
