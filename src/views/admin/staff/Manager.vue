<template>
  <PageContainer title="项目管理人员" desc="项目管理与技术人员花名册">
    <SearchBar
      v-model="query"
      :fields="searchFields"
      @search="load(1)"
      @reset="load(1)"
    />
    <DataTable
      :data="list"
      :loading="loading"
      :total="total"
      v-model:page="query.page"
      v-model:pageSize="query.pageSize"
      @update:page="load"
      @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus" @click="onAdd">新增人员</el-button>
        <el-button :icon="Upload">导入</el-button>
        <el-button :icon="Download">导出</el-button>
      </template>

      <el-table-column prop="id" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="60" />
      <el-table-column prop="position" label="岗位" width="120">
        <template #default="{ row }"><el-tag effect="plain">{{ row.position }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" width="140" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="joinDate" label="入场日期" width="120" />
      <el-table-column prop="certificates" label="证书数" width="80" align="center" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button link type="primary" size="small">详情</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <el-drawer v-model="drawerOpen" :title="editing?.id ? '编辑人员' : '新增人员'" size="480px">
      <el-form :model="editing" label-width="90px">
        <el-form-item label="姓名"><el-input v-model="editing.name" /></el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editing.gender">
            <el-radio value="男">男</el-radio><el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="editing.position" style="width:100%">
            <el-option v-for="p in POSITIONS" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话"><el-input v-model="editing.phone" /></el-form-item>
        <el-form-item label="身份证号"><el-input v-model="editing.idCard" /></el-form-item>
        <el-form-item label="入场日期">
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { POSITIONS } from '@/utils/dict'
import request from '@/utils/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const drawerOpen = ref(false)
const editing = ref({})

const query = reactive({ page: 1, pageSize: 20, keyword: '', position: '' })

const searchFields = [
  { prop: 'keyword',  label: '关键字', placeholder: '姓名/电话' },
  { prop: 'position', label: '岗位',  type: 'select', options: POSITIONS.map(p => ({ label: p, value: p })) }
]

async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/staff/manager', { params: query })
  list.value = data.list
  total.value = data.total
  loading.value = false
}

function onAdd() { editing.value = { gender: '男', status: 'active' }; drawerOpen.value = true }
function onEdit(row) { editing.value = { ...row }; drawerOpen.value = true }
function saveDrawer() {
  drawerOpen.value = false
  ElMessage.success('保存成功（演示）')
  load()
}

onMounted(() => load(1))
</script>
