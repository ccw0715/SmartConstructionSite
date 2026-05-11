<template>
  <div class="video-wall">
    <!-- 左侧：摄像头树 -->
    <div class="side-panel">
      <div class="panel-head">
        <span>摄像头列表</span>
        <span class="text-muted fs-12">{{ onlineCount }} / {{ cameras.length }} 在线</span>
      </div>
      <el-input v-model="keyword" placeholder="搜索摄像头" :prefix-icon="Search" size="small" />
      <div class="cam-tree">
        <div
          v-for="c in filteredCameras"
          :key="c.id"
          class="cam-item"
          :class="{ active: selected.find(s => s.id === c.id), offline: c.status === 'offline' }"
          @click="toggleCamera(c)"
        >
          <el-icon class="cam-ico"><VideoCamera /></el-icon>
          <div class="cam-info">
            <div class="cam-name">{{ c.name }}</div>
            <div class="cam-meta">{{ c.area }} · {{ c.type }} · {{ c.resolution }}</div>
          </div>
          <span class="dot" :class="c.status"></span>
        </div>
      </div>
    </div>

    <!-- 右侧：视频墙 -->
    <div class="wall-area">
      <div class="wall-toolbar">
        <div>
          <span class="fw-500 fs-16">{{ title }}</span>
          <span class="text-muted fs-12" style="margin-left: 12px;">已选 {{ selected.length }} 路</span>
        </div>
        <el-radio-group v-model="grid" size="small">
          <el-radio-button :label="1">1×1</el-radio-button>
          <el-radio-button :label="4">2×2</el-radio-button>
          <el-radio-button :label="9">3×3</el-radio-button>
          <el-radio-button :label="16">4×4</el-radio-button>
        </el-radio-group>
      </div>

      <div class="grid" :style="gridStyle">
        <div v-for="i in grid" :key="i" class="tile">
          <template v-if="selected[i - 1]">
            <div class="tile-bg">
              <el-icon size="40" color="rgba(255,255,255,0.4)"><VideoCamera /></el-icon>
              <div class="tile-overlay">
                <span class="rec">● LIVE</span>
                <span class="tile-name">{{ selected[i - 1].name }}</span>
                <span class="tile-time">{{ now }}</span>
              </div>
              <el-icon class="close" @click="removeAt(i - 1)"><Close /></el-icon>
            </div>
          </template>
          <template v-else>
            <div class="tile-empty">
              <el-icon size="36"><Plus /></el-icon>
              <div style="margin-top: 6px;">点击左侧摄像头添加</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, VideoCamera, Close, Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

const props = defineProps({
  title: { type: String, default: '视频监控' }
})

const cameras = ref([])
const selected = ref([])
const keyword = ref('')
const grid = ref(4)
const now = ref('')
let timer = null

const onlineCount = computed(() => cameras.value.filter(c => c.status === 'online').length)
const filteredCameras = computed(() => {
  if (!keyword.value) return cameras.value
  const q = keyword.value.toLowerCase()
  return cameras.value.filter(c => c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q))
})

const gridStyle = computed(() => {
  const cols = Math.sqrt(grid.value)
  return { gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${cols}, 1fr)` }
})

function toggleCamera(c) {
  if (c.status === 'offline') return
  const idx = selected.value.findIndex(s => s.id === c.id)
  if (idx >= 0) selected.value.splice(idx, 1)
  else if (selected.value.length < grid.value) selected.value.push(c)
}
function removeAt(i) { selected.value.splice(i, 1) }

function tick() {
  const d = new Date()
  now.value = d.toLocaleString('zh-CN', { hour12: false })
}

onMounted(async () => {
  const { data } = await request.get('/video/cameras')
  cameras.value = data.list
  selected.value = data.list.filter(c => c.status === 'online').slice(0, 4)
  tick(); timer = setInterval(tick, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.video-wall {
  display: flex;
  gap: 12px;
  height: calc(100vh - 56px - 49px - 32px);
}
.side-panel {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid $border-light;
}
.panel-head {
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 500;
}
.cam-tree { flex: 1; overflow-y: auto; }
.cam-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px; cursor: pointer;
  margin-bottom: 4px;
  &:hover { background: #f5f7fa; }
  &.active { background: rgba(22,119,255,0.1); border: 1px solid rgba(22,119,255,0.3); }
  &.offline { opacity: 0.5; cursor: not-allowed; }
}
.cam-ico { color: $primary; font-size: 18px; }
.cam-info { flex: 1; min-width: 0; }
.cam-name { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cam-meta { font-size: 11px; color: $text-muted; }
.dot {
  width: 8px; height: 8px; border-radius: 50%;
  &.online { background: $success; box-shadow: 0 0 4px $success; }
  &.offline { background: $info; }
}

.wall-area {
  flex: 1;
  background: #0a1530;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}
.wall-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
  color: #fff;
  .text-muted { color: rgba(255,255,255,0.6) !important; }
}
.grid {
  flex: 1;
  display: grid;
  gap: 8px;
  min-height: 0;
}
.tile {
  background: #0d1b3d;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.tile-bg {
  position: relative; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(circle at 30% 30%, rgba(22,119,255,0.18) 0, transparent 40%),
    radial-gradient(circle at 70% 70%, rgba(78,232,255,0.12) 0, transparent 40%),
    #0d1b3d;
}
.tile-overlay {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 6px 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: #fff; font-size: 12px;
  display: flex; align-items: center; gap: 10px;
}
.rec { color: #ff4d4f; font-weight: 600; }
.tile-name { flex: 1; }
.close {
  position: absolute; right: 6px; top: 6px;
  color: rgba(255,255,255,0.6); cursor: pointer;
  background: rgba(0,0,0,0.4); border-radius: 4px; padding: 4px;
  &:hover { color: #ff4d4f; background: rgba(0,0,0,0.6); }
}
.tile-empty {
  color: rgba(255,255,255,0.3);
  text-align: center;
  font-size: 12px;
}
</style>
