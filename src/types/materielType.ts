import type { EChartsOption } from 'echarts';
import type { ComponentType } from 'react';

export type EventKey =
  | 'click'
  | 'dblclick'
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'mouseover'
  | 'mouseout';

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
  apiType?: 'static' | 'public';
  animation?: string;
  event?: Record<EventKey, string>;
}

export interface MaterielCanvasItem extends MaterielItem {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex?: number;
  isLocked?: boolean;
  isVisible: boolean;
}

export interface PanelProps {
  config?: MaterielCanvasItem;
  id: string;
  index?: number;
}

export interface BaseEChartsProps {
  id: string;
  config?: MaterielCanvasItem;
}

export interface PackageConfig {
  config: MaterielItem[];
  components: Record<string, ComponentType<any>>;
  panels: Record<string, ComponentType<PanelProps>>;
}

export type OptionKey = 'xAxis' | 'yAxis' | 'legend';

export type TypeItemConfig = {
  label: string;
  value: string;
  component: ComponentType<PanelProps>;
};
