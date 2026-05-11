<template>
  <PageContainer title="升降机监测" desc="施工电梯运行参数、载重、人数实时监控">
    <el-row :gutter="16">
      <el-col :sm="8" v-for="l in list" :key="l.id">
        <el-card class="lift-card">
          <div class="head">
            <div class="ttl">{{ l.name }}<span class="text-muted fs-12" style="margin-left:8px;">{{ l.model }}</span></div>
            <StatusTag :status="l.status" />
          </div>
          <div class="big">
            <div class="b">
              <div class="lbl">当前高度</div>
              <div class="v">{{ l.height }}<i>m</i></div>
            </div>
            <div class="b">
              <div class="lbl">运行速度</div>
              <div class="v">{{ l.speed }}<i>m/s</i></div>
            </div>
          </div>
          <div class="row"><span>载重</span><span><b>{{ l.load }}</b> / {{ l.loadLimit }} kg</span></div>
          <el-progress :percentage="l.load / l.loadLimit * 100" :show-text="false" :stroke-width="8"
            :color="l.load / l.loadLimit > 0.9 ? '#f5222d' : '#1677ff'" />
          <div class="row"><span>载人</span><span><b>{{ l.people }}</b> / {{ l.peopleLimit }} 人</span></div>
          <el-progress :percentage="l.people / l.peopleLimit * 100" :show-text="false" :stroke-width="8" color="#52c41a" />
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import StatusTag from '@/components/StatusTag.vue'
import request from '@/utils/request'

const list = ref([])
onMounted(async () => { list.value = (await request.get('/device/lift')).data })
</script>

<style lang="scss" scoped>
.lift-card { margin-bottom: 16px; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ttl { font-size: 16px; font-weight: 600; }
.big { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.b { background: #fafbfc; border-radius: 6px; padding: 12px; }
.b .lbl { font-size: 12px; color: #86909c; }
.b .v { font-size: 22px; font-weight: 600; margin-top: 4px; color: #1f2329; }
.b .v i { font-size: 12px; color: #86909c; font-weight: 400; margin-left: 3px; font-style: normal; }
.row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0 4px; color: #4e5969; }
.row span:first-child { color: #86909c; }
</style>
