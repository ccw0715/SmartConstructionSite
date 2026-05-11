// 全局字典 - 各模块共用枚举集中管理

export const TRADE_TYPES = ['钢筋工', '木工', '混凝土工', '电工', '焊工', '架子工', '塔吊司机', '普工']
export const TEAMS = ['张工班组', '李师傅班组', '王工班组', '赵师傅班组', '孙工班组', '钱师傅班组']
export const SUBJECTS = ['建设单位', '施工单位', '监理单位', '设计单位', '勘察单位']
export const POSITIONS = ['项目经理', '项目总工', '安全员', '质量员', '施工员', '资料员', '材料员', '造价员']
export const VIOLATION_TYPES = ['未戴安全帽', '未系安全带', '吸烟', '高空抛物', '违规用电', '未持证上岗']
export const SEVERITY = [
  { value: 'low',  label: '一般' },
  { value: 'mid',  label: '较重' },
  { value: 'high', label: '严重' }
]
export const RECTIFY_STATUS = [
  { value: 'unrectified', label: '未整改' },
  { value: 'rectifying',  label: '整改中' },
  { value: 'rectified',   label: '已整改' }
]

export const RANDOM_NAMES = [
  '张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄敏','周涛','吴丹',
  '徐峰','孙雪','马超','朱琳','胡军','郭芳','何力','高翔','林杰','罗敏',
  '宋华','谢俊','韩冰','唐磊','冯波','邓超','曹阳','曾亮','彭飞','吕欣'
]
