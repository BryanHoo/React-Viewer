import { Send, WebPage } from '@icon-park/react';
import { Button } from 'antd';
import { memo } from 'react';

const Handler = memo(() => {
  return (
    <div className="flex items-center gap-[12px]">
      <Button icon={<WebPage theme="outline" size="18" />}>预览</Button>
      <Button icon={<Send theme="outline" size="18" />}>发布</Button>
    </div>
  );
});

export default Handler;

Handler.displayName = 'Handler';
