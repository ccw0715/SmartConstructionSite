<template>
  <PageContainer title="远程广播调度" desc="工地分区域广播喊话">
    <el-row :gutter="16" class="mb-16">
      <el-col :sm="12">
        <el-card>
          <template #header><span class="fw-500">一键广播</span></template>
          <el-form label-width="80px">
            <el-form-item label="广播区域">
              <el-checkbox-group v-model="selectedAreas">
                <el-checkbox v-for="b in list" :key="b.id" :value="b.id">{{ b.area }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="广播内容">
              <el-input v-model="content" type="textarea" :rows="3" placeholder="输入广播内容，或选择常用模板" />
            </el-form-item>
            <el-form-item label="常用模板">
              <el-button v-for="t in templates" :key="t" size="small" @click="content = t">{{ t }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Microphone" @click="onBroadcast">开始广播</el-button>
              <el-button :icon="VideoPause">紧急停止</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :sm="12">
        <el-card>
          <template #header><span class="fw-500">终端状态</span></template>
          <el-table :data="list" size="default">
            <el-table-column prop="name" label="终端" width="140" />
            <el-table-column prop="area" label="覆盖区域" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }"><StatusTag :status="row.status" /></template>
            </el-table-column>
            <el-table-column prop="lastBroadcast" label="最后广播" min-width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Microphone, VideoPause } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])
const selectedAreas = ref([])
const content = ref('')
const templates = ['请佩戴安全帽进入施工现场', '雷雨天气暂停高空作业', '下班时间到，请有序撤离', '紧急疏散，请立即撤离']

function onBroadcast() {
  if (!selectedAreas.value.length) return ElMessage.warning('请选择广播区域')
  if (!content.value) return ElMessage.warning('请输入广播内容')
  ElMessage.success(`已向 ${selectedAreas.value.length} 个区域发送广播`)
}

onMounted(async () => { list.value = (await request.get('/device/broadcast')).data })
</script>
