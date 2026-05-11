<template>
  <PageContainer title="项目班组" desc="进场作业班组管理">
    <template #header>
      <el-button type="primary" :icon="Plus">新增班组</el-button>
    </template>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="t in list" :key="t.id">
        <div class="team-card">
          <div class="team-head">
            <el-icon size="22" color="#1677ff"><Avatar /></el-icon>
            <div class="team-name">{{ t.name }}</div>
            <StatusTag :status="t.status" />
          </div>
          <div class="team-row"><span class="lbl">班组长</span><span>{{ t.leader }}</span></div>
          <div class="team-row"><span class="lbl">工种</span><span>{{ t.trade }}</span></div>
          <div class="team-row"><span class="lbl">人数</span><span class="fw-600" style="color:#1677ff">{{ t.memberCount }} 人</span></div>
          <div class="team-row"><span class="lbl">联系电话</span><span>{{ t.phone }}</span></div>
          <div class="team-row"><span class="lbl">进场</span><span>{{ t.enterDate }}</span></div>
          <div class="team-actions">
            <el-button link type="primary" size="small">查看成员</el-button>
            <el-button link size="small">编辑</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])

onMounted(async () => {
  const { data } = await request.get('/staff/team')
  list.value = data.list
})
</script>

<style lang="scss" scoped>
.team-card {
  background: #fff; border: 1px solid #e5e6eb; border-radius: 8px;
  padding: 16px; margin-bottom: 16px; transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.06); border-color: #1677ff; }
}
.team-head {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  padding-bottom: 12px; border-bottom: 1px dashed #e5e6eb;
}
.team-name { flex: 1; font-size: 16px; font-weight: 600; }
.team-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; color: #4e5969; }
.team-row .lbl { color: #86909c; }
.team-actions { display: flex; justify-content: flex-end; margin-top: 6px; padding-top: 8px; border-top: 1px dashed #e5e6eb; }
</style>
