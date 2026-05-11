<template>
  <PageContainer title="危大工程信息" desc="危险性较大的分部分项工程清单管理">
    <SearchBar v-model="query" :fields="fields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">新增危大项</el-button>
      </template>
      <el-table-column prop="id" label="编号" width="120" />
      <el-table-column prop="name" label="工程名称" min-width="220" />
      <el-table-column prop="type" label="类别" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.level === '超危大' ? 'danger' : 'warning'">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="120" />
      <el-table-column prop="endDate" label="结束日期" width="120" />
      <el-table-column prop="responsible" label="责任工程师" width="120" />
      <el-table-column prop="planStatus" label="方案审批" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.planStatus === '已审批' ? 'success' : 'warning'" effect="plain">{{ row.planStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="监测" width="80">
        <template #default="{ row }"><StatusTag :status="row.monitorStatus" /></template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">详情</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20, keyword: '', level: '' })
const fields = [
  { prop: 'keyword', label: '关键字' },
  { prop: 'level', label: '等级', type: 'select', options: ['危大', '超危大'].map(v => ({label:v,value:v})) }
]
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/hazard/danger', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
