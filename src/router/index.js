import { createRouter, createWebHashHistory } from 'vue-router'
import { menus } from './menu'

const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const Placeholder = () => import('@/views/admin/_placeholder/Placeholder.vue')

// 把 menu 平铺成动态路由
function flattenMenu(items) {
  const list = []
  items.forEach(m => {
    if (m.children && m.children.length) {
      m.children.forEach(c => list.push({ path: c.path, title: c.title, parentTitle: m.title }))
    } else if (m.path) {
      list.push({ path: m.path, title: m.title })
    }
  })
  return list
}

// 第一批阶段：除已实现的页面外，其余菜单都先指向占位页（Placeholder）
// 后续每批替换 component 为真实页面，路由结构不变
const realPages = {
  '/admin/dashboard': () => import('@/views/admin/dashboard/Dashboard.vue'),

  // 工程信息
  '/admin/project/info':     () => import('@/views/admin/project/Info.vue'),
  '/admin/project/progress': () => import('@/views/admin/project/Progress.vue'),
  '/admin/project/parties':  () => import('@/views/admin/project/Parties.vue'),

  // 人员管理
  '/admin/staff/manager':    () => import('@/views/admin/staff/Manager.vue'),
  '/admin/staff/team':       () => import('@/views/admin/staff/Team.vue'),
  '/admin/staff/worker':     () => import('@/views/admin/staff/Worker.vue'),
  '/admin/staff/attendance': () => import('@/views/admin/staff/Attendance.vue'),

  // 融合监督
  '/admin/supervision/inspection': () => import('@/views/admin/supervision/Inspection.vue'),
  '/admin/supervision/rectify':    () => import('@/views/admin/supervision/Rectify.vue'),
  '/admin/supervision/violation':  () => import('@/views/admin/supervision/Violation.vue'),
  '/admin/supervision/score':      () => import('@/views/admin/supervision/Score.vue'),

  // 文明施工
  '/admin/civilized/env':     () => import('@/views/admin/civilized/Env.vue'),
  '/admin/civilized/noise':   () => import('@/views/admin/civilized/Noise.vue'),
  '/admin/civilized/alarm':   () => import('@/views/admin/civilized/Alarm.vue'),
  '/admin/civilized/rectify': () => import('@/views/admin/civilized/Rectify.vue'),

  // 视频监管
  '/admin/video/supervisor': () => import('@/views/admin/video/Supervisor.vue'),
  '/admin/video/site':       () => import('@/views/admin/video/Site.vue'),

  // 重大危险源
  '/admin/hazard/danger': () => import('@/views/admin/hazard/Danger.vue'),
  '/admin/hazard/crane':  () => import('@/views/admin/hazard/Crane.vue'),
  '/admin/hazard/pit':    () => import('@/views/admin/hazard/Pit.vue'),

  // 混凝土监管
  '/admin/concrete/produce':   () => import('@/views/admin/concrete/Produce.vue'),
  '/admin/concrete/transport': () => import('@/views/admin/concrete/Transport.vue'),
  '/admin/concrete/pour':      () => import('@/views/admin/concrete/Pour.vue'),
  '/admin/concrete/monitor':   () => import('@/views/admin/concrete/Monitor.vue'),

  // 质量检测
  '/admin/quality/plan':     () => import('@/views/admin/quality/Plan.vue'),
  '/admin/quality/report':   () => import('@/views/admin/quality/Report.vue'),
  '/admin/quality/schedule': () => import('@/views/admin/quality/Schedule.vue'),

  // BIM
  '/admin/bim': () => import('@/views/admin/bim/Bim.vue'),

  // 设备集成
  '/admin/device/overview':   () => import('@/views/admin/device/Overview.vue'),
  '/admin/device/tower':      () => import('@/views/admin/device/Tower.vue'),
  '/admin/device/nvr':        () => import('@/views/admin/device/Nvr.vue'),
  '/admin/device/lift':       () => import('@/views/admin/device/Lift.vue'),
  '/admin/device/gate':       () => import('@/views/admin/device/Gate.vue'),
  '/admin/device/helmet':     () => import('@/views/admin/device/Helmet.vue'),
  '/admin/device/fence':      () => import('@/views/admin/device/Fence.vue'),
  '/admin/device/broadcast':  () => import('@/views/admin/device/Broadcast.vue'),
  '/admin/device/water':      () => import('@/views/admin/device/Water.vue'),
  '/admin/device/electric':   () => import('@/views/admin/device/Electric.vue'),
  '/admin/device/env-sensor': () => import('@/views/admin/device/EnvSensor.vue'),
  '/admin/device/sprinkler':  () => import('@/views/admin/device/Sprinkler.vue'),
  '/admin/device/smoke':      () => import('@/views/admin/device/Smoke.vue'),
  '/admin/device/aicamera':   () => import('@/views/admin/device/AiCamera.vue'),

  // 星级评定
  '/admin/star': () => import('@/views/admin/star/Star.vue')
}

const dynamicRoutes = flattenMenu(menus).map(item => ({
  path: item.path,
  name: item.path,
  component: realPages[item.path] || Placeholder,
  meta: { title: item.title, parentTitle: item.parentTitle }
}))

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: dynamicRoutes
  },
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/Cockpit.vue'),
    meta: { title: '智慧工地驾驶舱' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin/dashboard'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} · 智慧工地系统` : '智慧工地系统'
  const isLogin = localStorage.getItem('scs_token')
  if (to.path !== '/login' && !isLogin) {
    return next('/login')
  }
  next()
})

export default router
