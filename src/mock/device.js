import Mock from 'mockjs'
import { randomItem, randomInt } from '@/utils/format'

// ====== 视频监管 ======
const cameras = Array.from({ length: 18 }, (_, i) => ({
  id: 'CAM' + String(101 + i),
  name: ['塔吊高点 #1','塔吊高点 #2','基坑南侧','基坑北侧','大门出入口','材料堆场','卸料平台 1F','卸料平台 12F','生活区','楼栋间通道','场地全景 #1','场地全景 #2','地下车库入口','钢筋加工区','配电箱区','消防通道','安全通道','值班室'][i],
  area: randomItem(['出入口', '主楼区', '生活区', '材料区', '基坑']),
  type: randomItem(['球机', '枪机', '半球']),
  status: i < 16 ? 'online' : 'offline',
  resolution: randomItem(['1080P', '4K', '720P']),
  ip: `192.168.1.${100 + i}`
}))
Mock.mock(/\/api\/v1\/video\/cameras.*/, 'get', () => ({ code: 0, data: { list: cameras, total: cameras.length } }))

// ====== 设备总览 ======
Mock.mock('/api/v1/device/overview', 'get', () => ({
  code: 0,
  data: {
    totalDevices: 150,
    onlineDevices: 141,
    offlineDevices: 9,
    alarmingDevices: 3,
    monthlyAlarms: 38,
    powerToday: 1283,
    waterToday: 56
  }
}))

// ====== 塔吊 ======
const towers = Array.from({ length: 4 }, (_, i) => ({
  id: 'TC-0' + (i + 1),
  name: `${i + 1} 号塔吊`,
  model: 'QTZ80',
  driver: randomItem(['李师傅', '王师傅', '陈师傅', '赵师傅']),
  height: 60 + i * 5,
  weight: (randomInt(15, 35) / 10).toFixed(1),
  amplitude: randomInt(20, 50),
  rotation: randomInt(0, 360),
  windSpeed: (randomInt(8, 80) / 10).toFixed(1),
  tilt: (randomInt(2, 15) / 10).toFixed(2),
  status: i === 0 ? 'warning' : 'online',
  lastUpdate: new Date().toISOString()
}))
Mock.mock('/api/v1/device/tower', 'get', () => ({ code: 0, data: towers }))

// ====== 升降机 ======
const lifts = Array.from({ length: 3 }, (_, i) => ({
  id: 'LIFT-0' + (i + 1),
  name: `${i + 1} 号升降机`,
  model: 'SC200',
  height: randomInt(20, 80),
  speed: (randomInt(10, 30) / 10).toFixed(1),
  load: randomInt(800, 1900),
  loadLimit: 2000,
  people: randomInt(2, 10),
  peopleLimit: 12,
  status: 'online'
}))
Mock.mock('/api/v1/device/lift', 'get', () => ({ code: 0, data: lifts }))

// ====== 车道闸 ======
const gates = Array.from({ length: 4 }, (_, i) => ({
  id: 'GATE-0' + (i + 1),
  name: ['西大门 入口','西大门 出口','东大门 入口','东大门 出口'][i],
  todayIn: randomInt(20, 80),
  todayOut: randomInt(20, 70),
  lastVehicle: '粤B·' + Mock.mock(/[A-Z0-9]{5}/),
  lastTime: new Date(Date.now() - randomInt(60, 3600) * 1000).toISOString(),
  status: 'online'
}))
Mock.mock('/api/v1/device/gate', 'get', () => ({ code: 0, data: gates }))

// ====== 智能安全帽 ======
const helmets = Array.from({ length: 60 }, (_, i) => ({
  id: 'HM' + String(1001 + i),
  worker: ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄敏','周涛','吴丹'][i % 10] + (i + 1),
  battery: randomInt(15, 100),
  location: randomItem(['1#楼 12F', '2#楼 8F', '基坑南侧', '材料堆场', '生活区']),
  online: Math.random() > 0.1,
  lastHeartbeat: new Date(Date.now() - randomInt(0, 7200) * 1000).toISOString()
}))
Mock.mock(/\/api\/v1\/device\/helmet.*/, 'get', opt => {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const start = (page - 1) * pageSize
  return { code: 0, data: { total: helmets.length, list: helmets.slice(start, start + pageSize) } }
})

// ====== 电子围栏 ======
const fences = Array.from({ length: 8 }, (_, i) => ({
  id: 'FN-' + String(101 + i),
  name: ['基坑周边','配电房','危化品仓库','塔吊作业区','卸料平台 1F','卸料平台 12F','变压器区','屋面边缘'][i],
  type: randomItem(['危险源', '禁入区', '限行区']),
  triggerToday: randomInt(0, 5),
  status: 'online'
}))
Mock.mock('/api/v1/device/fence', 'get', () => ({ code: 0, data: fences }))

// ====== 智能水/电表 ======
function genMeter(prefix, n, unit, max) {
  return Array.from({ length: n }, (_, i) => ({
    id: prefix + String(101 + i),
    name: `${i + 1} 号${prefix === 'WM' ? '水' : '电'}表`,
    location: randomItem(['办公区', '生活区', '主楼施工区', '材料区', '配电房']),
    reading: randomInt(max * 0.4, max),
    todayUsage: randomInt(max * 0.02, max * 0.05),
    monthUsage: randomInt(max * 0.3, max * 0.6),
    unit,
    status: 'online'
  }))
}
Mock.mock('/api/v1/device/water',    'get', () => ({ code: 0, data: genMeter('WM', 5, 'm³', 5000) }))
Mock.mock('/api/v1/device/electric', 'get', () => ({ code: 0, data: genMeter('EM', 8, 'kWh', 50000) }))

// 能耗趋势
Mock.mock('/api/v1/device/energy/trend', 'get', () => {
  const data = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    data.push({
      date: d.toISOString().slice(5, 10),
      water: randomInt(40, 80),
      electric: randomInt(900, 1500)
    })
  }
  return { code: 0, data }
})

// ====== 喷淋联动 ======
const sprinklers = Array.from({ length: 12 }, (_, i) => ({
  id: 'SP-' + String(101 + i),
  name: `${i + 1} 号喷淋点`,
  area: randomItem(['主楼区','基坑区','场地围墙','卸料平台']),
  running: i < 4,
  pressure: (randomInt(15, 40) / 10).toFixed(1),
  linkage: randomItem(['PM2.5 自动联动','PM10 自动联动','手动']),
  todayRunTime: randomInt(0, 240),
  status: 'online'
}))
Mock.mock('/api/v1/device/sprinkler', 'get', () => ({ code: 0, data: sprinklers }))

// ====== 智能烟感 ======
const smokes = Array.from({ length: 18 }, (_, i) => ({
  id: 'SM-' + String(101 + i),
  name: `${i + 1} 号烟感`,
  location: randomItem(['办公楼1F','办公楼2F','生活区A区','生活区B区','配电房','材料仓库','档案室']),
  smoke: i === 0 ? 'alarm' : 'normal',
  battery: randomInt(40, 100),
  online: i !== 17,
  status: i === 0 ? 'warning' : 'online'
}))
Mock.mock('/api/v1/device/smoke', 'get', () => ({ code: 0, data: smokes }))

// ====== AI 摄像头 ======
const aiEvents = Array.from({ length: 30 }, (_, i) => ({
  id: 'AI' + String(2001 + i),
  type: randomItem(['未戴安全帽', '吸烟检测', '区域入侵', '徘徊检测', '未穿反光衣']),
  location: randomItem(['1#楼 12F', '2#楼 8F', '基坑南侧', '材料堆场', '生活区']),
  camera: randomItem(['AICAM-01', 'AICAM-02', 'AICAM-03']),
  time: new Date(Date.now() - randomInt(0, 7 * 24 * 3600) * 1000).toISOString(),
  confidence: randomInt(75, 99),
  status: randomItem(['unrectified', 'rectifying', 'rectified'])
}))
const aiCameras = Array.from({ length: 12 }, (_, i) => ({
  id: 'AICAM-' + String(101 + i),
  name: `AI 摄像头 #${i + 1}`,
  location: randomItem(['出入口', '基坑', '主楼1F', '主楼5F', '材料区', '生活区']),
  ability: ['未戴安全帽', '区域入侵', '吸烟检测'].slice(0, randomInt(1, 3)),
  todayDetections: randomInt(0, 30),
  status: i < 11 ? 'online' : 'offline'
}))
Mock.mock('/api/v1/device/aicamera', 'get', () => ({ code: 0, data: { cameras: aiCameras, events: aiEvents } }))

// ====== NVR ======
const nvrs = Array.from({ length: 6 }, (_, i) => ({
  id: 'NVR-' + String(101 + i),
  name: `${i + 1} 号 NVR 主机`,
  location: randomItem(['监控中心', '门卫室', '指挥部']),
  channels: randomInt(8, 32),
  online: randomInt(8, 32),
  storage: randomInt(50, 90),
  status: 'online'
}))
Mock.mock('/api/v1/device/nvr', 'get', () => ({ code: 0, data: nvrs }))

// ====== 远程广播 ======
const broadcasts = Array.from({ length: 6 }, (_, i) => ({
  id: 'BC-' + String(101 + i),
  name: `${i + 1} 号广播终端`,
  area: randomItem(['主楼工地','生活区','基坑区','大门','作业层 12F','作业层 20F']),
  status: 'online',
  lastBroadcast: '今日 09:00 安全晨会'
}))
Mock.mock('/api/v1/device/broadcast', 'get', () => ({ code: 0, data: broadcasts }))

// ====== 环境监测设备（设备维度） ======
Mock.mock('/api/v1/device/env-sensor', 'get', () => ({
  code: 0,
  data: [
    { id:'ENV-101', name:'#1 监测点', location:'工地东侧入口', items:['PM2.5','PM10','TSP','噪声','温度','湿度','风速','风向'], status:'online' },
    { id:'ENV-102', name:'#2 监测点', location:'主楼施工区',   items:['PM2.5','PM10','TSP','噪声','温度','湿度','风速','风向'], status:'online' },
    { id:'ENV-103', name:'#3 监测点', location:'材料堆场',     items:['PM2.5','PM10','噪声','温度','湿度'], status:'online' },
    { id:'ENV-104', name:'#4 监测点', location:'生活区',       items:['PM2.5','噪声','温度','湿度'], status:'online' }
  ]
}))
