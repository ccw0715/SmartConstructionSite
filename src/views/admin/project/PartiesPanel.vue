<template>
  <div class="parties-panel">
    <div class="toolbar">
      <el-button v-if="editable" type="primary" :icon="Plus" size="small" @click="onAdd">新增主体</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="type" label="主体类型" width="120">
        <template #default="{ row }"><el-tag effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="company" label="单位名称" min-width="220" />
      <el-table-column prop="legalPerson" label="法定代表人" width="120" />
      <el-table-column prop="contact" label="联系人" width="100" />
      <el-table-column prop="phone" label="联系电话" width="140" />
      <el-table-column prop="certNo" label="资质证书号" width="160" />
      <el-table-column prop="joinDate" label="进场日期" width="120" />
      <el-table-column v-if="editable" label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="onRemove(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="drawerOpen" :title="editing?.id ? '编辑主体' : '新增主体'" size="500px" append-to-body>
      <el-form :model="editing" label-width="100px">
        <el-form-item label="主体类型">
          <el-select v-model="editing.type" style="width:100%">
            <el-option v-for="t in SUBJECTS" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称"><el-input v-model="editing.company" /></el-form-item>
        <el-form-item label="法定代表人"><el-input v-model="editing.legalPerson" /></el-form-item>
        <el-form-item label="联系人"><el-input v-model="editing.contact" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="editing.phone" /></el-form-item>
        <el-form-item label="资质证书号"><el-input v-model="editing.certNo" /></el-form-item>
        <el-form-item label="进场日期">
          <el-date-picker v-model="editing.joinDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerOpen = false">取消</el-button>
        <el-button type="primary" @click="saveDrawer">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { SUBJECTS } from '@/utils/dict'
import request from '@/utils/request'

const props = defineProps({
  projectId: { type: String, required: true },
  editable: { type: Boolean, default: false }
})

const list = ref([])
const loading = ref(false)
const drawerOpen = ref(false)
const editing = ref({})

async function load() {
  loading.value = true
  const { data } = await request.get(`/project/parties/${props.projectId}`)
  list.value = data
  loading.value = false
}

function onAdd() { editing.value = { type: SUBJECTS[0] }; drawerOpen.value = true }
function onEdit(row) { editing.value = { ...row }; drawerOpen.value = true }
function onRemove(row) {
  list.value = list.value.filter(i => i.id !== row.id)
  ElMessage.success('已移除（演示）')
}
function saveDrawer() {
  if (editing.value.id) {
    const i = list.value.findIndex(x => x.id === editing.value.id)
    if (i >= 0) list.value[i] = { ...editing.value }
  } else {
    list.value.unshift({ ...editing.value, id: 'P' + Date.now() })
  }
  drawerOpen.value = false
  ElMessage.success('保存成功')
}

watch(() => props.projectId, load, { immediate: true })
</script>

<style lang="scss" scoped>
.parties-panel { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; justify-content: flex-end; }
</style>
