import { Select, type CollapseProps } from 'antd';
import { typeItemConfig } from './config';

interface TypeItemProps extends AppPanelProps {
  itemKey: string;
  type: keyof typeof typeItemConfig;
  label?: string;
  allowSwitch?: boolean;
}

const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const TypeItem = (props: TypeItemProps): NonNullable<CollapseProps['items']>[number] => {
  const { itemKey, type, label = '类型', allowSwitch = false, id, config, index } = props;

  const Component = typeItemConfig[type]?.component;

  return {
    key: itemKey,
    label,
    children: Component ? <Component config={config} id={id} index={index} /> : undefined,
    extra: allowSwitch ? (
      <div onClick={handleClick}>
        <Select
          options={[
            { label: '柱状图', value: 'bar' },
            { label: '折线图', value: 'line' },
          ]}
          value={type}
          onChange={(value) => {
            console.log(value);
          }}
        />
      </div>
    ) : undefined,
  };
};

export default TypeItem;
