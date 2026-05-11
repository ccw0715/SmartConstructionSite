<template>
  <PageContainer title="智能安全帽" desc="工人在场定位、电量、心率（如支持）实时监测">
    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6">
        <div class="stat-card">
          <div class="lbl">在场佩戴</div>
          <div class="val" style="color:#52c41a">{{ stat.online }}<span>/{{ list.length }}</span></div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="stat-card">
          <div class="lbl">低电量(&lt;30%)</div>
          <div class="val" style="color:#faad14">{{ stat.lowBattery }}<span> 顶</span></div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="stat-card">
          <div class="lbl">脱离监测</div>
          <div class="val" style="color:#86909c">{{ stat.offline }}<span> 顶</span></div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="stat-card">
          <div class="lbl">今日告警</div>
          <div class="val" style="color:#f5222d">2<span> 次</span></div>
        </div>
      </el-col>
    </el-row>

    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <el-table-column prop="id" label="设备 ID" width="100" />
      <el-table-column prop="worker" label="佩戴人员" width="120" />
      <el-table-column prop="location" label="当前位置" width="160" />
      <el-table-column label="电量" width="160">
        <template #default="{ row }">
          <div class="battery-bar">
            <el-progress :percentage="row.battery" :stroke-width="10"
              :color="row.battery < 30 ? '#f5222d' : row.battery < 60 ? '#faad14' : '#52c41a'" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="在线" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.online ? 'success' : 'info'">
            {{ row.online ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastHeartbeat" label="最后心跳" width="180">
        <template #default="{ row }">{{ formatDateTime(row.lastHeartbeat) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default><el-button link type="primary" size="small">轨迹回放</el-button></template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import { formatDateTime } from '@/utils/format'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20 })
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/device/helmet', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
const stat = computed(() => ({
  online: list.value.filter(h => h.online).length,
  offline: list.value.filter(h => !h.online).length,
  lowBattery: list.value.filter(h => h.battery < 30).length
}))
onMounted(() => load(1))
</script>

<style lang="scss" scoped>
.stat-card { background: #fff; padding: 14px 18px; border: 1px solid #e5e6eb; border-radius: 6px; }
.stat-card .lbl { font-size: 13px; color: #86909c; }
.stat-card .val { font-size: 26px; font-weight: 600; margin-top: 4px; }
.stat-card .val span { font-size: 13px; color: #86909c; font-weight: 400; margin-left: 4px; }
.battery-bar :deep(.el-progress) { margin: 0; }
</style>
