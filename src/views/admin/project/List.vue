<template>
  <PageContainer title="工程管理" desc="项目列表 · 点击「详情」查看工程信息 / 五方主体 / 形象进度">
    <SearchBar v-model="query" :fields="fields" @search="load" @reset="load" />

    <DataTable :data="list" :loading="loading" :total="list.length" :page="1" :page-size="20" :show-index="false">
      <template #toolbar>
        <el-button type="primary" :icon="Plus" @click="onCreate">新增项目</el-button>
      </template>

      <el-table-column prop="code" label="项目编号" width="160" />
      <el-table-column label="项目名称" min-width="240">
        <template #default="{ row }">
          <div class="proj-name">
            <span class="fw-500">{{ row.name }}</span>
            <el-tag v-if="row.star" size="small" type="warning" effect="dark" style="margin-left: 8px;">
              <el-icon><StarFilled /></el-icon> {{ row.star }} 星
            </el-tag>
          </div>
          <div class="text-muted fs-12 mt-4">{{ row.address }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="工程类型" width="130">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="80" />
      <el-table-column label="工期" width="200">
        <template #default="{ row }">
          <div class="fs-12">{{ row.startDate }} ~ {{ row.endDate }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="manager" label="项目经理" width="100" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">详情</el-button>
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="onDelete(row)">删除</el-button>
          <el-button link type="success" size="small" @click="openScreen(row)">智慧大屏</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <!-- 详情弹窗：长宽各占 80%，最小 720x1080 -->
    <el-dialog
      v-model="detailOpen"
      :title="currentTitle"
      width="80vw"
      :style="dialogStyle"
      destroy-on-close
      align-center
      class="project-detail-dialog"
    >
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="工程信息" name="info">
          <InfoPanel v-if="detailOpen && current.id" :project-id="current.id" :editable="false" />
        </el-tab-pane>
        <el-tab-pane label="五方主体" name="parties">
          <PartiesPanel v-if="detailOpen && current.id" :project-id="current.id" :editable="false" />
        </el-tab-pane>
        <el-tab-pane label="形象进度" name="progress">
          <ProgressPanel v-if="detailOpen && current.id" :project-id="current.id" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
        <el-button type="primary" @click="openScreen(current)">进入智慧大屏</el-button>
      </template>
    </el-dialog>

    <!-- 编辑抽屉（简化版） -->
    <el-drawer v-model="editOpen" :title="editing.id ? '编辑项目' : '新增项目'" size="600px">
      <el-form :model="editing" label-width="100px">
        <el-form-item label="项目名称"><el-input v-model="editing.name" /></el-form-item>
        <el-form-item label="项目编号"><el-input v-model="editing.code" /></el-form-item>
        <el-form-item label="工程类型">
          <el-select v-model="editing.type" style="width:100%">
            <el-option label="房屋建筑工程" value="房屋建筑工程" />
            <el-option label="市政工程" value="市政工程" />
            <el-option label="装饰装修" value="装饰装修" />
          </el-select>
        </el-form-item>
        <el-form-item label="工程等级">
          <el-select v-model="editing.level" style="width:100%">
            <el-option v-for="l in ['特类','一类','二类','三类']" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理"><el-input v-model="editing.manager" /></el-form-item>
        <el-form-item label="工期">
          <el-date-picker
            v-model="editingRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开工日期"
            end-placeholder="竣工日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="项目地址"><el-input v-model="editing.address" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editOpen = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-drawer>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, StarFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import InfoPanel from './InfoPanel.vue'
import PartiesPanel from './PartiesPanel.vue'
import ProgressPanel from './ProgressPanel.vue'
import request from '@/utils/request'

const router = useRouter()

const list = ref([])
const loading = ref(false)
const query = reactive({ keyword: '', type: '', status: '' })

const fields = [
  { prop: 'keyword', label: '关键字', placeholder: '名称/编号/项目经理' },
  { prop: 'type', label: '工程类型', type: 'select', options: ['房屋建筑工程','市政工程','装饰装修'].map(v => ({ label: v, value: v })) },
  { prop: 'status', label: '状态', type: 'select', options: [
    { label: '进行中', value: 'active' },
    { label: '已完工', value: 'done' }
  ]}
]

// 详情弹窗
const detailOpen = ref(false)
const activeTab = ref('info')
const current = ref({})
const currentTitle = computed(() => current.value.name ? `项目详情 - ${current.value.name}` : '项目详情')

// 弹窗最小尺寸 720 × 1080
const dialogStyle = { minWidth: '720px', minHeight: '1080px', maxHeight: '90vh' }

// 编辑抽屉
const editOpen = ref(false)
const editing = ref({})
const editingRange = ref([])

async function load() {
  loading.value = true
  const { data } = await request.get('/project/list', { params: query })
  list.value = data.list
  loading.value = false
}

function openDetail(row) {
  current.value = row
  activeTab.value = 'info'
  detailOpen.value = true
}

function onCreate() {
  editing.value = { type: '房屋建筑工程', level: '一类', status: 'active' }
  editingRange.value = []
  editOpen.value = true
}
function onEdit(row) {
  editing.value = { ...row }
  editingRange.value = [row.startDate, row.endDate]
  editOpen.value = true
}
function saveEdit() {
  if (editingRange.value && editingRange.value.length === 2) {
    editing.value.startDate = editingRange.value[0]
    editing.value.endDate = editingRange.value[1]
  }
  if (editing.value.id) {
    const i = list.value.findIndex(p => p.id === editing.value.id)
    if (i >= 0) list.value[i] = { ...editing.value }
  } else {
    list.value.unshift({ ...editing.value, id: 'PRJ-' + Date.now() })
  }
  editOpen.value = false
  ElMessage.success('保存成功')
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除项目「${row.name}」吗？`, '删除确认', { type: 'warning' })
    list.value = list.value.filter(p => p.id !== row.id)
    ElMessage.success('已删除（演示）')
  } catch {}
}

function openScreen(row) {
  current.value = row
  const url = router.resolve({ path: '/screen', query: { projectId: row.id } }).href
  window.open(url, '_blank')
}

onMounted(load)
</script>

<style lang="scss" scoped>
.proj-name { display: flex; align-items: center; }
.mt-4 { margin-top: 4px; }
</style>

<style>
.project-detail-dialog .el-dialog__body { padding: 0 24px 24px; max-height: calc(90vh - 110px); overflow-y: auto; }
.project-detail-dialog .detail-tabs { padding-top: 4px; }
.project-detail-dialog .el-tabs__nav-wrap::after { background-color: #e5e6eb; }
</style>
