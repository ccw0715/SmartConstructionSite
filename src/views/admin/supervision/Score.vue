<template>
  <PageContainer title="省动态扣分" desc="对接省建设监管平台的动态扣分记录">
    <!-- 顶部得分卡 -->
    <div class="score-banner">
      <div class="left">
        <div class="lbl">当前累计得分</div>
        <div class="big">{{ currentScore }}<span class="unit">分</span></div>
        <div class="trend">本月扣 <b style="color:#fff">{{ monthDeduct }}</b> 分 · 较上月 {{ monthDeduct > 5 ? '上升' : '下降' }}</div>
      </div>
      <div class="right">
        <EChart :option="trendOption" :height="120" />
      </div>
    </div>

    <DataTable :data="list" :loading="loading" :total="total" :page="1" :page-size="20" :show-index="false">
      <template #toolbar>
        <el-button :icon="Refresh" @click="load">同步省平台</el-button>
      </template>
      <el-table-column prop="date" label="扣分日期" width="120" />
      <el-table-column prop="category" label="扣分类别" width="120">
        <template #default="{ row }"><el-tag effect="plain">{{ row.category }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="reason" label="扣分原因" min-width="240" />
      <el-table-column prop="score" label="本次扣分" width="100" align="center">
        <template #default="{ row }">
          <span style="color:#f5222d; font-weight:600">{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cumulative" label="剩余得分" width="100" align="center" />
      <el-table-column prop="source" label="数据来源" width="160" />
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import EChart from '@/components/EChart.vue'
import request from '@/utils/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)

async function load() {
  loading.value = true
  const { data } = await request.get('/supervision/score', { params: { page: 1, pageSize: 100 } })
  list.value = data.list
  total.value = data.total
  loading.value = false
}

const currentScore = computed(() => list.value[0]?.cumulative ?? 100)
const monthDeduct = computed(() => list.value.reduce((s, i) => s + Math.abs(i.score), 0))

const trendOption = computed(() => ({
  grid: { left: 30, right: 10, top: 10, bottom: 20 },
  xAxis: { type: 'category', data: list.value.slice(0, 12).reverse().map(i => i.date.slice(5)), axisLine:{ lineStyle:{color:'rgba(255,255,255,0.3)'}}, axisLabel:{color:'rgba(255,255,255,0.7)'} },
  yAxis: { type: 'value', axisLine:{lineStyle:{color:'rgba(255,255,255,0.3)'}}, axisLabel:{color:'rgba(255,255,255,0.7)'}, splitLine:{lineStyle:{color:'rgba(255,255,255,0.1)'}} },
  series: [{
    type: 'line', smooth: true,
    data: list.value.slice(0, 12).reverse().map(i => i.cumulative),
    lineStyle: { color: '#fff' }, itemStyle: { color: '#fff' },
    areaStyle: { color: 'rgba(255,255,255,0.2)' }
  }]
}))

onMounted(load)
</script>

<style lang="scss" scoped>
.score-banner {
  background: linear-gradient(120deg, #1677ff, #4ee8ff);
  color: #fff; border-radius: 8px; padding: 24px;
  display: flex; gap: 24px; margin-bottom: 16px;
  .left { width: 240px; }
  .right { flex: 1; }
  .lbl { font-size: 13px; opacity: 0.9; }
  .big { font-size: 48px; font-weight: 600; line-height: 1.2; margin-top: 4px; }
  .unit { font-size: 14px; opacity: 0.8; margin-left: 4px; }
  .trend { font-size: 13px; opacity: 0.9; margin-top: 6px; }
}
</style>
