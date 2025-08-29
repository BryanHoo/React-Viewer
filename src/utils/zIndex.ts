export function getIdsOrderedByZIndexDesc(
  componentMap: Map<string, AppMaterielCanvasItem>,
): string[] {
  return [...componentMap.entries()]
    .sort((a, b) => (b[1].zIndex ?? 0) - (a[1].zIndex ?? 0))
    .map(([id]) => id);
}

export function buildOrderAfterSendToBack(
  componentMap: Map<string, AppMaterielCanvasItem>,
  targetId: string,
): string[] {
  const ordered = getIdsOrderedByZIndexDesc(componentMap).filter((id) => id !== targetId);
  ordered.push(targetId);
  return ordered;
}

export function buildOrderAfterMoveUp(
  componentMap: Map<string, AppMaterielCanvasItem>,
  targetId: string,
): string[] {
  const ordered = getIdsOrderedByZIndexDesc(componentMap);
  const index = ordered.indexOf(targetId);
  if (index <= 0) return ordered;
  [ordered[index - 1], ordered[index]] = [ordered[index], ordered[index - 1]];
  return ordered;
}

export function buildOrderAfterMoveDown(
  componentMap: Map<string, AppMaterielCanvasItem>,
  targetId: string,
): string[] {
  const ordered = getIdsOrderedByZIndexDesc(componentMap);
  const index = ordered.indexOf(targetId);
  if (index < 0 || index >= ordered.length - 1) return ordered;
  [ordered[index], ordered[index + 1]] = [ordered[index + 1], ordered[index]];
  return ordered;
}

export function getHighestZIndex(map: Map<string, AppMaterielCanvasItem>): number {
  let max = 0;
  map.forEach((item) => {
    const z = item.zIndex ?? 0;
    if (z > max) max = z;
  });
  return max;
}
