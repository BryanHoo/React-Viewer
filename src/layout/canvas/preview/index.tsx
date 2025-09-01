import { memo, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { Close } from '@icon-park/react';
import packages from '@/packages';
import { useGlobalStore } from '@/store/globalStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useMemoizedFn } from 'ahooks';

interface CanvasPreviewProps {
  open: boolean;
  onClose: () => void;
}

const CanvasPreview: FC<CanvasPreviewProps> = memo((props) => {
  const { open, onClose } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  const { width, height, backgroundColor, backgroundImage, backgroundFit } = useGlobalStore(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      backgroundColor: state.backgroundColor,
      backgroundImage: state.backgroundImage,
      backgroundFit: state.backgroundFit,
    })),
  );

  const { componentMap } = useCanvasStore(
    useShallow((state) => ({
      componentMap: state.componentMap,
    })),
  );

  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 请求浏览器全屏（带前缀兼容）
    const requestFullscreen = async () => {
      const el = overlayRef.current;
      if (!el) return;

      const anyEl = el as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
        msRequestFullscreen?: () => Promise<void> | void;
      };
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (anyEl.webkitRequestFullscreen) {
          await anyEl.webkitRequestFullscreen();
        } else if (anyEl.msRequestFullscreen) {
          await anyEl.msRequestFullscreen();
        }
      } catch {
        // 忽略：可能因非用户手势而被浏览器拦截
      }
    };

    void requestFullscreen();

    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('resize', handleResize);
      // 退出全屏（带前缀兼容）
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void> | void;
        msExitFullscreen?: () => Promise<void> | void;
        webkitFullscreenElement?: Element | null;
      };
      try {
        const isFullscreen =
          document.fullscreenElement != null || doc.webkitFullscreenElement != null;
        if (isFullscreen) {
          if (document.exitFullscreen) {
            void document.exitFullscreen();
          } else if (doc.webkitExitFullscreen) {
            void doc.webkitExitFullscreen();
          } else if (doc.msExitFullscreen) {
            void doc.msExitFullscreen();
          }
        }
      } catch {
        // 忽略退出失败
      }
    };
  }, [open]);

  const backgroundSize = useMemo(() => {
    return backgroundFit === 'cover'
      ? 'cover'
      : backgroundFit === 'width'
        ? '100% auto'
        : backgroundFit === 'height'
          ? 'auto 100%'
          : 'auto';
  }, [backgroundFit]);

  const { scale, left, top } = useMemo(() => {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const s = Math.min(viewport.width / safeWidth, viewport.height / safeHeight);
    const scaledW = safeWidth * s;
    const scaledH = safeHeight * s;
    return {
      scale: s,
      left: (viewport.width - scaledW) / 2,
      top: (viewport.height - scaledH) / 2,
    };
  }, [viewport.width, viewport.height, width, height]);

  const items = useMemo(() => {
    const list = Array.from(componentMap.values()).filter((c) => c.isVisible);
    list.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
    return list;
  }, [componentMap]);

  const handleClose = useMemoizedFn(() => {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
      msExitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element | null;
    };
    try {
      const isFullscreen =
        document.fullscreenElement != null || doc.webkitFullscreenElement != null;
      if (isFullscreen) {
        if (document.exitFullscreen) {
          void document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          void doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          void doc.msExitFullscreen();
        }
      }
    } catch {
      // 忽略退出失败
    }
    onClose();
  });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', overflow: 'hidden' }}
      ref={overlayRef}
    >
      <button
        aria-label="关闭预览"
        type="button"
        onClick={handleClose}
        className="absolute top-[12px] right-[12px] p-[6px] rounded hover:bg-[rgba(255,255,255,0.1)] active:bg-[rgba(255,255,255,0.15)]"
        style={{ zIndex: 10000 }}
      >
        <Close theme="outline" size="20" fill="#ffffff" />
      </button>

      <div
        className="absolute"
        style={{
          width,
          height,
          left,
          top,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize,
          overflow: 'hidden',
        }}
      >
        {items.map((item) => {
          const Component = (packages.components as Record<string, any>)[item.componentName];
          if (!Component) return null;
          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                top: item.top,
                left: item.left,
                width: item.width,
                height: item.height,
                minWidth: 80,
                minHeight: 60,
                paddingTop: item.paddingTop,
                paddingRight: item.paddingRight,
                paddingBottom: item.paddingBottom,
                paddingLeft: item.paddingLeft,
                boxSizing: 'border-box',
                zIndex: item.zIndex,
              }}
            >
              <Component id={item.id} config={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

CanvasPreview.displayName = 'CanvasPreview';

export default CanvasPreview;
