<template>
  <PageContainer title="项目劳务人员" desc="劳务人员实名制登记花名册">
    <!-- 顶部统计 -->
    <el-row :gutter="12" class="mb-16">
      <el-col :sm="6" v-for="k in stats" :key="k.label">
        <div class="mini-stat">
          <div class="mini-label">{{ k.label }}</div>
          <div class="mini-value" :style="{color: k.color}">{{ k.value }}<span class="unit">{{ k.unit }}</span></div>
        </div>
      </el-col>
    </el-row>

    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />

    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Plus">登记人员</el-button>
        <el-button :icon="Upload">批量导入</el-button>
      </template>
      <el-table-column prop="id" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="90" />
      <el-table-column prop="gender" label="性别" width="60" />
      <el-table-column prop="age" label="年龄" width="60" />
      <el-table-column prop="trade" label="工种" width="100">
        <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.trade }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="team" label="所属班组" width="140" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="insurance" label="保险" width="80">
        <template #default="{ row }">
          <el-tag size="small" :type="row.insurance === '已购' ? 'success' : 'danger'" effect="plain">{{ row.insurance }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="在场状态" width="80">
        <template #default="{ row }"><StatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">详情</el-button>
          <el-button link type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { TRADE_TYPES, TEAMS } from '@/utils/dict'
import request from '@/utils/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)

const query = reactive({ page: 1, pageSize: 20, keyword: '', trade: '', team: '', status: '' })

const searchFields = [
  { prop: 'keyword', label: '关键字', placeholder: '姓名/电话/身份证' },
  { prop: 'trade',  label: '工种', type: 'select', options: TRADE_TYPES.map(v => ({ label: v, value: v })) },
  { prop: 'team',   label: '班组', type: 'select', options: TEAMS.map(v => ({ label: v, value: v })) },
  { prop: 'status', label: '在场', type: 'select', options: [
    { label: '在场', value: 'in' }, { label: '离场', value: 'out' }
  ]}
]

const stats = computed(() => [
  { label: '总人数', value: 286, unit: ' 人', color: '#1f2329' },
  { label: '在场', value: list.value.filter(w => w.status === 'in').length || 220, unit: ' 人', color: '#52c41a' },
  { label: '离场', value: list.value.filter(w => w.status === 'out').length || 66, unit: ' 人', color: '#86909c' },
  { label: '保险参保率', value: 92.3, unit: ' %', color: '#1677ff' }
])

async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/staff/worker', { params: query })
  list.value = data.list
  total.value = data.total
  loading.value = false
}

onMounted(() => load(1))
</script>

<style lang="scss" scoped>
.mini-stat {
  background: #fafbfc; border-radius: 6px; padding: 14px 18px;
  border: 1px solid #e5e6eb; margin-bottom: 0;
}
.mini-label { font-size: 13px; color: #86909c; }
.mini-value { font-size: 22px; font-weight: 600; margin-top: 4px; }
.mini-value .unit { font-size: 12px; font-weight: 400; color: #86909c; margin-left: 4px; }
</style>
