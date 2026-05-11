<template>
  <PageContainer title="视频监控主机" desc="NVR 设备运行状态与通道占用">
    <el-table :data="list" stripe>
      <el-table-column prop="id" label="设备 ID" width="140" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="location" label="部署位置" width="140" />
      <el-table-column label="通道" width="160">
        <template #default="{ row }">
          <span style="color:#52c41a; font-weight:600">{{ row.online }}</span> /
          <span>{{ row.channels }}</span> 路在线
        </template>
      </el-table-column>
      <el-table-column label="存储占用" width="200">
        <template #default="{ row }">
          <el-progress :percentage="row.storage" :stroke-width="10"
            :color="row.storage > 85 ? '#f5222d' : '#1677ff'" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default>
          <el-button link type="primary" size="small">通道列表</el-button>
          <el-button link size="small">详情</el-button>
        </template>
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
onMounted(async () => { list.value = (await request.get('/device/nvr')).data })
</script>
