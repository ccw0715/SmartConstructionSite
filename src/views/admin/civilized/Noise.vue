<template>
  <PageContainer title="噪声监测" desc="昼夜分时段噪声监测，自动比对国标限值">
    <el-row :gutter="16" class="mb-16">
      <el-col :sm="8">
        <div class="big-metric">
          <div class="lbl">当前噪声</div>
          <div class="val" :class="noiseOver ? 'over' : ''">{{ current }}<span class="u">dB</span></div>
          <div class="hint">{{ noiseOver ? '超过昼间限值 70dB' : '处于正常范围（≤ 70dB）' }}</div>
        </div>
      </el-col>
      <el-col :sm="16">
        <el-card style="height: 100%">
          <template #header><span class="fw-500">24 小时噪声趋势 - 与昼夜限值对比</span></template>
          <EChart :option="option" :height="220" />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span class="fw-500">超标记录</span></template>
      <el-table :data="exceedList" stripe>
        <el-table-column prop="time" label="发生时间" width="180" />
        <el-table-column prop="value" label="噪声值" width="110">
          <template #default="{ row }"><span style="color:#f5222d;font-weight:600">{{ row.value }} dB</span></template>
        </el-table-column>
        <el-table-column prop="period" label="时段" width="100" />
        <el-table-column prop="limit" label="限值" width="100" />
        <el-table-column prop="duration" label="持续" width="120" />
        <el-table-column prop="device" label="监测点" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
      </el-table>
    </el-card>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import EChart from '@/components/EChart.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const realtime = ref([])
const current = ref(0)
let timer = null

const noiseOver = computed(() => current.value > 70)

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['噪声(dB)', '昼间限值', '夜间限值'], right: 10, top: 0 },
  grid: { left: 40, right: 30, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: realtime.value.map(r => r.time) },
  yAxis: { type: 'value', min: 30, max: 100 },
  series: [
    { name: '噪声(dB)', type: 'line', smooth: true, data: realtime.value.map(r => r.noise),
      lineStyle: { color: '#faad14', width: 2 }, itemStyle: { color: '#faad14' },
      areaStyle: { color: 'rgba(250,173,20,0.12)' } },
    { name: '昼间限值', type: 'line', data: realtime.value.map(() => 70),
      lineStyle: { color: '#52c41a', type: 'dashed' }, symbol: 'none' },
    { name: '夜间限值', type: 'line', data: realtime.value.map(() => 55),
      lineStyle: { color: '#f5222d', type: 'dashed' }, symbol: 'none' }
  ]
}))

const exceedList = [
  { time: '2026-05-11 02:34:00', value: 68, period: '夜间', limit: '55dB', duration: '15 分钟', device: '#1 监测点', status: 'rectified' },
  { time: '2026-05-10 23:12:00', value: 72, period: '夜间', limit: '55dB', duration: '8 分钟',  device: '#2 监测点', status: 'rectified' },
  { time: '2026-05-10 14:55:00', value: 78, period: '昼间', limit: '70dB', duration: '22 分钟', device: '#1 监测点', status: 'rectifying' }
]

async function loadRealtime() {
  const { data } = await request.get('/civilized/env/realtime')
  realtime.value = data
}
async function loadCurrent() {
  const { data } = await request.get('/civilized/env/current')
  current.value = data.noise
}

onMounted(() => {
  loadRealtime()
  loadCurrent()
  timer = setInterval(loadCurrent, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.big-metric {
  background: linear-gradient(135deg, #1677ff, #4ee8ff);
  color: #fff; border-radius: 8px; padding: 28px; height: 100%;
  .lbl { font-size: 13px; opacity: 0.9; }
  .val { font-size: 56px; font-weight: 600; line-height: 1.2; margin-top: 4px; }
  .val.over { background: linear-gradient(135deg, #ffc24f, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .u { font-size: 16px; opacity: 0.8; margin-left: 4px; }
  .hint { font-size: 13px; opacity: 0.9; margin-top: 6px; }
}
</style>
