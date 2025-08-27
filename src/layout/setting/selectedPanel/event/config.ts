export const eventConfig = [
  {
    label: '点击事件',
    value: 'click',
  },
  {
    label: '双击事件',
    value: 'dblclick',
  },
  {
    label: '鼠标按下事件',
    value: 'mousedown',
  },
  {
    label: '鼠标抬起事件',
    value: 'mouseup',
  },
  {
    label: '鼠标移入事件',
    value: 'mouseover',
  },
  {
    label: '鼠标移出事件',
    value: 'mouseout',
  },
  {
    label: '鼠标移动事件',
    value: 'mousemove',
  },
];

export const defaultEvent = eventConfig.reduce(
  (acc, item) => {
    acc[item.value] = `async ${item.value} (mouseEvent,components) {\n\n\n\n\n\n\n\n}`;
    return acc;
  },
  {} as Record<string, string>,
);
