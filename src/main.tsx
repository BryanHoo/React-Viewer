import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './layout';
import './global.css';
import { ConfigProvider, theme } from 'antd';
import * as echarts from 'echarts';
import { registerAllEChartsThemes } from '@/components/ECharts/utils';

// 一次性注册 ECharts 主题
registerAllEChartsThemes(echarts);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#51d6a9',
        },
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
