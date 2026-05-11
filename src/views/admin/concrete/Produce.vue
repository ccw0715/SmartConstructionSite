<template>
  <PageContainer title="生产信息" desc="商品混凝土生产票据">
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <el-table-column prop="ticket" label="生产单号" width="160" />
      <el-table-column prop="grade" label="强度等级" width="100">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.grade }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" width="140" />
      <el-table-column prop="station" label="搅拌站" width="120" />
      <el-table-column prop="quantity" label="数量">
        <template #default="{ row }">{{ row.quantity }} m³</template>
      </el-table-column>
      <el-table-column prop="produceTime" label="生产时间" width="180" />
      <el-table-column prop="qualityResult" label="质量结果" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.qualityResult === '合格' ? 'success' : 'warning'">{{ row.qualityResult }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default><el-button link type="primary" size="small">详情</el-button></template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import request from '@/utils/request'

const list = ref([]), total = ref(0), loading = ref(false)
const query = reactive({ page: 1, pageSize: 20 })
async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/concrete/produce', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
