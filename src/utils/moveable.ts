export interface MinimalResizeEvent {
  width: number;
  height: number;
  drag?: { beforeTranslate?: [number, number] };
}

export function isResizeEvent(value: unknown): value is MinimalResizeEvent {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as { [key: string]: unknown };
  const hasWidth = typeof maybe.width === 'number' && Number.isFinite(maybe.width);
  const hasHeight = typeof maybe.height === 'number' && Number.isFinite(maybe.height);
  if (!hasWidth || !hasHeight) return false;
  const drag = maybe.drag;
  if (drag && typeof drag === 'object') {
    const before = (drag as { [key: string]: unknown }).beforeTranslate;
    if (before !== undefined) {
      if (!Array.isArray(before) || before.length !== 2) return false;
      const [x, y] = before;
      if (!(typeof x === 'number' && Number.isFinite(x))) return false;
      if (!(typeof y === 'number' && Number.isFinite(y))) return false;
    }
  }
  return true;
}
