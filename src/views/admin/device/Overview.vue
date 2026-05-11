<template>
  <PageContainer title="设备总览" desc="14 类 IoT 集成设备状态汇总，点击卡片进入对应详情">
    <!-- 顶部 KPI -->
    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6" v-for="k in kpis" :key="k.label">
        <div class="kpi" :style="{ borderTop: `3px solid ${k.color}` }">
          <div class="kpi-label">{{ k.label }}</div>
          <div class="kpi-val" :style="{ color: k.color }">
            {{ k.value }}<span class="kpi-unit">{{ k.unit }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 设备分类卡片 -->
    <div class="cards">
      <div
        v-for="d in devices"
        :key="d.key"
        class="device-card"
        @click="$router.push(d.path)"
      >
        <div class="ico" :style="{ background: d.color + '20', color: d.color }">
          <el-icon size="22"><component :is="d.icon" /></el-icon>
        </div>
        <div class="info">
          <div class="name">{{ d.name }}</div>
          <div class="stat">
            <span class="num">{{ d.online }}</span>
            <span class="total">/ {{ d.total }} 在线</span>
          </div>
        </div>
        <div class="bar">
          <div class="bar-inner" :style="{ width: (d.online / d.total * 100) + '%', background: d.color }"></div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { DEVICE_CATEGORIES } from '@/utils/devices'
import request from '@/utils/request'

const devices = DEVICE_CATEGORIES
const summary = ref({})

const kpis = [
  { label: '设备总数', value: 150, unit: ' 台', color: '#1677ff' },
  { label: '在线设备', value: 141, unit: ' 台', color: '#52c41a' },
  { label: '告警设备', value: 3,   unit: ' 台', color: '#faad14' },
  { label: '本月告警', value: 38,  unit: ' 次', color: '#f5222d' }
]

onMounted(async () => {
  const { data } = await request.get('/device/overview')
  summary.value = data
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.kpi {
  background: #fff; border: 1px solid $border-light; border-radius: 6px;
  padding: 14px 18px;
}
.kpi-label { font-size: 13px; color: $text-muted; }
.kpi-val { font-size: 26px; font-weight: 600; line-height: 1.1; margin-top: 4px; }
.kpi-unit { font-size: 12px; color: $text-muted; font-weight: 400; margin-left: 4px; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.device-card {
  background: #fff;
  border: 1px solid $border-light;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    border-color: $primary;
  }
}
.ico {
  width: 40px; height: 40px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}
.name { font-size: 14px; color: $text-primary; font-weight: 500; }
.stat { margin-top: 4px; }
.num { font-size: 22px; font-weight: 600; color: $text-primary; }
.total { font-size: 12px; color: $text-muted; margin-left: 4px; }
.bar {
  margin-top: 10px;
  height: 4px;
  background: #f0f2f5;
  border-radius: 2px;
  overflow: hidden;
}
.bar-inner { height: 100%; border-radius: 2px; transition: width 0.3s; }
</style>
