<template>
  <PageContainer title="监测信息" desc="混凝土试块强度发展监测">
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <el-table-column prop="sample" label="试块编号" width="160" />
      <el-table-column prop="site" label="试块部位" min-width="140" />
      <el-table-column prop="grade" label="设计强度" width="100" />
      <el-table-column label="3 天" width="100" align="center">
        <template #default="{ row }">{{ row.age3 }} MPa</template>
      </el-table-column>
      <el-table-column label="7 天" width="100" align="center">
        <template #default="{ row }">{{ row.age7 }} MPa</template>
      </el-table-column>
      <el-table-column label="28 天" width="120" align="center">
        <template #default="{ row }">
          <span :style="{ color: row.age28 < row.designStrength ? '#f5222d' : '#52c41a', fontWeight: 600 }">
            {{ row.age28 }} MPa
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="结论" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.result === '合格' ? 'success' : 'warning'">{{ row.result }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reportDate" label="报告日期" width="120" />
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
  const { data } = await request.get('/concrete/monitor', { params: query })
  list.value = data.list; total.value = data.total; loading.value = false
}
onMounted(() => load(1))
</script>
