import Mock from 'mockjs'
import { SUBJECTS } from '@/utils/dict'

const projectInfo = {
  name: '中建科技产业园 A 区项目',
  code: 'ZJKJ-CYY-A-2024',
  type: '房屋建筑工程',
  level: '一类',
  area: 86500,
  storeyAbove: 32,
  storeyBelow: 3,
  investment: 28600,
  startDate: '2024-03-12',
  endDate: '2026-12-30',
  address: '广东省深圳市南山区科技园南区',
  description: '本项目为综合性产业园，包含 4 栋办公楼及配套商业，总建筑面积 8.65 万平方米，总投资约 2.86 亿元。',
  contractNo: 'HT-2024-0312-001'
}

const progressList = [
  { stage: '前期准备',   start: '2024-03-12', end: '2024-04-30', status: 'done',    progress: 100, desc: '完成土方开挖、桩基施工' },
  { stage: '基础工程',   start: '2024-05-01', end: '2024-08-15', status: 'done',    progress: 100, desc: '基础筏板浇筑完成' },
  { stage: '主体结构',   start: '2024-08-16', end: '2025-12-30', status: 'active',  progress: 62,  desc: '当前施工至 20 层' },
  { stage: '机电安装',   start: '2025-06-01', end: '2026-06-30', status: 'pending', progress: 18,  desc: '配合主体进行预埋' },
  { stage: '装饰装修',   start: '2026-01-01', end: '2026-09-30', status: 'pending', progress: 0,   desc: '' },
  { stage: '竣工验收',   start: '2026-10-01', end: '2026-12-30', status: 'pending', progress: 0,   desc: '' }
]

const parties = SUBJECTS.map((s, i) => ({
  id: `P${1000 + i}`,
  type: s,
  company: ['深圳建工集团', '中建三局', '广东建科', '华南设计院', '南方勘察院'][i],
  legalPerson: ['张总', '李总', '王总', '赵总', '孙总'][i],
  contact: ['张经理', '李经理', '王经理', '赵经理', '孙经理'][i],
  phone: Mock.mock('@phone'),
  certNo: Mock.mock(/[A-Z]{2}\d{12}/),
  joinDate: ['2024-02-01', '2024-02-15', '2024-02-20', '2024-01-10', '2024-01-20'][i]
}))

Mock.mock('/api/v1/project/info', 'get', () => ({ code: 0, data: projectInfo }))
Mock.mock('/api/v1/project/progress', 'get', () => ({ code: 0, data: progressList }))
Mock.mock('/api/v1/project/parties', 'get', () => ({ code: 0, data: parties }))
