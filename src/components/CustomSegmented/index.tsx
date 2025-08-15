import { ConfigProvider, Segmented, type SegmentedProps } from 'antd';
import { memo, type FC } from 'react';

const CustomSegmented: FC<SegmentedProps> = memo((props) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            trackBg: '#373737',
            itemColor: 'var(--n-tab-text-color-hover)',
            itemSelectedColor: 'var(--n-primary-color)',
            itemSelectedBg: '#4b4b4b',
            trackPadding: 3,
          },
        },
      }}
    >
      <Segmented {...props} />
    </ConfigProvider>
  );
});

CustomSegmented.displayName = 'CustomSegmented';

export default CustomSegmented;
