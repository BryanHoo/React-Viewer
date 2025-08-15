export interface MaterielItem {
  id: string;
  title: string;
  image: string;
  type: string;
  componentName: string;
  panel?: string;
}

export interface MaterielCanvasItem extends MaterielItem {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex?: number;
}

export interface PackageConfig {
  config: MaterielItem[];
  components: Record<string, any>;
  panels: Record<string, any>;
}
