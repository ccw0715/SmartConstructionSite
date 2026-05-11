<template>
  <PageContainer title="质量检测报告" desc="第三方检测机构出具的检测报告">
    <SearchBar v-model="query" :fields="fields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">上传报告</el-button>
        <el-button :icon="Download">批量导出</el-button>
      </template>
      <el-table-column prop="no" label="报告编号" width="160" />
      <el-table-column prop="title" label="报告名称" min-width="220" />
      <el-table-column prop="category" label="类别" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.category }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="institute" label="检测机构" width="160" />
      <el-table-column prop="sampleNo" label="样品编号" width="120" />
      <el-table-column prop="result" label="检测结论" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.result === '合格' ? 'success' : 'danger'">{{ row.result }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="testDate" label="检测日期" width="120" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">查看 PDF</el-button>
          <el-button link size="small">下载</el-button>
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
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', result: '' })
const fields = [
  { prop: 'keyword', label: '关键字' },
  { prop: 'result', label: '结论', type: 'select', options: [{label:'合格',value:'合格'},{label:'不合格',value:'不合格'}] },
  { prop: 'date', label: '检测日期', type: 'daterange' }
]
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/quality/report', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
