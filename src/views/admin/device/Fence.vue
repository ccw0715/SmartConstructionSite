<template>
  <PageContainer title="电子围栏" desc="危险区域电子围栏入侵监测">
    <el-table :data="list" stripe>
      <el-table-column prop="id" label="围栏 ID" width="120" />
      <el-table-column prop="name" label="围栏名称" />
      <el-table-column prop="type" label="围栏类型" width="120">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="triggerToday" label="今日触发" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.triggerToday" size="small" type="warning">{{ row.triggerToday }} 次</el-tag>
          <span v-else class="text-muted">0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default>
          <el-button link type="primary" size="small">触发记录</el-button>
          <el-button link size="small">编辑围栏</el-button>
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
onMounted(async () => { list.value = (await request.get('/device/fence')).data })
</script>
