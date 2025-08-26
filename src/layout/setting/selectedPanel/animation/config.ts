export interface AnimationItem {
  key: string;
  label: string;
}

export interface AnimationGroup {
  groupKey: string;
  groupLabel: string;
  items: AnimationItem[];
}

export const animationGroups: AnimationGroup[] = [
  {
    groupKey: 'attention_seekers',
    groupLabel: '强调动画',
    items: [
      { key: 'bounce', label: '弹跳' },
      { key: 'flash', label: '闪烁' },
      { key: 'pulse', label: '脉冲' },
      { key: 'rubberBand', label: '橡皮筋' },
      { key: 'shakeX', label: '水平抖动' },
      { key: 'shakeY', label: '垂直抖动' },
      { key: 'headShake', label: '摇头' },
      { key: 'swing', label: '摆动' },
      { key: 'tada', label: '哒哒' },
      { key: 'wobble', label: '晃动' },
      { key: 'jello', label: '果冻' },
      { key: 'heartBeat', label: '心跳' },
    ],
  },
  {
    groupKey: 'back_entrances',
    groupLabel: '后退进入',
    items: [
      { key: 'backInDown', label: '向下后退进入' },
      { key: 'backInLeft', label: '从左后退进入' },
      { key: 'backInRight', label: '从右后退进入' },
      { key: 'backInUp', label: '向上后退进入' },
    ],
  },
  {
    groupKey: 'back_exits',
    groupLabel: '后退离场',
    items: [
      { key: 'backOutDown', label: '向下后退离场' },
      { key: 'backOutLeft', label: '向左后退离场' },
      { key: 'backOutRight', label: '向右后退离场' },
      { key: 'backOutUp', label: '向上后退离场' },
    ],
  },
  {
    groupKey: 'bouncing_entrances',
    groupLabel: '弹跳进入',
    items: [
      { key: 'bounceIn', label: '弹跳进入' },
      { key: 'bounceInDown', label: '向下弹跳进入' },
      { key: 'bounceInLeft', label: '从左弹跳进入' },
      { key: 'bounceInRight', label: '从右弹跳进入' },
      { key: 'bounceInUp', label: '向上弹跳进入' },
    ],
  },
  {
    groupKey: 'bouncing_exits',
    groupLabel: '弹跳离场',
    items: [
      { key: 'bounceOut', label: '弹跳离场' },
      { key: 'bounceOutDown', label: '向下弹跳离场' },
      { key: 'bounceOutLeft', label: '向左弹跳离场' },
      { key: 'bounceOutRight', label: '向右弹跳离场' },
      { key: 'bounceOutUp', label: '向上弹跳离场' },
    ],
  },
  {
    groupKey: 'fading_entrances',
    groupLabel: '淡入进入',
    items: [
      { key: 'fadeIn', label: '淡入' },
      { key: 'fadeInDown', label: '向下淡入' },
      { key: 'fadeInDownBig', label: '向下大幅淡入' },
      { key: 'fadeInLeft', label: '从左淡入' },
      { key: 'fadeInLeftBig', label: '从左大幅淡入' },
      { key: 'fadeInRight', label: '从右淡入' },
      { key: 'fadeInRightBig', label: '从右大幅淡入' },
      { key: 'fadeInUp', label: '向上淡入' },
      { key: 'fadeInUpBig', label: '向上大幅淡入' },
      { key: 'fadeInTopLeft', label: '左上淡入' },
      { key: 'fadeInTopRight', label: '右上淡入' },
      { key: 'fadeInBottomLeft', label: '左下淡入' },
      { key: 'fadeInBottomRight', label: '右下淡入' },
    ],
  },
  {
    groupKey: 'fading_exits',
    groupLabel: '淡出离场',
    items: [
      { key: 'fadeOut', label: '淡出' },
      { key: 'fadeOutDown', label: '向下淡出' },
      { key: 'fadeOutDownBig', label: '向下大幅淡出' },
      { key: 'fadeOutLeft', label: '向左淡出' },
      { key: 'fadeOutLeftBig', label: '向左大幅淡出' },
      { key: 'fadeOutRight', label: '向右淡出' },
      { key: 'fadeOutRightBig', label: '向右大幅淡出' },
      { key: 'fadeOutUp', label: '向上淡出' },
      { key: 'fadeOutUpBig', label: '向上大幅淡出' },
      { key: 'fadeOutTopLeft', label: '左上淡出' },
      { key: 'fadeOutTopRight', label: '右上淡出' },
      { key: 'fadeOutBottomLeft', label: '左下淡出' },
      { key: 'fadeOutBottomRight', label: '右下淡出' },
    ],
  },
  {
    groupKey: 'flippers',
    groupLabel: '翻转',
    items: [
      { key: 'flip', label: '翻转' },
      { key: 'flipInX', label: 'X 轴翻入' },
      { key: 'flipInY', label: 'Y 轴翻入' },
      { key: 'flipOutX', label: 'X 轴翻出' },
      { key: 'flipOutY', label: 'Y 轴翻出' },
    ],
  },
  {
    groupKey: 'lightspeed',
    groupLabel: '光速',
    items: [
      { key: 'lightSpeedInRight', label: '从右光速进入' },
      { key: 'lightSpeedInLeft', label: '从左光速进入' },
      { key: 'lightSpeedOutRight', label: '向右光速离场' },
      { key: 'lightSpeedOutLeft', label: '向左光速离场' },
    ],
  },
  {
    groupKey: 'rotating_entrances',
    groupLabel: '旋转进入',
    items: [
      { key: 'rotateIn', label: '旋转进入' },
      { key: 'rotateInDownLeft', label: '左下旋转进入' },
      { key: 'rotateInDownRight', label: '右下旋转进入' },
      { key: 'rotateInUpLeft', label: '左上旋转进入' },
      { key: 'rotateInUpRight', label: '右上旋转进入' },
    ],
  },
  {
    groupKey: 'rotating_exits',
    groupLabel: '旋转离场',
    items: [
      { key: 'rotateOut', label: '旋转离场' },
      { key: 'rotateOutDownLeft', label: '左下旋转离场' },
      { key: 'rotateOutDownRight', label: '右下旋转离场' },
      { key: 'rotateOutUpLeft', label: '左上旋转离场' },
      { key: 'rotateOutUpRight', label: '右上旋转离场' },
    ],
  },
  {
    groupKey: 'specials',
    groupLabel: '特殊',
    items: [
      { key: 'hinge', label: '铰链坠落' },
      { key: 'jackInTheBox', label: '盒中跳出' },
      { key: 'rollIn', label: '滚入' },
      { key: 'rollOut', label: '滚出' },
    ],
  },
  {
    groupKey: 'sliding_entrances',
    groupLabel: '滑动进入',
    items: [
      { key: 'slideInDown', label: '向下滑入' },
      { key: 'slideInLeft', label: '从左滑入' },
      { key: 'slideInRight', label: '从右滑入' },
      { key: 'slideInUp', label: '向上滑入' },
    ],
  },
  {
    groupKey: 'sliding_exits',
    groupLabel: '滑动离场',
    items: [
      { key: 'slideOutDown', label: '向下滑出' },
      { key: 'slideOutLeft', label: '向左滑出' },
      { key: 'slideOutRight', label: '向右滑出' },
      { key: 'slideOutUp', label: '向上滑出' },
    ],
  },
  {
    groupKey: 'zooming_entrances',
    groupLabel: '缩放进入',
    items: [
      { key: 'zoomIn', label: '缩放进入' },
      { key: 'zoomInDown', label: '向下缩放进入' },
      { key: 'zoomInLeft', label: '从左缩放进入' },
      { key: 'zoomInRight', label: '从右缩放进入' },
      { key: 'zoomInUp', label: '向上缩放进入' },
    ],
  },
  {
    groupKey: 'zooming_exits',
    groupLabel: '缩放离场',
    items: [
      { key: 'zoomOut', label: '缩放离场' },
      { key: 'zoomOutDown', label: '向下缩放离场' },
      { key: 'zoomOutLeft', label: '向左缩放离场' },
      { key: 'zoomOutRight', label: '向右缩放离场' },
      { key: 'zoomOutUp', label: '向上缩放离场' },
    ],
  },
];
