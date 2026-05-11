<template>
  <PageContainer title="喷淋联动" desc="工地降尘喷淋系统，支持与环境监测自动联动">
    <el-row :gutter="16">
      <el-col :sm="12" :md="8" :lg="6" v-for="s in list" :key="s.id">
        <div class="sp-card" :class="{ on: s.running }">
          <div class="head">
            <div class="ttl">{{ s.name }}</div>
            <el-switch v-model="s.running" size="small" />
          </div>
          <div class="ico-area">
            <el-icon size="42" :color="s.running ? '#1677ff' : '#c9cdd4'">
              <Sunny />
            </el-icon>
            <div class="state" :class="{ on: s.running }">{{ s.running ? '运行中' : '待机' }}</div>
          </div>
          <div class="row"><span>区域</span><span>{{ s.area }}</span></div>
          <div class="row"><span>水压</span><span>{{ s.pressure }} MPa</span></div>
          <div class="row"><span>联动</span><span class="text-muted fs-12">{{ s.linkage }}</span></div>
          <div class="row"><span>今日运行</span><span>{{ s.todayRunTime }} 分钟</span></div>
        </div>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sunny } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import request from '@/utils/request'

const list = ref([])
onMounted(async () => { list.value = (await request.get('/device/sprinkler')).data })
</script>

<style lang="scss" scoped>
.sp-card {
  background: #fff; border: 1px solid #e5e6eb; border-radius: 8px;
  padding: 14px 16px; margin-bottom: 16px;
  transition: all 0.2s;
  &.on { border-color: #1677ff; background: linear-gradient(180deg, rgba(22,119,255,0.04) 0%, #fff 100%); }
}
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ttl { font-size: 14px; font-weight: 600; }
.ico-area { text-align: center; padding: 14px 0; }
.state { font-size: 12px; color: #86909c; margin-top: 2px; }
.state.on { color: #1677ff; font-weight: 600; }
.row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; color: #4e5969; }
.row span:first-child { color: #86909c; }
</style>
