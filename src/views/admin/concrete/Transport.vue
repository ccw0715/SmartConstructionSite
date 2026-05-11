<template>
  <PageContainer title="运输记录" desc="混凝土运输车进场出场记录">
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <el-table-column prop="ticket" label="生产单号" width="160" />
      <el-table-column prop="vehicleNo" label="车牌号" width="120" />
      <el-table-column prop="driver" label="司机" width="100" />
      <el-table-column prop="grade" label="强度" width="80" />
      <el-table-column prop="quantity" label="方量">
        <template #default="{ row }">{{ row.quantity }} m³</template>
      </el-table-column>
      <el-table-column prop="startTime" label="出厂时间" width="160" />
      <el-table-column prop="arriveTime" label="到场时间" width="160" />
      <el-table-column prop="duration" label="运输时长" width="100">
        <template #default="{ row }">{{ row.duration }} 分钟</template>
      </el-table-column>
      <el-table-column prop="temperature" label="到场温度" width="100">
        <template #default="{ row }">{{ row.temperature }} ℃</template>
      </el-table-column>
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
  const { data } = await request.get('/concrete/transport', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
