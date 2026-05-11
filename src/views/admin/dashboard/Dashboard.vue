<template>
  <PageContainer flat>
    <!-- 项目欢迎条 -->
    <div class="welcome">
      <div>
        <h2 class="welcome-title">您好，{{ user.username }}</h2>
        <p class="welcome-sub">
          当前项目：<b>{{ user.project.name }}</b>
          <el-tag size="small" effect="dark" type="warning" style="margin-left:8px;">
            <el-icon><StarFilled /></el-icon> {{ user.project.star }} 星
          </el-tag>
          <span class="text-muted" style="margin-left: 16px;">{{ today }}</span>
        </p>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" :icon="Monitor" @click="goScreen">进入驾驶舱</el-button>
      </div>
    </div>

    <!-- KPI 卡片 -->
    <el-row :gutter="16" class="kpi-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="k in kpis" :key="k.label">
        <div class="kpi-card" :class="k.tone">
          <div class="kpi-icon"><el-icon :size="22"><component :is="k.icon" /></el-icon></div>
          <div>
            <div class="kpi-value">{{ k.value }}<span class="kpi-unit">{{ k.unit }}</span></div>
            <div class="kpi-label">{{ k.label }}</div>
            <div class="kpi-trend" :class="k.trend > 0 ? 'up' : 'down'">
              较昨日 <el-icon><CaretTop v-if="k.trend>0" /><CaretBottom v-else /></el-icon>
              {{ Math.abs(k.trend) }}%
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="title">近 7 日考勤趋势</span>
              <el-radio-group v-model="trendRange" size="small">
                <el-radio-button label="7">7 日</el-radio-button>
                <el-radio-button label="30">30 日</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <EChart :option="attendanceOption" :height="280" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card>
          <template #header><div class="card-header"><span class="title">人员工种分布</span></div></template>
          <EChart :option="workerPieOption" :height="280" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header><div class="card-header"><span class="title">环境实时监测</span>
            <span class="text-muted fs-12">PM2.5 / 噪声 / 温度</span></div></template>
          <EChart :option="envOption" :height="260" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="title">今日待办 / 告警</span>
              <el-link type="primary" :underline="false">查看全部</el-link>
            </div>
          </template>
          <el-table :data="alarms" :show-header="false" size="default" style="width:100%">
            <el-table-column width="70">
              <template #default="{ row }">
                <StatusTag :status="row.status" />
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <div class="fw-500">{{ row.title }}</div>
                <div class="text-muted fs-12">{{ row.time }} · {{ row.from }}</div>
              </template>
            </el-table-column>
            <el-table-column width="80" align="right">
              <template #default><el-button link type="primary" size="small">处理</el-button></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Monitor, CaretTop, CaretBottom, StarFilled, UserFilled, WarningFilled, OfficeBuilding, VideoCamera } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import EChart from '@/components/EChart.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const today = dayjs().format('YYYY 年 MM 月 DD 日 dddd')

const trendRange = ref('7')

const kpis = [
  { label: '在场人员', value: 286, unit: ' 人', trend: 5,  icon: 'UserFilled',      tone: 'blue'   },
  { label: '今日告警', value: 4,   unit: ' 条', trend: -2, icon: 'WarningFilled',   tone: 'orange' },
  { label: '在线设备', value: 38,  unit: ' 台', trend: 1,  icon: 'Connection',      tone: 'green'  },
  { label: '形象进度', value: 62,  unit: ' %',  trend: 3,  icon: 'OfficeBuilding',  tone: 'purple' }
]

const attendanceOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['出勤', '在场'], right: 10, top: 0 },
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'], boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    { name: '出勤', type: 'line', smooth: true, data: [240, 260, 252, 275, 280, 270, 286],
      areaStyle: { color: 'rgba(22,119,255,0.15)' }, lineStyle: { color: '#1677ff' }, itemStyle: { color: '#1677ff' } },
    { name: '在场', type: 'line', smooth: true, data: [220, 245, 240, 258, 270, 260, 274],
      lineStyle: { color: '#52c41a' }, itemStyle: { color: '#52c41a' } }
  ]
}))

const workerPieOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  series: [{
    type: 'pie', radius: ['45%', '70%'], avoidLabelOverlap: true,
    label: { show: false }, labelLine: { show: false },
    data: [
      { value: 90, name: '钢筋工' },
      { value: 60, name: '木工' },
      { value: 45, name: '混凝土工' },
      { value: 50, name: '电工' },
      { value: 41, name: '其他' }
    ]
  }]
}

const envOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['PM2.5', '噪声(dB)', '温度(℃)'], right: 10, top: 0 },
  grid: { left: 40, right: 40, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: ['00','04','08','12','16','20','24'] },
  yAxis: [{ type: 'value' }, { type: 'value' }],
  series: [
    { name: 'PM2.5', type: 'bar', data: [40,38,55,72,65,48,42], itemStyle: { color: '#1677ff' } },
    { name: '噪声(dB)', type: 'line', smooth: true, data: [55,52,68,75,70,60,58], lineStyle: { color: '#faad14' } },
    { name: '温度(℃)', type: 'line', smooth: true, yAxisIndex: 1, data: [18,17,22,28,26,21,19], lineStyle: { color: '#f5222d' } }
  ]
}

const alarms = [
  { status: 'warning', title: '塔吊 #2 风速超限', time: '14:23', from: '设备集成' },
  { status: 'unrectified', title: '工人未佩戴安全帽', time: '11:08', from: 'AI 摄像头' },
  { status: 'pending', title: '雨季施工方案待审批', time: '10:30', from: '危大工程' },
  { status: 'warning', title: 'PM2.5 超阈值告警', time: '09:55', from: '环境监测' },
  { status: 'rectifying', title: '基坑监测点位移异常', time: '08:42', from: '深基坑' }
]

function goScreen() {
  window.open(router.resolve('/screen').href, '_blank')
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.welcome {
  background: linear-gradient(120deg, #1677ff 0%, #4ee8ff 100%);
  color: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex; justify-content: space-between; align-items: center;
  background-image:
    linear-gradient(120deg, #1677ff 0%, #4ee8ff 100%),
    radial-gradient(circle at 95% 50%, rgba(255,255,255,0.15) 0, transparent 30%);
}
.welcome-title { font-size: 22px; margin: 0; color: #fff; font-weight: 600; }
.welcome-sub { margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.92); }
.welcome-sub .text-muted { color: rgba(255,255,255,0.7); }
.welcome-actions :deep(.el-button) { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: #fff; }
.welcome-actions :deep(.el-button:hover) { background: rgba(255,255,255,0.3); }

.kpi-row { margin-bottom: 16px; }
.kpi-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff;
  border-radius: 8px;
  padding: 18px 18px;
  border: 1px solid $border-light;
  min-height: 92px;
  &.blue   .kpi-icon { background: rgba(22,119,255,0.12); color: #1677ff; }
  &.orange .kpi-icon { background: rgba(250,173,20,0.14); color: #faad14; }
  &.green  .kpi-icon { background: rgba(82,196,26,0.12);  color: #52c41a; }
  &.purple .kpi-icon { background: rgba(114,46,209,0.12); color: #722ed1; }
}
.kpi-icon {
  width: 48px; height: 48px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-value { font-size: 24px; font-weight: 600; color: $text-primary; line-height: 1; }
.kpi-unit  { font-size: 12px; color: $text-muted; margin-left: 4px; font-weight: 400; }
.kpi-label { font-size: 13px; color: $text-secondary; margin-top: 6px; }
.kpi-trend { font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 2px;
  &.up { color: $success; } &.down { color: $danger; }
}

.chart-row { margin-bottom: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-header .title { font-size: 15px; font-weight: 500; color: $text-primary; }
</style>
