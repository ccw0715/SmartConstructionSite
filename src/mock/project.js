import Mock from 'mockjs'
import { SUBJECTS } from '@/utils/dict'
import { randomItem, randomInt } from '@/utils/format'

// 多项目列表
const PROJECTS = [
  {
    id: 'PRJ-001',
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
    contractNo: 'HT-2024-0312-001',
    manager: '张工',
    status: 'active',
    star: 4
  },
  {
    id: 'PRJ-002',
    name: '深圳湾国际金融中心',
    code: 'SZW-IFC-2024',
    type: '房屋建筑工程',
    level: '特类',
    area: 156000,
    storeyAbove: 58,
    storeyBelow: 5,
    investment: 68000,
    startDate: '2024-06-01',
    endDate: '2028-12-30',
    address: '广东省深圳市福田区滨海大道',
    description: '超高层综合性商务地标，含办公塔楼、商业裙楼、五星级酒店。',
    contractNo: 'HT-2024-0601-002',
    manager: '李工',
    status: 'active',
    star: 5
  },
  {
    id: 'PRJ-003',
    name: '光明科学城基础设施工程',
    code: 'GMKXC-INFRA-2024',
    type: '市政工程',
    level: '一类',
    area: 45000,
    storeyAbove: 0,
    storeyBelow: 0,
    investment: 12500,
    startDate: '2024-09-01',
    endDate: '2026-06-30',
    address: '广东省深圳市光明区',
    description: '光明科学城配套道路、管网、桥梁市政设施建设。',
    contractNo: 'HT-2024-0901-003',
    manager: '王工',
    status: 'active',
    star: 3
  },
  {
    id: 'PRJ-004',
    name: '前海保税港区改造工程',
    code: 'QH-BSP-2025',
    type: '装饰装修',
    level: '二类',
    area: 28000,
    storeyAbove: 4,
    storeyBelow: 1,
    investment: 5800,
    startDate: '2025-02-15',
    endDate: '2026-05-30',
    address: '广东省深圳市南山区前海合作区',
    description: '保税港区办公楼内外装饰改造与机电更新。',
    contractNo: 'HT-2025-0215-004',
    manager: '陈工',
    status: 'active',
    star: 3
  },
  {
    id: 'PRJ-005',
    name: '宝安人才安居房 B 区',
    code: 'BA-RC-B-2023',
    type: '房屋建筑工程',
    level: '一类',
    area: 92000,
    storeyAbove: 28,
    storeyBelow: 2,
    investment: 22000,
    startDate: '2023-05-10',
    endDate: '2025-08-30',
    address: '广东省深圳市宝安区',
    description: '人才安居保障性住房，含住宅与社区配套。',
    contractNo: 'HT-2023-0510-005',
    manager: '赵工',
    status: 'done',
    star: 4
  }
]

// 每个项目的进度阶段（按项目 id 索引；未定义则用默认）
const DEFAULT_PROGRESS = [
  { stage: '前期准备', start: '2024-03-12', end: '2024-04-30', status: 'done',    progress: 100, desc: '完成土方开挖、桩基施工' },
  { stage: '基础工程', start: '2024-05-01', end: '2024-08-15', status: 'done',    progress: 100, desc: '基础筏板浇筑完成' },
  { stage: '主体结构', start: '2024-08-16', end: '2025-12-30', status: 'active',  progress: 62,  desc: '当前施工至 20 层' },
  { stage: '机电安装', start: '2025-06-01', end: '2026-06-30', status: 'pending', progress: 18,  desc: '配合主体进行预埋' },
  { stage: '装饰装修', start: '2026-01-01', end: '2026-09-30', status: 'pending', progress: 0,   desc: '' },
  { stage: '竣工验收', start: '2026-10-01', end: '2026-12-30', status: 'pending', progress: 0,   desc: '' }
]
const PROGRESS_BY_ID = {
  'PRJ-005': [
    { stage: '前期准备', start: '2023-05-10', end: '2023-06-30', status: 'done', progress: 100, desc: '土方与基坑完成' },
    { stage: '基础工程', start: '2023-07-01', end: '2023-10-15', status: 'done', progress: 100, desc: '基础完成' },
    { stage: '主体结构', start: '2023-10-16', end: '2024-12-30', status: 'done', progress: 100, desc: '主体封顶' },
    { stage: '机电安装', start: '2024-08-01', end: '2025-05-30', status: 'done', progress: 100, desc: '机电完工' },
    { stage: '装饰装修', start: '2025-02-01', end: '2025-07-30', status: 'done', progress: 100, desc: '装修完工' },
    { stage: '竣工验收', start: '2025-08-01', end: '2025-08-30', status: 'done', progress: 100, desc: '已通过竣工验收' }
  ]
}

// 五方主体（每个项目独立）
function genParties(seed) {
  return SUBJECTS.map((s, i) => ({
    id: `${seed}-P${1000 + i}`,
    type: s,
    company: ['深圳建工集团', '中建三局', '广东建科', '华南设计院', '南方勘察院'][i],
    legalPerson: ['张总', '李总', '王总', '赵总', '孙总'][i],
    contact: ['张经理', '李经理', '王经理', '赵经理', '孙经理'][i],
    phone: Mock.mock('@phone'),
    certNo: Mock.mock(/[A-Z]{2}\d{12}/),
    joinDate: ['2024-02-01', '2024-02-15', '2024-02-20', '2024-01-10', '2024-01-20'][i]
  }))
}
const PARTIES_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, genParties(p.id)]))

// ===== Mock 接口 =====

// 项目列表
Mock.mock(/\/api\/v1\/project\/list.*/, 'get', opt => {
  const qs = opt.url.split('?')[1] || ''
  const u = new URLSearchParams(qs)
  const keyword = (u.get('keyword') || '').toLowerCase()
  const type = u.get('type') || ''
  const status = u.get('status') || ''
  let list = PROJECTS
  if (keyword) list = list.filter(p => (p.name + p.code + p.manager).toLowerCase().includes(keyword))
  if (type) list = list.filter(p => p.type === type)
  if (status) list = list.filter(p => p.status === status)
  return { code: 0, data: { total: list.length, list } }
})

// 项目详情
Mock.mock(/\/api\/v1\/project\/detail\/.*/, 'get', opt => {
  const id = opt.url.split('/').pop().split('?')[0]
  const data = PROJECTS.find(p => p.id === id) || PROJECTS[0]
  return { code: 0, data }
})

// 进度
Mock.mock(/\/api\/v1\/project\/progress\/.*/, 'get', opt => {
  const id = opt.url.split('/').pop().split('?')[0]
  return { code: 0, data: PROGRESS_BY_ID[id] || DEFAULT_PROGRESS }
})

// 五方主体
Mock.mock(/\/api\/v1\/project\/parties\/.*/, 'get', opt => {
  const id = opt.url.split('/').pop().split('?')[0]
  return { code: 0, data: PARTIES_BY_ID[id] || genParties(id) }
})

// 兼容旧接口（首页 Dashboard 等可能仍在调用）
Mock.mock('/api/v1/project/info', 'get', () => ({ code: 0, data: PROJECTS[0] }))
Mock.mock('/api/v1/project/progress', 'get', () => ({ code: 0, data: DEFAULT_PROGRESS }))
Mock.mock('/api/v1/project/parties', 'get', () => ({ code: 0, data: PARTIES_BY_ID['PRJ-001'] }))
