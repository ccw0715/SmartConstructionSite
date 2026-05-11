<template>
  <PageContainer title="五方主体" desc="建设、施工、监理、设计、勘察五方主体单位维护">
    <template #header>
      <el-button type="primary" :icon="Plus" @click="onAdd">新增主体</el-button>
    </template>

    <DataTable :data="list" :total="list.length" :page="1" :page-size="20" :loading="loading">
      <el-table-column prop="type" label="主体类型" width="120">
        <template #default="{ row }"><el-tag effect="plain">{{ row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="company" label="单位名称" min-width="220" />
      <el-table-column prop="legalPerson" label="法定代表人" width="120" />
      <el-table-column prop="contact" label="联系人" width="100" />
      <el-table-column prop="phone" label="联系电话" width="140" />
      <el-table-column prop="certNo" label="资质证书号" width="160" />
      <el-table-column prop="joinDate" label="进场日期" width="120" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small">移除</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <el-drawer v-model="drawerOpen" :title="editing?.id ? '编辑主体' : '新增主体'" size="500px">
      <el-form :model="editing" label-width="100px">
        <el-form-item label="主体类型">
          <el-select v-model="editing.type" style="width:100%">
            <el-option v-for="t in subjects" :key="t" :label="t" :value="t" />
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
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import { SUBJECTS } from '@/utils/dict'
import request from '@/utils/request'

const loading = ref(true)
const list = ref([])
const drawerOpen = ref(false)
const editing = ref({})
const subjects = SUBJECTS

async function load() {
  loading.value = true
  const { data } = await request.get('/project/parties')
  list.value = data
  loading.value = false
}

function onAdd() { editing.value = { type: SUBJECTS[0] }; drawerOpen.value = true }
function onEdit(row) { editing.value = { ...row }; drawerOpen.value = true }
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

onMounted(load)
</script>
