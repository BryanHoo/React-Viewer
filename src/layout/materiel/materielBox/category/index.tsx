import { memo, useMemo, type FC } from 'react';
import MenuItem from '../../components/MenuItem';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { menuConfig } from '@/layout/materiel/menu/config';

interface CategoryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Category: FC<CategoryProps> = memo(({ activeCategory, setActiveCategory }) => {
  const { activeMenu } = useGlobalStore(
    useShallow((state) => ({
      activeMenu: state.activeMenu,
    })),
  );
  const categoryList = useMemo(() => {
    return menuConfig[activeMenu].items.map((item) => item.type);
  }, [activeMenu]);

  return (
    <div className="w-[65px] h-full flex-shrink-0 text-[var(--n-text-color)] text-[12px] bg-[#1e1e1f] flex flex-col items-center">
      <div className="h-[40px] flex items-center justify-center p-[10px] text-sm text-[var(--n-text-color)]">
        分类
      </div>
      <div className="flex-1 flex flex-col gap-[12px]">
        <MenuItem
          text="所有"
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {categoryList.map((item) => (
          <MenuItem
            key={item}
            text={item}
            active={activeCategory === item}
            onClick={() => setActiveCategory(item)}
          />
        ))}
      </div>
    </div>
  );
});

export default Category;

Category.displayName = 'Category';
