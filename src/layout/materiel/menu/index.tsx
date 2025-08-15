import { memo } from 'react';
import MenuItem from '../components/MenuItem';
import { menuConfig } from '@/layout/materiel/menu/config';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';

const Menu = memo(() => {
  const { activeMenu, setActiveMenu } = useGlobalStore(
    useShallow((state) => ({
      activeMenu: state.activeMenu,
      setActiveMenu: state.setActiveMenu,
    })),
  );
  return (
    <div className="w-[65px] h-full bg-[#232324] flex flex-col items-center">
      <div className="h-[40px] flex items-center justify-center p-[10px] text-sm text-[var(--n-text-color)]">
        组件
      </div>
      <div className="flex-1 flex flex-col gap-[12px]">
        {Object.keys(menuConfig).map((key) => (
          <MenuItem
            key={key}
            icon={menuConfig[key].icon}
            text={menuConfig[key].title}
            active={key === activeMenu}
            onClick={() => setActiveMenu(key)}
          />
        ))}
      </div>
    </div>
  );
});

export default Menu;

Menu.displayName = 'Menu';
