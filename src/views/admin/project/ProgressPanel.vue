<template>
  <div class="progress-panel">
    <el-row :gutter="16" class="kpi-row">
      <el-col :sm="8" v-for="kpi in kpis" :key="kpi.label">
        <div class="mini-card">
          <div class="mini-value">{{ kpi.value }}<span class="mini-unit">{{ kpi.unit }}</span></div>
          <div class="mini-label">{{ kpi.label }}</div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never" class="timeline-card">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const props = defineProps({
  projectId: { type: String, required: true }
})

const loading = ref(true)
const list = ref([])

async function load() {
  loading.value = true
  const { data } = await request.get(`/project/progress/${props.projectId}`)
  list.value = data
  loading.value = false
}

const overall = computed(() => {
  if (!list.value.length) return 0
  return Math.round(list.value.reduce((s, i) => s + i.progress, 0) / list.value.length)
})

const kpis = computed(() => ([
  { label: '总阶段数', value: list.value.length, unit: ' 个' },
  { label: '已完成', value: list.value.filter(i => i.status === 'done').length, unit: ' 个' },
  { label: '整体进度', value: overall.value, unit: ' %' }
]))

function timelineType(s) { return { done: 'success', active: 'primary', pending: 'info' }[s] || 'info' }
function progressStatus(s) { return { done: 'success', active: '', pending: 'warning' }[s] }

watch(() => props.projectId, load, { immediate: true })
</script>

<style lang="scss" scoped>
.progress-panel { display: flex; flex-direction: column; gap: 16px; }
.kpi-row { margin: 0; }
.mini-card {
  background: #fafbfc; border-radius: 6px; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 4px;
  border: 1px solid #e5e6eb;
}
.mini-value { font-size: 22px; font-weight: 600; color: #1f2329; line-height: 1; }
.mini-unit  { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 4px; }
.mini-label { font-size: 13px; color: #4e5969; }
.stage-card { background: #fafbfc; border: 1px solid #e5e6eb; }
.timeline-card :deep(.el-card__body) { padding: 16px 20px; }
</style>
