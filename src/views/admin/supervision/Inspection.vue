<template>
  <PageContainer title="监督检查记录" desc="政府监督部门、监理、总包等检查记录">
    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">登记检查</el-button>
        <el-button :icon="Download">导出</el-button>
      </template>
      <el-table-column prop="no" label="检查单号" width="140" />
      <el-table-column prop="type" label="检查类型" width="100">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="inspector" label="检查单位" width="120" />
      <el-table-column prop="inspectee" label="受查项目" min-width="220" />
      <el-table-column prop="date" label="检查日期" width="120" />
      <el-table-column prop="problemCount" label="问题数" width="80" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.problemCount > 0" type="warning" size="small">{{ row.problemCount }}</el-tag>
          <span v-else class="text-muted">0</span>
        </template>
      </el-table-column>
      <el-table-column prop="conclusion" label="结论" width="100" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">查看</el-button>
          <el-button link type="primary" size="small">下载报告</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Download } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', type: '' })
const searchFields = [
  { prop: 'keyword', label: '关键字' },
  { prop: 'type', label: '检查类型', type: 'select', options: ['日常巡查','专项检查','复查','夜间巡查'].map(v => ({label:v,value:v})) },
  { prop: 'date', label: '日期', type: 'daterange' }
]
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/supervision/inspection', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
