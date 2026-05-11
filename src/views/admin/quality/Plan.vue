<template>
  <PageContainer title="检测方案" desc="质量检测专项方案的编制、审批与归档">
    <SearchBar v-model="query" :fields="fields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">编制方案</el-button>
      </template>
      <el-table-column prop="no" label="方案编号" width="160" />
      <el-table-column prop="title" label="方案标题" min-width="220" />
      <el-table-column prop="category" label="类别" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.category }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="reviewer" label="审核单位" width="120" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="reviewStatus" label="审核状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.reviewStatus === '已批准' ? 'success' : 'warning'" effect="plain">{{ row.reviewStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="attachments" label="附件" width="70" align="center">
        <template #default="{ row }"><el-icon><Paperclip /></el-icon> {{ row.attachments }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">查看</el-button>
          <el-button link type="primary" size="small">下载</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Paperclip } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', category: '' })
const fields = [
  { prop: 'keyword', label: '关键字' },
  { prop: 'category', label: '类别', type: 'select', options: ['材料检测','结构检测','功能性检测'].map(v=>({label:v,value:v})) }
]
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/quality/plan', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
