import Mock from 'mockjs'
import { randomItem, randomInt } from '@/utils/format'

// 环境实时（24小时）
function genRealtimeEnv() {
  const points = []
  for (let h = 0; h < 24; h++) {
    points.push({
      time: String(h).padStart(2,'0') + ':00',
      pm25: randomInt(25, 90),
      pm10: randomInt(40, 130),
      tsp:  randomInt(80, 250),
      temp: randomInt(15, 32),
      humidity: randomInt(40, 85),
      noise: randomInt(50, 80),
      windSpeed: (randomInt(5, 35) / 10).toFixed(1)
    })
  }
  return points
}

const alarms = Array.from({ length: 36 }, (_, i) => ({
  id: 'AL' + String(60001 + i),
  type: randomItem(['PM2.5 超限', 'PM10 超限', '噪声超限', '温度异常']),
  value: randomInt(80, 180),
  threshold: randomItem([75, 100, 70]),
  time: Mock.mock('@datetime("2026-05-dd HH:mm:ss")'),
  device: randomItem(['#1 监测点', '#2 监测点', '#3 监测点']),
  status: randomItem(['warning', 'rectified', 'rectifying'])
}))

const rectifyRecords = Array.from({ length: 20 }, (_, i) => ({
  id: 'CR' + String(70001 + i),
  alarmId: 'AL' + String(60001 + i),
  type: randomItem(['扬尘整改', '噪声整改', '现场清理', '喷淋启动']),
  measure: randomItem(['开启喷淋', '停工降噪', '加湿降尘', '调度洒水车']),
  responsible: randomItem(['安全员李工', '安全员王工', '现场总监']),
  startTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  endTime: Mock.mock('@datetime("2026-05-dd HH:mm")'),
  status: randomItem(['rectified', 'rectifying', 'rectified'])
}))

Mock.mock('/api/v1/civilized/env/realtime', 'get', () => ({ code: 0, data: genRealtimeEnv() }))

Mock.mock('/api/v1/civilized/env/current', 'get', () => ({
  code: 0,
  data: {
    pm25: randomInt(30, 80),
    pm10: randomInt(50, 120),
    tsp:  randomInt(100, 220),
    temp: randomInt(18, 30),
    humidity: randomInt(50, 80),
    noise: randomInt(55, 75),
    windSpeed: (randomInt(8, 30) / 10).toFixed(1),
    windDirection: randomItem(['东风','南风','西风','北风','东南风','西南风']),
    updateTime: new Date().toISOString()
  }
}))

function paged(list, opt) {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const page = +u.get('page') || 1
  const pageSize = +u.get('pageSize') || 20
  const start = (page - 1) * pageSize
  return { total: list.length, list: list.slice(start, start + pageSize) }
}

Mock.mock(/\/api\/v1\/civilized\/alarm.*/, 'get', opt => ({ code: 0, data: paged(alarms, opt) }))
Mock.mock(/\/api\/v1\/civilized\/rectify.*/, 'get', opt => ({ code: 0, data: paged(rectifyRecords, opt) }))
