import { memo } from 'react';

interface MenuItemProps {
  icon?: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem = memo((props: MenuItemProps) => {
  const { icon, text, active = false, onClick } = props;

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-[4px]
        text-[12px] text-[var(--n-text-color)] px-[8px] py-[6px]
        rounded-[4px] cursor-pointer
        transition-colors duration-200 ease-in-out
        ${active ? '!text-[var(--n-primary-color)] !bg-[var(--n-item-color-active)]' : ''}
        hover:bg-[var(--n-item-color-hover)]
        `}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  );
});

export default MenuItem;

MenuItem.displayName = 'MenuItem';
