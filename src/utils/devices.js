// 14 类集成设备元信息（覆盖功能清单 V1）
// path 与 router 中保持一致

export const DEVICE_CATEGORIES = [
  { key: 'tower',     name: '塔吊安全监测',  icon: 'OfficeBuilding', color: '#1677ff', path: '/admin/device/tower',     total: 4,  online: 4 },
  { key: 'nvr',       name: '视频监控主机',  icon: 'VideoCamera',    color: '#722ed1', path: '/admin/device/nvr',       total: 6,  online: 6 },
  { key: 'lift',      name: '升降机监测',    icon: 'Sort',           color: '#13c2c2', path: '/admin/device/lift',      total: 3,  online: 3 },
  { key: 'gate',      name: '车道闸',        icon: 'Switch',         color: '#fa8c16', path: '/admin/device/gate',      total: 4,  online: 4 },
  { key: 'helmet',    name: '智能安全帽',    icon: 'Avatar',         color: '#52c41a', path: '/admin/device/helmet',    total: 60, online: 54 },
  { key: 'fence',     name: '电子围栏',      icon: 'Grid',           color: '#eb2f96', path: '/admin/device/fence',     total: 8,  online: 8 },
  { key: 'broadcast', name: '远程广播调度',  icon: 'Microphone',     color: '#1677ff', path: '/admin/device/broadcast', total: 6,  online: 6 },
  { key: 'water',     name: '智能水表',      icon: 'Goblet',         color: '#13c2c2', path: '/admin/device/water',     total: 5,  online: 5 },
  { key: 'electric',  name: '智能电表',      icon: 'Lightning',      color: '#faad14', path: '/admin/device/electric',  total: 8,  online: 7 },
  { key: 'env-sensor',name: '环境监测设备',  icon: 'Sunny',          color: '#52c41a', path: '/admin/device/env-sensor',total: 4,  online: 4 },
  { key: 'sprinkler', name: '喷淋联动',      icon: 'WaterCup',       color: '#1677ff', path: '/admin/device/sprinkler', total: 12, online: 12 },
  { key: 'smoke',     name: '智能烟感',      icon: 'Bell',           color: '#f5222d', path: '/admin/device/smoke',     total: 18, online: 17 },
  { key: 'aicamera',  name: 'AI 摄像头',     icon: 'Camera',         color: '#722ed1', path: '/admin/device/aicamera',  total: 12, online: 11 }
]
