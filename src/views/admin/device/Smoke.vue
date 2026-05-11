<template>
  <PageContainer title="智能烟感" desc="重点防火部位烟雾感应监测">
    <div v-if="alarms.length" class="alert-banner">
      <el-icon size="20"><WarningFilled /></el-icon>
      <span>检测到 {{ alarms.length }} 处烟雾告警，请立即核查！</span>
      <el-button type="danger" size="small" style="margin-left: 12px;">立即响应</el-button>
    </div>

    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6"><div class="s-card g"><div class="l">在线</div><div class="v">{{ stats.online }}<span>台</span></div></div></el-col>
      <el-col :sm="6"><div class="s-card r"><div class="l">报警</div><div class="v">{{ stats.alarm }}<span>台</span></div></div></el-col>
      <el-col :sm="6"><div class="s-card y"><div class="l">低电量</div><div class="v">{{ stats.lowBattery }}<span>台</span></div></div></el-col>
      <el-col :sm="6"><div class="s-card"><div class="l">离线</div><div class="v">{{ stats.offline }}<span>台</span></div></div></el-col>
    </el-row>

    <el-card>
      <template #header><span class="fw-500">烟感列表</span></template>
      <el-table :data="list" stripe>
        <el-table-column prop="id" label="设备 ID" width="120" />
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="location" label="安装位置" width="180" />
        <el-table-column label="烟雾" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.smoke === 'alarm' ? 'danger' : 'success'">
              {{ row.smoke === 'alarm' ? '告警' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电量" width="140">
          <template #default="{ row }">
            <el-progress :percentage="row.battery" :stroke-width="10"
              :color="row.battery < 30 ? '#f5222d' : '#52c41a'" />
          </template>
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
import { WarningFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])
const stats = computed(() => ({
  online: list.value.filter(i => i.online && i.smoke !== 'alarm').length,
  alarm: list.value.filter(i => i.smoke === 'alarm').length,
  lowBattery: list.value.filter(i => i.battery < 30).length,
  offline: list.value.filter(i => !i.online).length
}))
const alarms = computed(() => list.value.filter(i => i.smoke === 'alarm'))

onMounted(async () => {
  const { data } = await request.get('/device/smoke')
  list.value = data
})
</script>

<style lang="scss" scoped>
.alert-banner {
  background: #fff1f0; border: 1px solid #ffccc7; color: #f5222d;
  padding: 10px 16px; border-radius: 6px; margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.s-card { background: #fff; border: 1px solid #e5e6eb; border-radius: 6px; padding: 14px 18px; border-left: 3px solid #c9cdd4; }
.s-card.g { border-left-color: #52c41a; } .s-card.r { border-left-color: #f5222d; } .s-card.y { border-left-color: #faad14; }
.s-card .l { font-size: 13px; color: #86909c; }
.s-card .v { font-size: 26px; font-weight: 600; margin-top: 4px; }
.s-card .v span { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 4px; }
</style>
