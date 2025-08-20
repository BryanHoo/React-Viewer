import { Children, memo, type FC, type ReactNode } from 'react';

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

const FormRow: FC<FormRowProps> = memo(({ children, className }) => {
  const elements = Children.toArray(children).filter(Boolean);

  return (
    <div className={`flex items-center justify-between gap-2 w-full ${className ?? ''}`}>
      {elements.map((child, index) => (
        <div className="w-0 flex-1" key={index}>
          {child}
        </div>
      ))}
    </div>
  );
});

FormRow.displayName = 'FormRow';

export default FormRow;
