import { Input } from 'antd';
import { memo, useMemo, type FC } from 'react';
import Card from '../../components/Card';
import { SearchOutlined } from '@ant-design/icons';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globalStore';
import { menuConfig } from '@/layout/materiel/menu/config';

interface MaterielItemsProps {
  activeCategory: string;
}

const MaterielItems: FC<MaterielItemsProps> = memo(({ activeCategory }) => {
  const { activeMenu } = useGlobalStore(
    useShallow((state) => ({
      activeMenu: state.activeMenu,
    })),
  );

  const list = useMemo(() => {
    if (activeCategory === 'all') {
      return menuConfig[activeMenu].items;
    }
    return menuConfig[activeMenu].items.filter((item) => item.type === activeCategory);
  }, [activeMenu, activeCategory]);
  return (
    <div className="h-full flex-1 flex flex-col overflow-y-auto">
      <div className="h-[40px] flex items-center justify-center p-[10px] text-sm text-[var(--n-text-color)]">
        <Input placeholder="搜索" allowClear addonAfter={<SearchOutlined />} />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto px-[10px] gap-[6px]">
        {list.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
});

export default MaterielItems;

MaterielItems.displayName = 'MaterielItems';
