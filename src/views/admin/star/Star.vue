<template>
  <PageContainer flat>
    <!-- 顶部星级横幅 -->
    <div class="star-banner">
      <div class="left">
        <div class="title">智慧工地星级评定</div>
        <div class="stars">
          <el-icon v-for="i in 5" :key="i" :size="32" :color="i <= data.star ? '#ffd591' : 'rgba(255,255,255,0.25)'">
            <StarFilled />
          </el-icon>
        </div>
        <div class="score">{{ data.score }}<span>分</span></div>
        <div class="rank">{{ data.rank }}</div>
      </div>
      <div class="middle">
        <div class="meta-row"><span>颁发机构</span><b>{{ data.issuer }}</b></div>
        <div class="meta-row"><span>颁发日期</span><b>{{ data.issueDate }}</b></div>
        <div class="meta-row"><span>有效期至</span><b>{{ data.expireDate }}</b></div>
      </div>
      <div class="right">
        <el-button type="primary" plain :icon="Download" style="background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);color:#fff;">下载证书</el-button>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :sm="14">
        <el-card>
          <template #header><span class="fw-500">六维评分雷达</span></template>
          <EChart :option="radarOption" :height="320" />
        </el-card>
      </el-col>
      <el-col :sm="10">
        <el-card>
          <template #header><span class="fw-500">评分历史趋势</span></template>
          <EChart :option="historyOption" :height="320" />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 16px;">
      <template #header><span class="fw-500">评分明细</span></template>
      <el-table :data="data.dimensions" stripe>
        <el-table-column prop="name" label="维度" width="200" />
        <el-table-column label="得分" width="120">
          <template #default="{ row }"><b style="font-size:16px;">{{ row.score }}</b> / 100</template>
        </el-table-column>
        <el-table-column label="可视化">
          <template #default="{ row }">
            <el-progress :percentage="row.score" :stroke-width="10"
              :color="row.score >= 90 ? '#52c41a' : row.score >= 80 ? '#1677ff' : '#faad14'" />
          </template>
        </el-table-column>
        <el-table-column label="评价" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="row.score >= 90 ? 'success' : row.score >= 80 ? 'primary' : 'warning'">
              {{ row.score >= 90 ? '优秀' : row.score >= 80 ? '良好' : '合格' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </PageContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { StarFilled, Download } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import EChart from '@/components/EChart.vue'
import request from '@/utils/request'

const data = ref({ dimensions: [], history: [], star: 0 })

const radarOption = computed(() => ({
  tooltip: {},
  radar: {
    indicator: data.value.dimensions.map(d => ({ name: d.name, max: 100 })),
    splitArea: { areaStyle: { color: ['rgba(22,119,255,0.04)','rgba(22,119,255,0.08)'] } }
  },
  series: [{
    type: 'radar', areaStyle: { color: 'rgba(22,119,255,0.25)' },
    lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' },
    data: [{ value: data.value.dimensions.map(d => d.score), name: '本期评分' }]
  }]
}))

const historyOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 30, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: data.value.history.map(h => h.date) },
  yAxis: { type: 'value', min: 60, max: 100 },
  series: [{
    name: '得分', type: 'line', smooth: true,
    data: data.value.history.map(h => h.score),
    lineStyle: { color: '#1677ff', width: 3 }, itemStyle: { color: '#1677ff' },
    areaStyle: { color: 'rgba(22,119,255,0.15)' },
    markPoint: { data: [{ type: 'max', name: '最高' }] }
  }]
}))

onMounted(async () => { data.value = (await request.get('/star/current')).data })
</script>

<style lang="scss" scoped>
.star-banner {
  background: linear-gradient(120deg, #1677ff 0%, #722ed1 100%);
  color: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  margin-bottom: 16px;
  background-image:
    linear-gradient(120deg, #1677ff 0%, #722ed1 100%),
    radial-gradient(circle at 90% 20%, rgba(255,255,255,0.15) 0, transparent 35%);
}
.left .title { font-size: 14px; opacity: 0.85; }
.left .stars { margin: 8px 0; display: flex; gap: 4px; }
.left .score { font-size: 56px; font-weight: 700; line-height: 1; }
.left .score span { font-size: 18px; font-weight: 400; opacity: 0.85; margin-left: 6px; }
.left .rank { font-size: 13px; opacity: 0.85; margin-top: 4px; }

.meta-row { font-size: 13px; padding: 4px 0; opacity: 0.92; display: flex; gap: 12px; }
.meta-row span { width: 80px; opacity: 0.7; }
.meta-row b { font-weight: 500; }
</style>
