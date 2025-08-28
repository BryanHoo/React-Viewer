import { Button, Tooltip } from 'antd';
import { memo } from 'react';
import { BackOne, ChartHistogram, GoAhead, Home, Layers, RightBar } from '@icon-park/react';
import { Divider } from 'antd';
import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/shallow';
import { useMemoizedFn } from 'ahooks';
import { useCanvasStore } from '@/store/canvasStore';
import { useHistoryStore } from '@/store/historyStore';

const Toolbar = memo(() => {
  const { showChart, showLayer, showDetail, setShowChart, setShowLayer, setShowDetail } =
    useGlobalStore(
      useShallow((state) => ({
        showChart: state.showChart,
        showLayer: state.showLayer,
        showDetail: state.showDetail,
        setShowChart: state.setShowChart,
        setShowLayer: state.setShowLayer,
        setShowDetail: state.setShowDetail,
      })),
    );
  const handleShowChart = useMemoizedFn(() => {
    setShowChart(!showChart);
  });
  const handleShowLayer = useMemoizedFn(() => {
    setShowLayer(!showLayer);
  });
  const handleShowDetail = useMemoizedFn(() => {
    setShowDetail(!showDetail);
  });
  const { undo, redo } = useCanvasStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
    })),
  );
  const { historyIndex, histories } = useHistoryStore(
    useShallow((state) => ({ historyIndex: state.historyIndex, histories: state.histories })),
  );
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < histories.length - 1;
  return (
    <div className="flex items-center gap-[12px]">
      <Tooltip title="首页" placement="bottom">
        <Button icon={<Home theme="outline" size="18" />} />
      </Tooltip>
      <Tooltip title="图表" placement="bottom">
        <Button
          icon={<ChartHistogram theme="outline" size="18" />}
          onClick={handleShowChart}
          className={
            showChart ? '!text-[var(--n-primary-color)] !border-[var(--n-primary-color)]' : ''
          }
        />
      </Tooltip>
      <Tooltip title="图层" placement="bottom">
        <Button
          icon={<Layers theme="outline" size="18" />}
          className={
            showLayer ? '!text-[var(--n-primary-color)] !border-[var(--n-primary-color)]' : ''
          }
          onClick={handleShowLayer}
        />
      </Tooltip>
      <Tooltip title="详情设置" placement="bottom">
        <Button
          icon={<RightBar theme="outline" size="18" />}
          onClick={handleShowDetail}
          className={
            showDetail ? '!text-[var(--n-primary-color)] !border-[var(--n-primary-color)]' : ''
          }
        />
      </Tooltip>
      <Divider type="vertical" className="h-full" />
      <Tooltip title="后退" placement="bottom">
        <Button icon={<BackOne theme="outline" size="18" />} disabled={!canUndo} onClick={undo} />
      </Tooltip>
      <Tooltip title="前进" placement="bottom">
        <Button icon={<GoAhead theme="outline" size="18" />} disabled={!canRedo} onClick={redo} />
      </Tooltip>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
