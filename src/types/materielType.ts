import type { EChartsOption } from 'echarts-for-react';
import type { ComponentType } from 'react';
export interface MaterielItem {
  id: string;
  title: string;
  image: string;
  type: string;
  componentName: string;
  panel?: string;
  renderer?: 'svg' | 'canvas' | 'inherit';
  option?: EChartsOption;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
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
  components: Record<string, ComponentType<any>>;
  panels: Record<string, ComponentType<PanelProps>>;
}

export interface PanelProps {
  selectedId: string;
}
