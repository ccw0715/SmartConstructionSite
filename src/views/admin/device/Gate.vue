<template>
  <PageContainer title="车道闸" desc="车辆进出场抓拍记录与道闸状态">
    <el-row :gutter="16">
      <el-col :sm="12" :md="6" v-for="g in list" :key="g.id">
        <el-card class="gate-card">
          <div class="head">
            <div class="ttl">{{ g.name }}</div>
            <StatusTag :status="g.status" />
          </div>
          <div class="cnt">
            <div class="m"><div class="lbl">今日入场</div><div class="v in">{{ g.todayIn }}</div></div>
            <div class="m"><div class="lbl">今日出场</div><div class="v out">{{ g.todayOut }}</div></div>
          </div>
          <div class="last">
            <el-icon><Van /></el-icon>
            <div>
              <div class="plate">{{ g.lastVehicle }}</div>
              <div class="t">{{ formatDateTime(g.lastTime) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Van } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatDateTime } from '@/utils/format'
import request from '@/utils/request'

const list = ref([])
onMounted(async () => { list.value = (await request.get('/device/gate')).data })
</script>

<style lang="scss" scoped>
.gate-card { margin-bottom: 16px; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ttl { font-size: 15px; font-weight: 600; }
.cnt { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.m { background: #fafbfc; border-radius: 6px; padding: 10px; text-align: center; }
.lbl { font-size: 12px; color: #86909c; }
.v { font-size: 22px; font-weight: 600; }
.v.in { color: #52c41a; } .v.out { color: #1677ff; }
.last {
  background: linear-gradient(135deg, #1677ff, #4ee8ff);
  color: #fff; padding: 10px 12px; border-radius: 6px;
  display: flex; align-items: center; gap: 10px;
  .el-icon { font-size: 22px; }
  .plate { font-size: 14px; font-weight: 600; letter-spacing: 1px; }
  .t { font-size: 11px; opacity: 0.85; }
}
</style>
