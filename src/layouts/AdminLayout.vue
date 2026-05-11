<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed }">
      <div class="logo">
        <div class="logo-icon">
          <el-icon size="22" color="#fff"><OfficeBuilding /></el-icon>
        </div>
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">智慧工地</span>
        </transition>
      </div>
      <el-scrollbar class="menu-scroll">
        <el-menu
          :default-active="activeMenu"
          :collapse="collapsed"
          :unique-opened="true"
          background-color="#001529"
          text-color="#c8d4e3"
          active-text-color="#ffffff"
          router
        >
          <template v-for="m in menus" :key="m.title">
            <el-sub-menu v-if="m.children" :index="m.title">
              <template #title>
                <el-icon><component :is="m.icon" /></el-icon>
                <span>{{ m.title }}</span>
              </template>
              <el-menu-item v-for="c in m.children" :key="c.path" :index="c.path">
                {{ c.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="m.path">
              <el-icon><component :is="m.icon" /></el-icon>
              <template #title>{{ m.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- 主区 -->
    <div class="main">
      <!-- 顶栏 -->
      <header class="header">
        <div class="header-left">
          <el-icon class="fold-btn" @click="collapsed = !collapsed">
            <Fold v-if="!collapsed" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(b,i) in breadcrumb" :key="i">{{ b }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-tooltip content="搜索 (Ctrl+K)">
            <el-icon class="ico-btn"><Search /></el-icon>
          </el-tooltip>
          <el-tooltip content="进入大屏驾驶舱">
            <el-icon class="ico-btn" @click="goScreen"><Monitor /></el-icon>
          </el-tooltip>
          <el-badge :value="3" class="msg-badge">
            <el-icon class="ico-btn"><Bell /></el-icon>
          </el-badge>
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="28" style="background:#1677ff">{{ avatarText }}</el-avatar>
              <span class="username">{{ user.username || 'admin' }}</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>当前项目：{{ user.project.name }}</el-dropdown-item>
                <el-dropdown-item divided @click="onLogout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 标签页 -->
      <div class="tabs-bar">
        <el-tabs
          v-model="tabsStore.active"
          type="card"
          closable
          @tab-click="onTabClick"
          @tab-remove="onTabRemove"
        >
          <el-tab-pane
            v-for="t in tabsStore.tabs"
            :key="t.path"
            :name="t.path"
            :label="t.title"
            :closable="t.closable"
          />
        </el-tabs>
        <el-dropdown trigger="click" @command="onTabCmd">
          <el-button text size="small">
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="others">关闭其他</el-dropdown-item>
              <el-dropdown-item command="all">关闭全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 内容区 -->
      <main class="content">
        <router-view v-slot="{ Component }">
          <keep-alive :max="10">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTabsStore } from '@/stores/tabs'
import { menus } from '@/router/menu'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const tabsStore = useTabsStore()
const collapsed = ref(false)

const activeMenu = computed(() => route.path)
const avatarText = computed(() => (user.username || 'A').slice(0, 1).toUpperCase())

const breadcrumb = computed(() => {
  const arr = []
  if (route.meta?.parentTitle) arr.push(route.meta.parentTitle)
  arr.push(route.meta?.title || '页面')
  return arr
})

function onLogout() {
  user.logout()
  router.push('/login')
}

function goScreen() {
  const url = router.resolve('/screen').href
  window.open(url, '_blank')
}

function onTabClick(tab) {
  router.push(tab.props.name)
}

function onTabRemove(path) {
  const next = tabsStore.close(path)
  if (next) router.push(next)
}

function onTabCmd(cmd) {
  if (cmd === 'others') tabsStore.closeOthers(route.path)
  if (cmd === 'all') {
    tabsStore.closeAll()
    router.push('/admin/dashboard')
  }
}

watch(
  () => route.path,
  () => tabsStore.open(route),
  { immediate: true }
)

onMounted(() => {
  // 全局快捷键 Ctrl+K 占位
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: $bg-sidebar;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  &.collapsed { width: 64px; }
}
.logo {
  height: 56px;
  display: flex; align-items: center; gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.logo-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, $primary, #4ee8ff);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.logo-text { color: #fff; font-size: 16px; font-weight: 600; }
.menu-scroll { flex: 1; }

:deep(.el-menu) { border-right: 0; }
:deep(.el-menu-item.is-active) {
  background: $primary !important;
  &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #4ee8ff; }
}
:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background: $bg-sidebar-hover !important;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: $bg-body;
}
.header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid $border-light;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
}
.header-left { display: flex; align-items: center; gap: 18px; }
.fold-btn { font-size: 18px; cursor: pointer; color: $text-secondary; }
.fold-btn:hover { color: $primary; }

.header-right { display: flex; align-items: center; gap: 18px; }
.ico-btn { font-size: 18px; color: $text-secondary; cursor: pointer; }
.ico-btn:hover { color: $primary; }
.msg-badge :deep(.el-badge__content) { top: 2px; right: 6px; }
.user-info {
  display: flex; align-items: center; gap: 6px;
  cursor: pointer; padding: 4px 6px; border-radius: 6px;
  &:hover { background: $bg-body; }
}
.username { font-size: 13px; color: $text-primary; }

.tabs-bar {
  background: #fff;
  display: flex; align-items: center; padding: 0 12px 0 16px;
  border-bottom: 1px solid $border-light;
  :deep(.el-tabs) { flex: 1; }
  :deep(.el-tabs__header) { margin: 0; border: 0; }
  :deep(.el-tabs__nav) { border: 0 !important; }
  :deep(.el-tabs__item) {
    height: 36px; line-height: 36px; border: 1px solid $border-light !important;
    border-radius: 4px; margin-right: 6px; margin-top: 6px;
    background: #fafafa; font-size: 13px;
  }
  :deep(.el-tabs__item.is-active) {
    background: $primary; color: #fff !important; border-color: $primary !important;
    .el-icon { color: #fff !important; }
  }
}

.content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
