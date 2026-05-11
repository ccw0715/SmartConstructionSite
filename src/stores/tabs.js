import { defineStore } from 'pinia'

// 标签页 store：管理顶部多标签（仿后台常见用法）
export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabs: [{ path: '/admin/dashboard', title: '工作台', closable: false }],
    active: '/admin/dashboard'
  }),
  actions: {
    open(route) {
      if (route.path === '/admin/dashboard') {
        this.active = route.path
        return
      }
      if (!this.tabs.find(t => t.path === route.path)) {
        this.tabs.push({
          path: route.path,
          title: route.meta?.title || '未命名',
          closable: true
        })
      }
      this.active = route.path
    },
    close(path) {
      const idx = this.tabs.findIndex(t => t.path === path)
      if (idx < 0) return null
      this.tabs.splice(idx, 1)
      if (this.active === path) {
        const next = this.tabs[idx] || this.tabs[idx - 1] || this.tabs[0]
        this.active = next.path
        return next.path
      }
      return null
    },
    closeOthers(path) {
      this.tabs = this.tabs.filter(t => !t.closable || t.path === path)
      this.active = path
    },
    closeAll() {
      this.tabs = this.tabs.filter(t => !t.closable)
      this.active = '/admin/dashboard'
    }
  }
})
