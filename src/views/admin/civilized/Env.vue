<template>
  <PageContainer title="环境监测" desc="扬尘、PM2.5、PM10、TSP、温湿度、风速实时监测">
    <!-- 当前实时数据卡片 -->
    <el-row :gutter="12" class="mb-16">
      <el-col :xs="12" :sm="8" :md="6" :lg="3" v-for="card in cards" :key="card.key">
        <div class="metric" :class="card.over ? 'over' : ''">
          <div class="m-label">{{ card.label }}</div>
          <div class="m-val">{{ card.value }}<span class="m-unit">{{ card.unit }}</span></div>
          <div class="m-thresh">
            <el-icon><component :is="card.over ? 'WarningFilled' : 'CircleCheckFilled'" /></el-icon>
            阈值 {{ card.threshold }}
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 实时趋势图 -->
    <el-card class="mb-16">
      <template #header>
        <div class="flex-between">
          <span class="fw-500">24 小时实时趋势</span>
          <el-radio-group v-model="metric" size="small">
            <el-radio-button label="pm25">PM2.5</el-radio-button>
            <el-radio-button label="pm10">PM10</el-radio-button>
            <el-radio-button label="tsp">TSP</el-radio-button>
            <el-radio-button label="noise">噪声</el-radio-button>
            <el-radio-button label="temp">温度</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <EChart :option="trendOption" :height="320" />
    </el-card>

    <el-card>
      <template #header><span class="fw-500">监测点位状态</span></template>
      <el-table :data="devices" stripe>
        <el-table-column prop="name" label="监测点位" width="180" />
        <el-table-column prop="location" label="安装位置" />
        <el-table-column prop="lastUpdate" label="最后上报" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">详情</el-button></template>
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
const current = ref({})
const metric = ref('pm25')
let timer = null

const thresholds = { pm25: 75, pm10: 100, tsp: 200, temp: 35, humidity: 90, noise: 70 }

const cards = computed(() => [
  { key:'pm25',  label:'PM2.5', value: current.value.pm25, unit:'μg/m³', threshold: thresholds.pm25, over: current.value.pm25 > thresholds.pm25 },
  { key:'pm10',  label:'PM10',  value: current.value.pm10, unit:'μg/m³', threshold: thresholds.pm10, over: current.value.pm10 > thresholds.pm10 },
  { key:'tsp',   label:'TSP',   value: current.value.tsp,  unit:'μg/m³', threshold: thresholds.tsp,  over: current.value.tsp > thresholds.tsp },
  { key:'noise', label:'噪声',   value: current.value.noise,unit:'dB',    threshold: thresholds.noise, over: current.value.noise > thresholds.noise },
  { key:'temp',  label:'温度',   value: current.value.temp, unit:'℃',     threshold: thresholds.temp, over: current.value.temp > thresholds.temp },
  { key:'humidity', label:'湿度', value: current.value.humidity, unit:'%', threshold: thresholds.humidity, over: false },
  { key:'wind',  label:'风速',   value: current.value.windSpeed, unit:'m/s', threshold: '8.0', over: false },
  { key:'dir',   label:'风向',   value: current.value.windDirection, unit:'',  threshold: '-', over: false }
])

const trendOption = computed(() => {
  const m = metric.value
  const label = ({ pm25:'PM2.5', pm10:'PM10', tsp:'TSP', noise:'噪声(dB)', temp:'温度(℃)' })[m]
  const data = realtime.value.map(r => r[m])
  const max = thresholds[m]
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: [label, '阈值'], right: 10, top: 0 },
    grid: { left: 50, right: 40, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: realtime.value.map(r => r.time) },
    yAxis: { type: 'value' },
    series: [
      {
        name: label, type: 'line', smooth: true, data,
        lineStyle: { color: '#1677ff', width: 2 },
        itemStyle: { color: '#1677ff' },
        areaStyle: { color: 'rgba(22,119,255,0.12)' },
        markPoint: { data: [{ type: 'max', name: '最大' }] }
      },
      ...(max ? [{
        name: '阈值', type: 'line', data: data.map(() => max),
        lineStyle: { color: '#f5222d', type: 'dashed' }, symbol: 'none'
      }] : [])
    ]
  }
})

const devices = [
  { name: '#1 监测点', location: '工地东侧入口', lastUpdate: '2026-05-11 14:23', status: 'online' },
  { name: '#2 监测点', location: '主楼施工区',   lastUpdate: '2026-05-11 14:23', status: 'online' },
  { name: '#3 监测点', location: '材料堆场',     lastUpdate: '2026-05-11 14:22', status: 'online' },
  { name: '#4 监测点', location: '生活区',       lastUpdate: '2026-05-11 13:50', status: 'offline' }
]

async function loadAll() {
  const [r1, r2] = await Promise.all([
    request.get('/civilized/env/realtime'),
    request.get('/civilized/env/current')
  ])
  realtime.value = r1.data
  current.value = r2.data
}

onMounted(() => {
  loadAll()
  timer = setInterval(() => {
    request.get('/civilized/env/current').then(r => current.value = r.data)
  }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.metric {
  background: #fff; border: 1px solid #e5e6eb; border-radius: 8px;
  padding: 14px 16px; min-height: 96px;
  &.over { border-color: #ffccc7; background: linear-gradient(180deg, #fff2f0 0%, #fff 100%); }
}
.m-label { font-size: 13px; color: #86909c; }
.m-val { font-size: 26px; font-weight: 600; color: #1f2329; line-height: 1.2; margin-top: 4px; }
.metric.over .m-val { color: #f5222d; }
.m-unit { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 4px; }
.m-thresh {
  font-size: 12px; color: #86909c; margin-top: 6px;
  display: flex; align-items: center; gap: 4px;
}
.metric.over .m-thresh { color: #f5222d; }
</style>
