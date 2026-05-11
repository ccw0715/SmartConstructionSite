<template>
  <PageContainer title="AI 摄像头" desc="基于 AI 算法的智能识别（未戴安全帽、区域入侵、吸烟检测等）">
    <el-row :gutter="16" class="mb-16">
      <el-col :sm="12">
        <el-card>
          <template #header><span class="fw-500">AI 摄像头列表</span></template>
          <el-table :data="cameras" stripe>
            <el-table-column prop="name" label="名称" width="140" />
            <el-table-column prop="location" label="位置" width="100" />
            <el-table-column label="识别能力">
              <template #default="{ row }">
                <el-tag v-for="a in row.ability" :key="a" size="small" effect="plain" style="margin-right: 4px;">{{ a }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="todayDetections" label="今日识别" width="90" align="center" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }"><StatusTag :status="row.status" /></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :sm="12">
        <el-card>
          <template #header>
            <div class="flex-between"><span class="fw-500">今日识别事件 TOP</span></div>
          </template>
          <EChart :option="eventOption" :height="320" />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span class="fw-500">识别事件流</span></template>
      <el-table :data="events.slice(0, 12)" stripe>
        <el-table-column prop="type" label="事件类型" width="140">
          <template #default="{ row }"><el-tag type="warning" size="small" effect="plain">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="140" />
        <el-table-column prop="camera" label="摄像头" width="120" />
        <el-table-column prop="time" label="发生时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.time) }}</template>
        </el-table-column>
        <el-table-column prop="confidence" label="置信度" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.confidence > 90 ? 'danger' : 'warning'">{{ row.confidence }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default><el-button link type="primary" size="small">查看截图</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import EChart from '@/components/EChart.vue'
import { formatDateTime } from '@/utils/format'
import request from '@/utils/request'

const cameras = ref([])
const events = ref([])

const eventOption = computed(() => {
  const counts = {}
  events.value.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1)
  const arr = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 90, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: arr.map(([k]) => k) },
    series: [{
      type: 'bar', data: arr.map(([, v]) => v),
      itemStyle: { color: '#722ed1', borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right' }
    }]
  }
})

onMounted(async () => {
  const { data } = await request.get('/device/aicamera')
  cameras.value = data.cameras
  events.value = data.events
})
</script>
