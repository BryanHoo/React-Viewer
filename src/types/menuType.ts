import type { MaterielItem } from './materielType';

export interface MenuConfig {
  [key: string]: {
    title: string;
    icon: React.ReactNode;
    items: MaterielItem[];
  };
}
