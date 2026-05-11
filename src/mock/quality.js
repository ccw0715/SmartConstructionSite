import Mock from 'mockjs'
import { randomItem, randomInt } from '@/utils/format'

const items = ['混凝土试块', '钢筋拉伸试验', '钢筋焊接试验', '回填土压实度', '保温材料导热', '防水卷材', '门窗气密性']

// 检测方案
const plans = Array.from({ length: 18 }, (_, i) => ({
  id: 'QP' + String(10001 + i),
  no: 'JCP-2026-' + String(101 + i),
  title: randomItem(items) + '检测方案',
  category: randomItem(['材料检测', '结构检测', '功能性检测']),
  reviewer: randomItem(['总工办', '监理部']),
  date: Mock.mock('@date("2026-MM-dd")'),
  reviewStatus: randomItem(['已批准', '审核中', '已批准', '已批准']),
  attachments: randomInt(1, 4)
}))

// 报告
const reports = Array.from({ length: 36 }, (_, i) => ({
  id: 'QR' + String(20001 + i),
  no: 'BG-2026-' + String(1001 + i),
  title: randomItem(items) + '检测报告',
  category: randomItem(['材料检测', '结构检测', '功能性检测']),
  institute: randomItem(['深圳建工检测中心', '广东建科检测', '华南检测院']),
  sampleNo: 'SP-' + String(2001 + i),
  result: randomItem(['合格', '合格', '合格', '不合格']),
  testDate: Mock.mock('@date("2026-MM-dd")'),
  attachments: 1
}))

// 计划
const schedules = Array.from({ length: 16 }, (_, i) => ({
  id: 'QS' + String(30001 + i),
  no: 'JH-2026-' + String(101 + i),
  category: randomItem(['材料检测', '结构检测', '功能性检测']),
  item: randomItem(items),
  expectedDate: Mock.mock('@date("2026-MM-dd")'),
  frequency: randomItem(['每批次', '每月', '每季', '专项']),
  responsible: randomItem(['李工', '王工', '陈工']),
  status: randomItem(['pending', 'active', 'done'])
}))

function paged(list, opt) {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const start = (page - 1) * pageSize
  return { total: list.length, list: list.slice(start, start + pageSize) }
}

Mock.mock(/\/api\/v1\/quality\/plan.*/, 'get', opt => ({ code: 0, data: paged(plans, opt) }))
Mock.mock(/\/api\/v1\/quality\/report.*/, 'get', opt => ({ code: 0, data: paged(reports, opt) }))
Mock.mock(/\/api\/v1\/quality\/schedule.*/, 'get', opt => ({ code: 0, data: paged(schedules, opt) }))

// 星级评定
Mock.mock('/api/v1/star/current', 'get', () => ({
  code: 0,
  data: {
    star: 4,
    score: 88.6,
    rank: '深圳市前 12%',
    issueDate: '2026-04-30',
    expireDate: '2026-12-31',
    issuer: '深圳市住房和建设局',
    dimensions: [
      { name: '工程质量', score: 92 },
      { name: '安全管理', score: 86 },
      { name: '文明施工', score: 90 },
      { name: '人员管理', score: 88 },
      { name: '设备运维', score: 87 },
      { name: '资料归档', score: 88 }
    ],
    history: [
      { date: '2025-04', star: 3, score: 78.2 },
      { date: '2025-07', star: 3, score: 81.5 },
      { date: '2025-10', star: 4, score: 85.0 },
      { date: '2026-01', star: 4, score: 86.8 },
      { date: '2026-04', star: 4, score: 88.6 }
    ]
  }
}))
