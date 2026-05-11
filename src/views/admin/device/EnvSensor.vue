<template>
  <PageContainer title="环境监测设备" desc="环境监测设备运行状态（监测数据请见 文明施工 / 环境监测）">
    <el-table :data="list" stripe>
      <el-table-column prop="id" label="设备 ID" width="120" />
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="location" label="安装位置" width="180" />
      <el-table-column label="监测项目">
        <template #default="{ row }">
          <el-tag v-for="it in row.items" :key="it" size="small" effect="plain" style="margin: 2px;">{{ it }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])
onMounted(async () => { list.value = (await request.get('/device/env-sensor')).data })
</script>
