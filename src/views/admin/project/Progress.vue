<template>
  <PageContainer title="形象进度" desc="工程各阶段实施进度与节点">
    <template #header>
      <el-button type="primary" :icon="Plus">新增阶段</el-button>
    </template>

    <el-row :gutter="16" class="mb-24">
      <el-col :sm="8" v-for="kpi in kpis" :key="kpi.label">
        <div class="mini-card">
          <div class="mini-value">{{ kpi.value }}<span class="mini-unit">{{ kpi.unit }}</span></div>
          <div class="mini-label">{{ kpi.label }}</div>
        </div>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div class="flex-between">
          <span class="fw-500">阶段时间轴</span>
          <span class="text-muted fs-12">整体进度：{{ overall }}%</span>
        </div>
      </template>
      <el-skeleton :rows="3" v-if="loading" />
      <el-timeline v-else>
        <el-timeline-item
          v-for="item in list"
          :key="item.stage"
          :type="timelineType(item.status)"
          :hollow="item.status === 'pending'"
          :timestamp="`${item.start} ~ ${item.end}`"
          placement="top"
        >
          <el-card shadow="never" class="stage-card">
            <div class="flex-between mb-8">
              <span class="fw-600 fs-16">{{ item.stage }}</span>
              <StatusTag :status="item.status" />
            </div>
            <div class="text-muted mb-12">{{ item.desc || '暂无描述' }}</div>
            <el-progress :percentage="item.progress" :stroke-width="10" :status="progressStatus(item.status)" />
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const loading = ref(true)
const list = ref([])

async function load() {
  loading.value = true
  const { data } = await request.get('/project/progress')
  list.value = data
  loading.value = false
}

const overall = computed(() => {
  if (!list.value.length) return 0
  const total = list.value.reduce((sum, i) => sum + i.progress, 0)
  return Math.round(total / list.value.length)
})

const kpis = computed(() => ([
  { label: '总阶段数', value: list.value.length, unit: ' 个' },
  { label: '已完成', value: list.value.filter(i => i.status === 'done').length, unit: ' 个' },
  { label: '整体进度', value: overall.value, unit: ' %' }
]))

function timelineType(s) {
  return { done: 'success', active: 'primary', pending: 'info' }[s] || 'info'
}
function progressStatus(s) {
  return { done: 'success', active: '', pending: 'warning' }[s]
}

onMounted(load)
</script>

<style lang="scss" scoped>
.mini-card {
  background: #fafbfc; border-radius: 6px; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 4px;
  border: 1px solid #e5e6eb;
}
.mini-value { font-size: 22px; font-weight: 600; color: #1f2329; line-height: 1; }
.mini-unit  { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 4px; }
.mini-label { font-size: 13px; color: #4e5969; }
.stage-card { background: #fafbfc; border: 1px solid #e5e6eb; }
</style>
