<template>
  <PageContainer title="BIM 轻量化展示" desc="基于 BIM 模型的进度、构件、安全可视化（演示版以占位渲染）">
    <div class="bim-shell">
      <!-- 左：模型操作面板 -->
      <div class="side">
        <div class="panel-title">楼层切换</div>
        <el-radio-group v-model="floor" size="small">
          <el-radio-button v-for="f in floors" :key="f" :label="f">{{ f }}</el-radio-button>
        </el-radio-group>

        <div class="panel-title">显示构件</div>
        <el-checkbox-group v-model="parts">
          <el-checkbox value="结构">结构</el-checkbox>
          <el-checkbox value="幕墙">幕墙</el-checkbox>
          <el-checkbox value="机电">机电</el-checkbox>
          <el-checkbox value="精装">精装</el-checkbox>
        </el-checkbox-group>

        <div class="panel-title">叠加图层</div>
        <el-checkbox v-model="showProgress">施工进度</el-checkbox>
        <el-checkbox v-model="showSafety">安全风险点</el-checkbox>
        <el-checkbox v-model="showQuality">质量问题点</el-checkbox>
      </div>

      <!-- 中：BIM 视口（占位） -->
      <div class="viewport">
        <div class="vp-bg">
          <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#1677ff" stop-opacity="0.18" />
                <stop offset="1" stop-color="#4ee8ff" stop-opacity="0.08" />
              </linearGradient>
            </defs>
            <!-- 网格地面 -->
            <g stroke="rgba(78,232,255,0.15)" stroke-width="1">
              <path d="M0 320 L600 320" />
              <path d="M100 280 L500 280" />
              <path d="M200 240 L400 240" />
            </g>
            <!-- 主楼 -->
            <g transform="translate(180,80)">
              <rect width="240" height="220" fill="url(#g1)" stroke="#4ee8ff" stroke-width="2" />
              <!-- 楼层线 -->
              <g stroke="rgba(78,232,255,0.6)" stroke-width="1">
                <line x1="0" y1="44" x2="240" y2="44" />
                <line x1="0" y1="88" x2="240" y2="88" />
                <line x1="0" y1="132" x2="240" y2="132" />
                <line x1="0" y1="176" x2="240" y2="176" />
              </g>
              <!-- 窗户 -->
              <g fill="rgba(78,232,255,0.35)">
                <rect x="20" y="14" width="30" height="20" />
                <rect x="60" y="14" width="30" height="20" />
                <rect x="100" y="14" width="30" height="20" />
                <rect x="140" y="14" width="30" height="20" />
                <rect x="180" y="14" width="30" height="20" />
              </g>
            </g>
            <!-- 标注 -->
            <g v-if="showSafety">
              <circle cx="240" cy="160" r="8" fill="#f5222d">
                <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="252" y="164" fill="#f5222d" font-size="12">临边</text>
            </g>
            <g v-if="showProgress">
              <rect x="180" y="170" width="240" height="130" fill="rgba(82,196,26,0.18)" stroke="#52c41a" stroke-dasharray="3 3"/>
              <text x="260" y="240" fill="#52c41a" font-size="14" font-weight="600">已完成 62%</text>
            </g>
            <g v-if="showQuality">
              <circle cx="340" cy="120" r="6" fill="#faad14" />
              <text x="350" y="124" fill="#faad14" font-size="12">质检点</text>
            </g>
          </svg>
        </div>
        <div class="vp-toolbar">
          <el-button-group>
            <el-button :icon="ZoomIn">放大</el-button>
            <el-button :icon="ZoomOut">缩小</el-button>
            <el-button :icon="RefreshLeft">复位</el-button>
            <el-button :icon="FullScreen">全屏</el-button>
          </el-button-group>
        </div>
        <div class="vp-info">
          <div>当前楼层：<b>{{ floor }}</b></div>
          <div>显示构件：<b>{{ parts.join(' / ') || '-' }}</b></div>
        </div>
      </div>

      <!-- 右：构件信息 -->
      <div class="side right">
        <div class="panel-title">模型信息</div>
        <div class="info-row"><span>项目名称</span><span>中建科技产业园 A 区</span></div>
        <div class="info-row"><span>模型版本</span><span>v2.4.1</span></div>
        <div class="info-row"><span>构件总数</span><span>12,860</span></div>
        <div class="info-row"><span>模型大小</span><span>327 MB</span></div>
        <div class="info-row"><span>更新时间</span><span>2026-04-28</span></div>

        <div class="panel-title">关联问题</div>
        <div class="issue"><el-tag size="small" type="danger">安全</el-tag> 12F 临边防护缺失</div>
        <div class="issue"><el-tag size="small" type="warning">质量</el-tag> 8F 梁柱节点钢筋偏位</div>
        <div class="issue"><el-tag size="small" effect="plain">进度</el-tag> 主体已浇筑至 20F</div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { ZoomIn, ZoomOut, RefreshLeft, FullScreen } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'

const floors = ['B3','B1','F1','F5','F12','F20','F32']
const floor = ref('F12')
const parts = ref(['结构', '机电'])
const showProgress = ref(true)
const showSafety = ref(true)
const showQuality = ref(false)
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.bim-shell {
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  gap: 12px;
  height: calc(100vh - 56px - 49px - 32px - 80px);
}
.side {
  background: #fff; border: 1px solid $border-light; border-radius: 8px;
  padding: 14px; overflow-y: auto;
}
.panel-title {
  font-size: 12px; color: $text-muted; margin: 8px 0; font-weight: 500;
  &:first-child { margin-top: 0; }
}
.info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; color: $text-secondary; }
.info-row span:first-child { color: $text-muted; }
.issue { font-size: 13px; padding: 6px 0; display: flex; align-items: center; gap: 6px; }

.viewport {
  background: #0a1530; border-radius: 8px; position: relative; overflow: hidden;
}
.vp-bg { width: 100%; height: 100%; svg { width: 100%; height: 100%; display: block; } }
.vp-toolbar {
  position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);
}
.vp-info {
  position: absolute; top: 12px; left: 12px;
  background: rgba(0,0,0,0.5); color: #fff; padding: 8px 12px; border-radius: 6px;
  font-size: 12px; backdrop-filter: blur(4px);
  div + div { margin-top: 2px; }
}
:deep(.el-checkbox-group) { display: flex; flex-direction: column; gap: 4px; }
:deep(.el-checkbox) { margin-right: 0; }
</style>
