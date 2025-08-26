import packages from '@/packages';
import type { PanelProps } from '@/types/materielType';
import { memo, useMemo, type FC } from 'react';

const Customize: FC<PanelProps> = memo((props) => {
  const { config, id } = props;

  const PanelComponent = useMemo(() => {
    if (!config?.panel) return null;
    return packages.panels[config.panel];
  }, [config]);

  return (
    <div className="w-full h-full">
      {PanelComponent && id && <PanelComponent config={config} id={id} />}
    </div>
  );
});

Customize.displayName = 'Customize';

export default Customize;
