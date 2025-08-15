import { memo } from 'react';
import Toolbar from './toolbar';
import Handler from './handler';

const Header = memo(() => {
  return (
    <div className="border-b-[1px] border-[var(--n-border-color)] h-[60px] flex px-[20px] items-center justify-between">
      <Toolbar />
      <div className="text-[var(--n-text-color)] text-sm">工作空间-1</div>
      <Handler />
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
