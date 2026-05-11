<template>
  <PageContainer title="深基坑" desc="深基坑工程信息、监测点位、变形监测曲线">
    <el-row :gutter="16" class="mb-16">
      <el-col :sm="8" v-for="p in list" :key="p.id">
        <el-card :class="['pit-card', p.status]">
          <div class="head">
            <span class="ttl">{{ p.name }}</span>
            <StatusTag :status="p.status" />
          </div>
          <div class="big-stats">
            <div class="b"><div class="lbl">基坑深度</div><div class="v">{{ p.depth }}<i>m</i></div></div>
            <div class="b"><div class="lbl">基坑面积</div><div class="v">{{ p.area }}<i>m²</i></div></div>
          </div>
          <div class="row"><span>支护形式</span><span>{{ p.supportType }}</span></div>
          <div class="row"><span>施工时段</span><span>{{ p.startDate }} ~ {{ p.endDate }}</span></div>
          <div class="row">
            <span>监测点位</span>
            <span><b>{{ p.monitorPoints }}</b> 个 · 报警 <b :style="{color: p.alarmPoints ? '#f5222d' : '#86909c'}">{{ p.alarmPoints }}</b></span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div class="flex-between">
          <span class="fw-500">基坑变形监测曲线</span>
          <span class="text-muted fs-12">数据来源：现场监测点（30 天）</span>
        </div>
      </template>
      <EChart :option="option" :height="320" />
    </el-card>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import EChart from '@/components/EChart.vue'
import request from '@/utils/request'

const list = ref([])
const monitor = ref([])
const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['水平位移(mm)', '沉降(mm)', '位移预警线', '位移控制线'], right: 10, top: 0 },
  grid: { left: 50, right: 30, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: monitor.value.map(d => d.date) },
  yAxis: { type: 'value', name: 'mm' },
  series: [
    { name: '水平位移(mm)', type: 'line', smooth: true, data: monitor.value.map(d => d.displacement),
      lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' },
      areaStyle: { color: 'rgba(22,119,255,0.12)' } },
    { name: '沉降(mm)', type: 'line', smooth: true, data: monitor.value.map(d => d.settlement),
      lineStyle: { color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
    { name: '位移预警线', type: 'line', data: monitor.value.map(() => 8),
      lineStyle: { color: '#faad14', type: 'dashed' }, symbol: 'none' },
    { name: '位移控制线', type: 'line', data: monitor.value.map(() => 12),
      lineStyle: { color: '#f5222d', type: 'dashed' }, symbol: 'none' }
  ]
}))
onMounted(async () => {
  list.value = (await request.get('/hazard/pit')).data
  monitor.value = (await request.get('/hazard/pit/monitor')).data
})
</script>

<style lang="scss" scoped>
.pit-card { height: 100%; }
.pit-card.warning { border-color: #ffd591; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ttl { font-size: 16px; font-weight: 600; }
.big-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.b { background: #fafbfc; border-radius: 6px; padding: 10px 12px; }
.lbl { font-size: 12px; color: #86909c; }
.v { font-size: 22px; font-weight: 600; color: #1f2329; margin-top: 2px; }
.v i { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 2px; font-style: normal; }
.row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; color: #4e5969; }
.row span:first-child { color: #86909c; }
</style>
