<template>
  <PageContainer title="浇筑记录" desc="混凝土浇筑施工记录">
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">新增浇筑</el-button>
      </template>
      <el-table-column prop="no" label="浇筑单号" width="160" />
      <el-table-column prop="site" label="浇筑部位" min-width="140" />
      <el-table-column prop="grade" label="强度" width="80" />
      <el-table-column prop="plannedQty" label="计划方量" width="100">
        <template #default="{ row }">{{ row.plannedQty }} m³</template>
      </el-table-column>
      <el-table-column prop="actualQty" label="实际方量" width="100">
        <template #default="{ row }">{{ row.actualQty }} m³</template>
      </el-table-column>
      <el-table-column prop="pourMethod" label="浇筑方式" width="100" />
      <el-table-column prop="startTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column prop="supervisor" label="监理" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20 })
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/concrete/pour', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
