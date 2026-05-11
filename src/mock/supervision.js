import Mock from 'mockjs'
import { VIOLATION_TYPES, RANDOM_NAMES } from '@/utils/dict'
import { randomItem, randomInt } from '@/utils/format'

const inspections = Array.from({ length: 48 }, (_, i) => ({
  id: 'INS' + String(20001 + i),
  no: 'JD-2026-' + String(1001 + i),
  type: randomItem(['日常巡查', '专项检查', '复查', '夜间巡查']),
  inspector: randomItem(['市住建局', '区监督站', '总监办', '安全总监']),
  inspectee: '中建科技产业园 A 区项目',
  date: Mock.mock('@date("2026-MM-dd")'),
  problemCount: randomInt(0, 6),
  status: randomItem(['done', 'pending', 'rectifying']),
  conclusion: randomItem(['整体规范', '存在隐患', '问题较多', '一般合格'])
}))

const rectifies = Array.from({ length: 32 }, (_, i) => ({
  id: 'REC' + String(30001 + i),
  no: 'ZG-2026-' + String(1001 + i),
  source: randomItem(['监督检查', '夜查', '专项整治']),
  title: '关于' + randomItem(['临边防护', '消防通道', '安全防护用具', '用电安全', '高处作业']) + '隐患的整改通知',
  issueDate: Mock.mock('@date("2026-MM-dd")'),
  dueDate: Mock.mock('@date("2026-MM-dd")'),
  responsible: randomItem(RANDOM_NAMES),
  status: randomItem(['unrectified', 'rectifying', 'rectified', 'rectified']),
  attachments: randomInt(0, 3)
}))

const violations = Array.from({ length: 56 }, (_, i) => ({
  id: 'VIO' + String(40001 + i),
  type: randomItem(VIOLATION_TYPES),
  person: randomItem(RANDOM_NAMES),
  trade: randomItem(['钢筋工', '木工', '电工', '架子工']),
  location: randomItem(['1#楼 12F', '2#楼 8F', '基坑南侧', '生活区', '材料堆场']),
  time: Mock.mock('@datetime("2026-05-dd HH:mm:ss")'),
  source: randomItem(['AI 摄像头', '人工巡查', '群众举报']),
  severity: randomItem(['low', 'mid', 'high']),
  status: randomItem(['rectifying', 'rectified', 'unrectified'])
}))

const scores = Array.from({ length: 14 }, (_, i) => ({
  id: 'SC' + String(50001 + i),
  date: Mock.mock('@date("2026-MM-dd")'),
  category: randomItem(['安全管理', '文明施工', '质量管理', '人员管理']),
  reason: randomItem(['未及时整改', '人员违章操作', '资料缺失', '夜间施工噪声超标', '扬尘超标']),
  score: -randomInt(1, 5),
  cumulative: 100 - randomInt(0, 18),
  source: '省建设监管平台'
}))

function paged(list, opt) {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const keyword = u.get('keyword') || ''
  let filtered = list
  if (keyword) {
    const q = keyword.toLowerCase()
    filtered = list.filter(it => JSON.stringify(it).toLowerCase().includes(q))
  }
  const start = (page - 1) * pageSize
  return { total: filtered.length, list: filtered.slice(start, start + pageSize) }
}

Mock.mock(/\/api\/v1\/supervision\/inspection.*/, 'get', opt => ({ code: 0, data: paged(inspections, opt) }))
Mock.mock(/\/api\/v1\/supervision\/rectify.*/, 'get', opt => ({ code: 0, data: paged(rectifies, opt) }))
Mock.mock(/\/api\/v1\/supervision\/violation.*/, 'get', opt => ({ code: 0, data: paged(violations, opt) }))
Mock.mock(/\/api\/v1\/supervision\/score.*/, 'get', opt => ({ code: 0, data: paged(scores, opt) }))
