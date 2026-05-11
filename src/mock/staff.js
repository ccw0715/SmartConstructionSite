import Mock from 'mockjs'
import { TRADE_TYPES, TEAMS, POSITIONS, RANDOM_NAMES } from '@/utils/dict'
import { randomItem, randomInt } from '@/utils/format'

// 管理人员
const managers = Array.from({ length: 32 }, (_, i) => ({
  id: 'M' + String(10001 + i),
  name: randomItem(RANDOM_NAMES),
  gender: randomItem(['男', '女']),
  position: randomItem(POSITIONS),
  phone: Mock.mock('@phone'),
  idCard: Mock.mock(/4403\d{2}19[7-9]\d{5}\d{3}[0-9X]/),
  joinDate: Mock.mock('@date("2024-MM-dd")'),
  status: randomItem(['active', 'active', 'active', 'closed']),
  certificates: randomInt(1, 4)
}))

// 班组
const teams = TEAMS.map((name, i) => ({
  id: 'T' + String(100 + i),
  name,
  leader: randomItem(RANDOM_NAMES),
  trade: randomItem(TRADE_TYPES),
  memberCount: randomInt(8, 30),
  phone: Mock.mock('@phone'),
  enterDate: Mock.mock('@date("2024-MM-dd")'),
  status: 'active'
}))

// 劳务人员
const workers = Array.from({ length: 286 }, (_, i) => ({
  id: 'W' + String(50001 + i),
  name: randomItem(RANDOM_NAMES),
  gender: randomItem(['男','男','男','男','女']),
  age: randomInt(22, 58),
  trade: randomItem(TRADE_TYPES),
  team: randomItem(TEAMS),
  idCard: Mock.mock(/4403\d{2}19[6-9]\d{5}\d{3}[0-9X]/),
  phone: Mock.mock('@phone'),
  joinDate: Mock.mock('@date("2024-MM-dd")'),
  insurance: randomItem(['已购', '已购', '已购', '未购']),
  status: randomItem(['in', 'in', 'in', 'out'])
}))

// 考勤明细
const attendance = workers.slice(0, 100).map(w => ({
  id: 'A' + w.id,
  workerId: w.id,
  name: w.name,
  trade: w.trade,
  team: w.team,
  date: Mock.mock('@date("2026-05-dd")'),
  inTime: '07:' + String(randomInt(20, 55)).padStart(2,'0'),
  outTime: '18:' + String(randomInt(0, 40)).padStart(2,'0'),
  workHours: (randomInt(80, 110) / 10).toFixed(1),
  type: randomItem(['正常', '正常', '正常', '迟到', '早退']),
  device: randomItem(['闸机1', '闸机2', '人脸识别A', '人脸识别B'])
}))

function paginate(list, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return { total: list.length, list: list.slice(start, start + pageSize) }
}

function filterList(list, q, fields) {
  if (!q) return list
  q = String(q).toLowerCase()
  return list.filter(item => fields.some(f => String(item[f] ?? '').toLowerCase().includes(q)))
}

Mock.mock(/\/api\/v1\/staff\/manager\?.*/, 'get', opt => {
  const u = new URL('http://x' + opt.url.replace('/api/v1/staff/manager', ''))
  const page = +u.searchParams.get('page') || 1
  const pageSize = +u.searchParams.get('pageSize') || 20
  const keyword = u.searchParams.get('keyword') || ''
  const pos = u.searchParams.get('position') || ''
  let list = filterList(managers, keyword, ['name','phone'])
  if (pos) list = list.filter(i => i.position === pos)
  return { code: 0, data: paginate(list, page, pageSize) }
})

Mock.mock(/\/api\/v1\/staff\/team\?.*/, 'get', () => ({ code: 0, data: { total: teams.length, list: teams } }))

Mock.mock(/\/api\/v1\/staff\/worker\?.*/, 'get', opt => {
  const u = new URL('http://x' + opt.url.replace('/api/v1/staff/worker', ''))
  const page = +u.searchParams.get('page') || 1
  const pageSize = +u.searchParams.get('pageSize') || 20
  const keyword = u.searchParams.get('keyword') || ''
  const trade = u.searchParams.get('trade') || ''
  const team = u.searchParams.get('team') || ''
  const status = u.searchParams.get('status') || ''
  let list = filterList(workers, keyword, ['name','phone','idCard'])
  if (trade) list = list.filter(i => i.trade === trade)
  if (team) list = list.filter(i => i.team === team)
  if (status) list = list.filter(i => i.status === status)
  return { code: 0, data: paginate(list, page, pageSize) }
})

Mock.mock(/\/api\/v1\/staff\/attendance\?.*/, 'get', opt => {
  const u = new URL('http://x' + opt.url.replace('/api/v1/staff/attendance', ''))
  const page = +u.searchParams.get('page') || 1
  const pageSize = +u.searchParams.get('pageSize') || 20
  const keyword = u.searchParams.get('keyword') || ''
  let list = filterList(attendance, keyword, ['name'])
  return { code: 0, data: paginate(list, page, pageSize) }
})

// 考勤热力（30天）
Mock.mock('/api/v1/staff/attendance/heatmap', 'get', () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    data.push([dateStr, randomInt(220, 290)])
  }
  return { code: 0, data }
})

// 工种分布统计
Mock.mock('/api/v1/staff/worker/trade-stats', 'get', () => {
  const stats = TRADE_TYPES.map(t => ({
    name: t, value: workers.filter(w => w.trade === t).length
  }))
  return { code: 0, data: stats }
})
