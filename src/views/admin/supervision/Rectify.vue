<template>
  <PageContainer title="整改通知" desc="问题整改通知单的下发、跟踪、销项">
    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6" v-for="k in stats" :key="k.label">
        <div class="mini-stat" :style="{borderLeft: `3px solid ${k.color}`}">
          <div class="mini-label">{{ k.label }}</div>
          <div class="mini-value">{{ k.value }}<span class="unit">条</span></div>
        </div>
      </el-col>
    </el-row>

    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">下发整改单</el-button>
      </template>
      <el-table-column prop="no" label="通知单号" width="140" />
      <el-table-column prop="source" label="来源" width="110" />
      <el-table-column prop="title" label="标题" min-width="280" show-overflow-tooltip />
      <el-table-column prop="issueDate" label="下发日期" width="120" />
      <el-table-column prop="dueDate" label="完成期限" width="120" />
      <el-table-column prop="responsible" label="责任人" width="100" />
      <el-table-column prop="attachments" label="附件" width="70" align="center">
        <template #default="{ row }">
          <el-icon><Paperclip /></el-icon> {{ row.attachments }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small">查看</el-button>
          <el-button v-if="row.status !== 'rectified'" link type="success" size="small">销项</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Paperclip } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { RECTIFY_STATUS } from '@/utils/dict'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', status: '' })
const searchFields = [
  { prop: 'keyword', label: '关键字' },
  { prop: 'status', label: '状态', type: 'select', options: RECTIFY_STATUS },
  { prop: 'date', label: '下发日期', type: 'daterange' }
]
const stats = computed(() => [
  { label: '本月新增', value: 12, color: '#1677ff' },
  { label: '未整改', value: list.value.filter(i=>i.status==='unrectified').length, color: '#f5222d' },
  { label: '整改中', value: list.value.filter(i=>i.status==='rectifying').length, color: '#faad14' },
  { label: '已销项', value: list.value.filter(i=>i.status==='rectified').length, color: '#52c41a' }
])
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/supervision/rectify', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>

<style lang="scss" scoped>
.mini-stat { background: #fff; padding: 12px 16px; border: 1px solid #e5e6eb; border-radius: 6px; }
.mini-label { font-size: 12px; color: #86909c; }
.mini-value { font-size: 22px; font-weight: 600; margin-top: 2px; color: #1f2329; }
.mini-value .unit { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 4px; }
</style>
