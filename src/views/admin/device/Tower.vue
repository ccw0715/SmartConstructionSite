<template>
  <PageContainer title="塔吊安全监测" desc="实时监测高度、幅度、力矩、风速、倾角等参数">
    <el-row :gutter="16">
      <el-col :sm="12" :md="6" v-for="t in list" :key="t.id">
        <div class="tower" :class="t.status">
          <div class="head">
            <div class="ttl">{{ t.name }}</div>
            <StatusTag :status="t.status" />
          </div>
          <div class="row"><span>型号</span><span>{{ t.model }}</span></div>
          <div class="row"><span>司机</span><span>{{ t.driver }}</span></div>
          <el-divider />
          <div class="metrics">
            <div class="m"><div class="lbl">高度</div><div class="val">{{ t.height }}<i>m</i></div></div>
            <div class="m"><div class="lbl">幅度</div><div class="val">{{ t.amplitude }}<i>m</i></div></div>
            <div class="m"><div class="lbl">载重</div><div class="val">{{ t.weight }}<i>t</i></div></div>
            <div class="m"><div class="lbl">回转</div><div class="val">{{ t.rotation }}<i>°</i></div></div>
            <div class="m" :class="{ over: +t.windSpeed > 6 }">
              <div class="lbl">风速</div>
              <div class="val">{{ t.windSpeed }}<i>m/s</i></div>
            </div>
            <div class="m" :class="{ over: +t.tilt > 0.8 }">
              <div class="lbl">倾角</div>
              <div class="val">{{ t.tilt }}<i>°</i></div>
            </div>
          </div>
        </div>
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
onMounted(async () => {
  const { data } = await request.get('/device/tower')
  list.value = data
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.tower {
  background: #fff; border-radius: 8px; padding: 16px;
  border: 1px solid $border-light; margin-bottom: 16px;
  &.warning { border-color: #ffd591; background: linear-gradient(180deg,#fff7e6 0%, #fff 60%); }
}
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.ttl { font-size: 16px; font-weight: 600; }
.row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; color: $text-secondary; }
.row span:first-child { color: $text-muted; }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.m {
  background: #fafbfc; border-radius: 6px; padding: 8px 6px;
  text-align: center;
  &.over { background: #fff1f0; }
}
.lbl { font-size: 11px; color: $text-muted; }
.val { font-size: 18px; font-weight: 600; color: $text-primary; margin-top: 2px; }
.m.over .val { color: $danger; }
.val i { font-size: 11px; color: $text-muted; margin-left: 2px; font-style: normal; font-weight: 400; }
:deep(.el-divider) { margin: 12px 0; }
</style>
