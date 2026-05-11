import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('scs_token') || '',
    username: localStorage.getItem('scs_username') || '',
    avatar: '',
    role: 'admin',
    project: {
      id: 'P-2024-001',
      name: '中建科技产业园 A 区项目',
      star: 4
    }
  }),
  actions: {
    login({ username }) {
      this.token = 'mock-token-' + Date.now()
      this.username = username
      localStorage.setItem('scs_token', this.token)
      localStorage.setItem('scs_username', username)
    },
    logout() {
      this.token = ''
      this.username = ''
      localStorage.removeItem('scs_token')
      localStorage.removeItem('scs_username')
    }
  }
})
