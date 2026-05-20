// 侧边栏菜单（与功能清单 1:1 对齐）
// icon 字段引用 Element Plus 图标名

export const menus = [
  {
    path: '/admin/dashboard',
    title: '工作台',
    icon: 'DataLine'
  },
  {
    path: '/admin/project/list',
    title: '工程管理',
    icon: 'OfficeBuilding'
  },
  {
    title: '融合监督',
    icon: 'DocumentChecked',
    children: [
      { path: '/admin/supervision/inspection',   title: '监督检查记录' },
      { path: '/admin/supervision/rectify',      title: '整改通知' },
      { path: '/admin/supervision/violation',    title: '不规范行为' },
      { path: '/admin/supervision/score',        title: '省动态扣分' }
    ]
  },
  {
    title: '重大危险源',
    icon: 'WarningFilled',
    children: [
      { path: '/admin/hazard/danger',  title: '危大工程信息' },
      { path: '/admin/hazard/crane',   title: '起重机械' },
      { path: '/admin/hazard/pit',     title: '深基坑' }
    ]
  },
  {
    title: '文明施工',
    icon: 'Sunny',
    children: [
      { path: '/admin/civilized/env',     title: '环境监测' },
      { path: '/admin/civilized/noise',   title: '噪声监测' },
      { path: '/admin/civilized/alarm',   title: '报警记录' },
      { path: '/admin/civilized/rectify', title: '整改记录' }
    ]
  },
  {
    title: '人员管理',
    icon: 'UserFilled',
    children: [
      { path: '/admin/staff/manager',   title: '项目管理人员' },
      { path: '/admin/staff/team',      title: '项目班组' },
      { path: '/admin/staff/worker',    title: '项目劳务人员' },
      { path: '/admin/staff/attendance',title: '人员考勤' }
    ]
  },
  {
    title: '视频监管',
    icon: 'VideoCamera',
    children: [
      { path: '/admin/video/supervisor', title: '工程视频(监管端)' },
      { path: '/admin/video/site',       title: '工程视频(现场端)' }
    ]
  },
  {
    title: '混凝土监管',
    icon: 'Coin',
    children: [
      { path: '/admin/concrete/produce',  title: '生产信息' },
      { path: '/admin/concrete/transport',title: '运输记录' },
      { path: '/admin/concrete/pour',     title: '浇筑记录' },
      { path: '/admin/concrete/monitor',  title: '监测信息' }
    ]
  },
  {
    title: '质量检测',
    icon: 'Cpu',
    children: [
      { path: '/admin/quality/plan',   title: '检测方案' },
      { path: '/admin/quality/report', title: '质量检测报告' },
      { path: '/admin/quality/schedule', title: '检测计划' }
    ]
  },
  {
    path: '/admin/bim',
    title: 'BIM 轻量化',
    icon: 'Histogram'
  },
  {
    title: '设备集成',
    icon: 'Connection',
    children: [
      { path: '/admin/device/overview',     title: '设备总览' },
      { path: '/admin/device/tower',        title: '塔吊安全监测' },
      { path: '/admin/device/nvr',          title: '视频监控主机' },
      { path: '/admin/device/lift',         title: '升降机监测' },
      { path: '/admin/device/gate',         title: '车道闸' },
      { path: '/admin/device/helmet',       title: '智能安全帽' },
      { path: '/admin/device/fence',        title: '电子围栏' },
      { path: '/admin/device/broadcast',    title: '远程广播调度' },
      { path: '/admin/device/water',        title: '智能水表' },
      { path: '/admin/device/electric',     title: '智能电表' },
      { path: '/admin/device/env-sensor',   title: '环境监测设备' },
      { path: '/admin/device/sprinkler',    title: '喷淋联动' },
      { path: '/admin/device/smoke',        title: '智能烟感' },
      { path: '/admin/device/aicamera',     title: 'AI 摄像头' }
    ]
  },
  {
    path: '/admin/star',
    title: '星级评定',
    icon: 'StarFilled'
  }
]
