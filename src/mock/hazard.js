import Mock from 'mockjs'
import { randomItem, randomInt } from '@/utils/format'

// 危大工程
const hazards = Array.from({ length: 24 }, (_, i) => ({
  id: 'DH' + String(10001 + i),
  name: randomItem(['深基坑支护工程', '高大模板支撑', '附着式升降脚手架', '塔吊安拆', '人货电梯安拆', '大型设备吊装']) + ` #${i + 1}`,
  type: randomItem(['深基坑', '模板工程', '脚手架', '起重吊装', '拆除工程']),
  level: randomItem(['危大', '超危大']),
  startDate: Mock.mock('@date("2025-MM-dd")'),
  endDate: Mock.mock('@date("2026-MM-dd")'),
  responsible: randomItem(['李工', '王工', '陈工', '赵工']),
  planStatus: randomItem(['已审批', '审批中', '已审批', '已审批']),
  monitorStatus: randomItem(['online', 'online', 'warning']),
  status: randomItem(['active', 'done', 'pending'])
}))

// 起重机械
const cranes = Array.from({ length: 6 }, (_, i) => ({
  id: 'CR-' + String(101 + i),
  name: `${['塔吊', '塔吊', '塔吊', '塔吊', '施工升降机', '施工升降机'][i]} #${i + 1}`,
  type: i < 4 ? '塔吊' : '施工升降机',
  model: i < 4 ? 'QTZ80' : 'SC200',
  spec: i < 4 ? '臂长 50m / 最大起重 8T' : '载重 2T / 高度 80m',
  inspectionDate: Mock.mock('@date("2026-MM-dd")'),
  nextInspectionDate: Mock.mock('@date("2026-MM-dd")'),
  driver: randomItem(['李师傅', '王师傅', '陈师傅', '赵师傅']),
  installer: '深圳起重设备安装公司',
  status: i === 2 ? 'warning' : 'online'
}))

// 深基坑
const pits = Array.from({ length: 3 }, (_, i) => ({
  id: 'PIT-0' + (i + 1),
  name: `${['南侧', '北侧', '中部'][i]}深基坑`,
  depth: (8 + i * 2).toFixed(1),
  area: randomInt(800, 2400),
  supportType: randomItem(['排桩+锚杆', '地下连续墙', 'SMW 工法桩']),
  startDate: '2024-05-01',
  endDate: '2024-09-30',
  monitorPoints: randomInt(20, 36),
  alarmPoints: randomInt(0, 3),
  status: i === 2 ? 'warning' : 'active'
}))

// 深基坑监测曲线（30天位移）
Mock.mock('/api/v1/hazard/pit/monitor', 'get', () => {
  const days = []
  let v = 5
  for (let i = 30; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    v += (Math.random() - 0.3) * 0.5
    days.push({ date: d.toISOString().slice(5, 10), displacement: +v.toFixed(2), settlement: +(v * 0.6).toFixed(2) })
  }
  return { code: 0, data: days }
})

function paged(list, opt) {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const start = (page - 1) * pageSize
  return { total: list.length, list: list.slice(start, start + pageSize) }
}

Mock.mock(/\/api\/v1\/hazard\/danger.*/, 'get', opt => ({ code: 0, data: paged(hazards, opt) }))
Mock.mock('/api/v1/hazard/crane', 'get', () => ({ code: 0, data: cranes }))
Mock.mock('/api/v1/hazard/pit', 'get', () => ({ code: 0, data: pits }))
