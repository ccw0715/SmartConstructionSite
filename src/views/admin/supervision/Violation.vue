<template>
  <PageContainer title="不规范行为记录" desc="现场不规范行为（含 AI 摄像头自动识别 + 人工录入）">
    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">手动录入</el-button>
        <el-button :icon="Download">导出</el-button>
      </template>
      <el-table-column prop="type" label="行为类型" width="120">
        <template #default="{ row }"><el-tag size="small" type="warning" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="person" label="涉事人员" width="100" />
      <el-table-column prop="trade" label="工种" width="100" />
      <el-table-column prop="location" label="位置" width="140" />
      <el-table-column prop="time" label="发生时间" width="170" />
      <el-table-column prop="source" label="来源" width="120">
        <template #default="{ row }">
          <el-icon v-if="row.source==='AI 摄像头'" color="#1677ff"><Cpu /></el-icon>
          {{ row.source }}
        </template>
      </el-table-column>
      <el-table-column prop="severity" label="严重程度" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="severityType(row.severity)">{{ severityLabel(row.severity) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">查看截图</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Download, Cpu } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { VIOLATION_TYPES, SEVERITY } from '@/utils/dict'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', type: '', severity: '' })

const searchFields = [
  { prop: 'keyword', label: '关键字', placeholder: '姓名/位置' },
  { prop: 'type', label: '行为类型', type: 'select', options: VIOLATION_TYPES.map(v => ({label:v,value:v})) },
  { prop: 'severity', label: '严重程度', type: 'select', options: SEVERITY }
]

function severityType(s) { return { low: '', mid: 'warning', high: 'danger' }[s] }
function severityLabel(s) { return SEVERITY.find(x => x.value === s)?.label }

async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/supervision/violation', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
