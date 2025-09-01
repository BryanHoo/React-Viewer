import { memo, useState } from 'react';
import Category from './category';
import MaterielItems from './materielItems';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';

const MaterielBox = memo(() => {
  const { showChart } = useGlobalStore(
    useShallow((state) => ({
      showChart: state.showChart,
    })),
  );
  const [activeCategory, setActiveCategory] = useState('all');
  return (
    <div
      className={`h-full flex-shrink-0 flex flex-row overflow-hidden min-h-0 transition-all duration-500 ${showChart ? 'w-[265px] opacity-100' : 'w-0 opacity-0'}`}
    >
      <Category activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <MaterielItems activeCategory={activeCategory} />
    </div>
  );
});

export default MaterielBox;

MaterielBox.displayName = 'MaterielBox';
