import Mock from 'mockjs'

Mock.setup({ timeout: '150-400' })

// 各模块 mock
import './project'
import './staff'
import './supervision'
import './civilized'
import './device'
import './hazard'
import './concrete'
import './quality'

// dashboard 概要
Mock.mock('/api/v1/dashboard/summary', 'get', () => ({
  code: 0,
  data: {
    onSiteWorkers: 286,
    alarmsToday: 4,
    onlineDevices: 38,
    progress: 62
  }
}))

export default Mock
