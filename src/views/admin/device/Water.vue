<template>
  <PageContainer title="智能水表" desc="水表读数、用量统计">
    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6">
        <div class="ec-card blue">
          <div class="lbl">今日用水</div>
          <div class="val">{{ stats.today }}<span>m³</span></div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="ec-card">
          <div class="lbl">本月累计</div>
          <div class="val">{{ stats.month }}<span>m³</span></div>
        </div>
      </el-col>
      <el-col :sm="12">
        <el-card>
          <template #header><span class="fw-500">近 7 日用水趋势</span></template>
          <EChart :option="trendOption" :height="100" />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span class="fw-500">水表列表</span></template>
      <el-table :data="list" stripe>
        <el-table-column prop="id" label="设备 ID" width="120" />
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="location" label="安装位置" width="140" />
        <el-table-column prop="reading" label="当前读数">
          <template #default="{ row }">{{ row.reading }} m³</template>
        </el-table-column>
        <el-table-column prop="todayUsage" label="今日用量">
          <template #default="{ row }">{{ row.todayUsage }} m³</template>
        </el-table-column>
        <el-table-column prop="monthUsage" label="本月用量">
          <template #default="{ row }">{{ row.monthUsage }} m³</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
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
import request from '@/utils/request'

const list = ref([])
const trend = ref([])
const stats = computed(() => ({
  today: list.value.reduce((s, i) => s + i.todayUsage, 0),
  month: list.value.reduce((s, i) => s + i.monthUsage, 0)
}))
const trendOption = computed(() => ({
  grid: { left: 30, right: 10, top: 10, bottom: 20 },
  xAxis: { type: 'category', data: trend.value.map(t => t.date) },
  yAxis: { type: 'value' },
  series: [{
    type: 'line', smooth: true, data: trend.value.map(t => t.water),
    lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' },
    areaStyle: { color: 'rgba(22,119,255,0.15)' }
  }]
}))
onMounted(async () => {
  const [a, b] = await Promise.all([request.get('/device/water'), request.get('/device/energy/trend')])
  list.value = a.data; trend.value = b.data
})
</script>

<style lang="scss" scoped>
.ec-card { background: #fff; padding: 14px 20px; border: 1px solid #e5e6eb; border-radius: 6px; height: 100%; }
.ec-card.blue { background: linear-gradient(135deg, #1677ff, #4ee8ff); color: #fff; border: 0; }
.ec-card.blue .lbl { color: rgba(255,255,255,0.85); }
.ec-card .lbl { font-size: 13px; color: #86909c; }
.ec-card .val { font-size: 28px; font-weight: 600; margin-top: 6px; }
.ec-card .val span { font-size: 13px; opacity: 0.7; margin-left: 4px; font-weight: 400; }
</style>
