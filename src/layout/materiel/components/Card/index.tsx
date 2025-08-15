import { useGlobalStore } from '@/store/globalStore';
import { memo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import type { MaterielItem } from '@/types/materielType';

const Card: FC<MaterielItem> = memo((props) => {
  const { title, image } = props;
  const { isDragging, setIsDragging } = useGlobalStore(
    useShallow((state) => ({
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
    })),
  );

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('materielConfig', JSON.stringify(props));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-[#232324] rounded-[6px] cursor-pointer border border-[#000] overflow-hidden">
      <div className="w-full bg-[#2a2a2b] px-[15px] py-[2px] flex flex-row items-center justify-between">
        <div className="flex">
          <div className="pointer-events-none w-[8px] h-[8px] rounded-full mx-[2px] bg-[#fc625d]"></div>
          <div className="pointer-events-none w-[8px] h-[8px] rounded-full mx-[2px] bg-[#fcbc40]"></div>
          <div className="pointer-events-none w-[8px] h-[8px] rounded-full mx-[2px] bg-[#34c749]"></div>
        </div>
        <span className="text-[12px] text-[var(--n-text-color)]">{title}</span>
      </div>
      <div className="py-[6px] h-[100px] overflow-hidden flex flex-row items-center justify-center">
        <img
          src={image}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`h-full max-w-[140px] rounded-[6px] object-contain duration-200 hover:scale-105 ${isDragging ? 'opacity-50' : ''}`}
        />
      </div>
    </div>
  );
});

export default Card;

Card.displayName = 'Card';
