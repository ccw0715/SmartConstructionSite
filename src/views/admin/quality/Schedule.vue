<template>
  <PageContainer title="检测计划" desc="月度/季度检测任务计划">
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">新增计划</el-button>
      </template>
      <el-table-column prop="no" label="计划编号" width="160" />
      <el-table-column prop="category" label="类别" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.category }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="item" label="检测项目" width="180" />
      <el-table-column prop="frequency" label="频次" width="100" />
      <el-table-column prop="expectedDate" label="计划日期" width="120" />
      <el-table-column prop="responsible" label="负责人" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status !== 'done'" link type="primary" size="small">执行</el-button>
          <el-button link size="small">详情</el-button>
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
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20 })
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/quality/schedule', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
