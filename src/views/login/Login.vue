<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">
          <el-icon size="32" color="#fff"><OfficeBuilding /></el-icon>
        </div>
        <div>
          <div class="brand-title">智慧工地管理系统</div>
          <div class="brand-sub">Smart Construction Site Platform</div>
        </div>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" size="large" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password />
        </el-form-item>
        <div class="form-row">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <a class="link">忘记密码？</a>
        </div>
        <el-button type="primary" size="large" :loading="loading" @click="onSubmit" style="width:100%;height:42px;">
          登 录
        </el-button>
        <div class="tips">提示：输入任意账号密码即可登录（演示版）</div>
      </el-form>
    </div>
    <div class="footer">© 2026 智慧工地系统 · Demo</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: 'admin', password: '123456', remember: true })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const formRef = ref(null)
const loading = ref(false)

async function onSubmit() {
  await formRef.value.validate()
  loading.value = true
  setTimeout(() => {
    userStore.login({ username: form.username })
    loading.value = false
    ElMessage.success('登录成功')
    router.push('/admin/dashboard')
  }, 500)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.login-bg {
  position: absolute; inset: 0;
  background: linear-gradient(120deg, #0a2e5e 0%, #1677ff 60%, #4ee8ff 100%);
  &::after {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0, transparent 35%),
      radial-gradient(circle at 80% 70%, rgba(78,232,255,0.25) 0, transparent 40%);
  }
}
.login-card {
  position: relative;
  width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 36px 40px 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.brand {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 24px;
}
.brand-icon {
  width: 52px; height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, $primary, #4ee8ff);
  display: flex; align-items: center; justify-content: center;
}
.brand-title { font-size: 20px; font-weight: 600; color: $text-primary; }
.brand-sub   { font-size: 12px; color: $text-muted; margin-top: 2px; }

.login-form { margin-top: 8px; }
.form-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}
.link { color: $primary; cursor: pointer; font-size: 13px; }
.tips { margin-top: 12px; text-align: center; color: $text-muted; font-size: 12px; }

.footer {
  position: absolute; bottom: 16px; width: 100%;
  text-align: center; color: rgba(255,255,255,0.6); font-size: 12px;
}
</style>
