<template>
  <PageContainer title="报警记录" desc="环境监测设备触发的报警事件">
    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button :icon="Download">导出</el-button>
      </template>
      <el-table-column prop="id" label="报警 ID" width="100" />
      <el-table-column prop="type" label="报警类型" width="140">
        <template #default="{ row }"><el-tag type="warning" size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="value" label="实测值" width="100" align="center">
        <template #default="{ row }"><span style="color:#f5222d;font-weight:600">{{ row.value }}</span></template>
      </el-table-column>
      <el-table-column prop="threshold" label="阈值" width="80" align="center" />
      <el-table-column prop="device" label="设备" width="140" />
      <el-table-column prop="time" label="报警时间" width="180" />
      <el-table-column label="处置状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small">详情</el-button>
          <el-button v-if="row.status === 'warning'" link type="success" size="small">处置</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', type: '' })
const searchFields = [
  { prop: 'keyword', label: '关键字', placeholder: '搜索设备/类型' },
  { prop: 'type', label: '类型', type: 'select', options: ['PM2.5 超限','PM10 超限','噪声超限','温度异常'].map(v=>({label:v,value:v})) },
  { prop: 'date', label: '日期', type: 'daterange' }
]
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/civilized/alarm', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
