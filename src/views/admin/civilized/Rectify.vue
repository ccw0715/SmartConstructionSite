<template>
  <PageContainer title="整改记录" desc="环境告警后的处置整改记录（含喷淋联动等措施）">
    <DataTable
      :data="list" :loading="loading" :total="total" :show-index="false"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <el-table-column prop="id" label="编号" width="120" />
      <el-table-column prop="alarmId" label="关联报警" width="120" />
      <el-table-column prop="type" label="整改类型" width="140">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="measure" label="采取措施" min-width="160" />
      <el-table-column prop="responsible" label="责任人" width="140" />
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20 })
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/civilized/rectify', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
