<template>
  <PageContainer flat>
    <el-empty :description="`「${title}」页面 - 待实现`" :image-size="120">
      <template #description>
        <div style="margin-top: 8px;">
          <div style="font-size: 16px; color: #1f2329; font-weight: 500;">{{ title }}</div>
          <div style="color: #86909c; font-size: 13px; margin-top: 6px;">
            此页面在后续批次实现 · 路由 {{ $route.path }}
          </div>
        </div>
      </template>
      <el-button type="primary" plain @click="$router.push('/admin/dashboard')">返回工作台</el-button>
    </el-empty>
  </PageContainer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const title = computed(() => route.meta?.title || '页面')
</script>
