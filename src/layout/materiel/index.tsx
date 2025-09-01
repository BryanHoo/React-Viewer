import { memo } from 'react';
import Menu from './menu';
import MaterielBox from './materielBox';
import Layer from './layer';

const Materiel = memo(() => {
  return (
    <div className="h-full flex flex-row min-h-0">
      <Menu />
      <MaterielBox />
      <Layer />
    </div>
  );
});

export default Materiel;

Materiel.displayName = 'Materiel';
