import { Send, WebPage } from '@icon-park/react';
import { Button } from 'antd';
import { memo, useState } from 'react';
import CanvasPreview from '@/layout/canvas/preview';

const Handler = memo(() => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = () => setIsPreviewOpen(true);
  const handleClosePreview = () => setIsPreviewOpen(false);

  return (
    <div className="flex items-center gap-[12px]">
      <Button icon={<WebPage theme="outline" size="18" />} onClick={handleOpenPreview}>
        预览
      </Button>
      <Button icon={<Send theme="outline" size="18" />}>发布</Button>
      <CanvasPreview open={isPreviewOpen} onClose={handleClosePreview} />
    </div>
  );
});

export default Handler;

Handler.displayName = 'Handler';
