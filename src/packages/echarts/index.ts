import bars, { barComponents, barPanels } from './Bars';
import lines, { lineComponents } from './Lines';

export const echartsComponents = { ...barComponents, ...lineComponents };
export const echartsPanels = { ...barPanels };

export default [...bars, ...lines];
