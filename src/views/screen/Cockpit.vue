<template>
  <div class="cockpit">
    <div class="content">
      <h1>智慧工地驾驶舱</h1>
      <p>大屏可视化模块将在第四批实现</p>
      <el-button type="primary" plain @click="$router.push('/admin/dashboard')">返回后台</el-button>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.cockpit {
  height: 100vh;
  background: #0a1530;
  color: #d9e6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(78,232,255,0.15) 0, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(22,119,255,0.25) 0, transparent 40%);
}
.content {
  text-align: center;
  h1 { font-size: 42px; letter-spacing: 4px; margin: 0 0 12px; }
  p { color: #8da3c8; margin: 0 0 24px; }
}
</style>
