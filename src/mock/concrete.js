import Mock from 'mockjs'
import { randomItem, randomInt } from '@/utils/format'

const grades = ['C30', 'C35', 'C40', 'C45', 'C50']
const sites = ['1#楼基础', '1#楼-1F~5F', '1#楼-6F~12F', '2#楼基础', '2#楼-1F~5F', '地下车库']

// 生产
const produces = Array.from({ length: 32 }, (_, i) => ({
  id: 'PD' + String(10001 + i),
  ticket: 'C-2026-' + String(1001 + i),
  grade: randomItem(grades),
  supplier: randomItem(['南方混凝土', '建材股份', '永盛混凝土']),
  station: randomItem(['1 号搅拌站', '2 号搅拌站']),
  quantity: (randomInt(50, 150) / 10).toFixed(1),
  produceTime: Mock.mock('@datetime("2026-05-dd HH:mm:ss")'),
  qualityResult: randomItem(['合格', '合格', '合格', '待检']),
  status: 'done'
}))

// 运输
const transports = Array.from({ length: 28 }, (_, i) => ({
  id: 'TR' + String(20001 + i),
  ticket: 'C-2026-' + String(1001 + i),
  vehicleNo: '粤B·' + Mock.mock(/[A-Z][0-9]{4}/),
  driver: randomItem(['李司机', '王司机', '陈司机', '赵司机']),
  grade: randomItem(grades),
  quantity: (randomInt(50, 150) / 10).toFixed(1),
  startTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  arriveTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  duration: randomInt(20, 80),
  temperature: randomInt(15, 28),
  status: randomItem(['done', 'done', 'active'])
}))

// 浇筑
const pours = Array.from({ length: 16 }, (_, i) => ({
  id: 'PR' + String(30001 + i),
  no: 'PZ-2026-' + String(101 + i),
  site: randomItem(sites),
  grade: randomItem(grades),
  plannedQty: randomInt(80, 200),
  actualQty: randomInt(80, 200),
  startTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  endTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  pourMethod: randomItem(['泵送', '塔吊吊运', '溜槽']),
  supervisor: randomItem(['李监理', '王监理']),
  status: randomItem(['done', 'active', 'pending'])
}))

// 监测（同条试块对应的强度发展曲线 - 在详情用）
const monitors = Array.from({ length: 20 }, (_, i) => ({
  id: 'MN' + String(40001 + i),
  sample: 'SP-2026-' + String(101 + i),
  site: randomItem(sites),
  grade: randomItem(grades),
  age3: randomInt(8, 18),
  age7: randomInt(18, 30),
  age28: randomInt(30, 55),
  designStrength: 30,
  result: randomItem(['合格', '合格', '合格', '复检']),
  reportDate: Mock.mock('@date("2026-MM-dd")')
}))

function paged(list, opt) {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const start = (page - 1) * pageSize
  return { total: list.length, list: list.slice(start, start + pageSize) }
}

Mock.mock(/\/api\/v1\/concrete\/produce.*/, 'get', opt => ({ code: 0, data: paged(produces, opt) }))
Mock.mock(/\/api\/v1\/concrete\/transport.*/, 'get', opt => ({ code: 0, data: paged(transports, opt) }))
Mock.mock(/\/api\/v1\/concrete\/pour.*/, 'get', opt => ({ code: 0, data: paged(pours, opt) }))
Mock.mock(/\/api\/v1\/concrete\/monitor.*/, 'get', opt => ({ code: 0, data: paged(monitors, opt) }))
