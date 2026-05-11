<template>
  <PageContainer title="起重机械" desc="塔吊、施工升降机等起重设备台账及检查记录">
    <el-table :data="list" stripe>
      <el-table-column prop="id" label="设备编号" width="120" />
      <el-table-column prop="name" label="设备名称" width="160" />
      <el-table-column prop="type" label="设备类型" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="model" label="型号" width="100" />
      <el-table-column prop="spec" label="主要参数" min-width="220" />
      <el-table-column prop="driver" label="操作司机" width="100" />
      <el-table-column prop="inspectionDate" label="上次检验" width="120" />
      <el-table-column prop="nextInspectionDate" label="下次检验" width="120">
        <template #default="{ row }">
          <span :style="{ color: dueSoon(row.nextInspectionDate) ? '#f5222d' : 'inherit', fontWeight: dueSoon(row.nextInspectionDate) ? 600 : 400 }">
            {{ row.nextInspectionDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="installer" label="安装单位" width="200" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">检查记录</el-button>
          <el-button link size="small">证书</el-button>
        </template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])
function dueSoon(d) {
  return dayjs(d).diff(dayjs(), 'day') < 30
}
onMounted(async () => { list.value = (await request.get('/hazard/crane')).data })
</script>
