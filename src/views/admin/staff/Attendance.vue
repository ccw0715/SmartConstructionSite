<template>
  <PageContainer title="人员考勤" desc="人员出勤记录与统计">
    <!-- 上半部：考勤趋势 -->
    <el-row :gutter="16" class="mb-16">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>
            <div class="flex-between">
              <span class="fw-500">近 30 日出勤趋势</span>
              <span class="text-muted fs-12">含工人 + 管理人员</span>
            </div>
          </template>
          <EChart :option="trendOption" :height="260" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card>
          <template #header><span class="fw-500">今日出勤构成</span></template>
          <EChart :option="todayOption" :height="260" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 明细 -->
    <SearchBar v-model="query" :fields="searchFields" @search="load(1)" @reset="load(1)" />
    <DataTable
      :data="list" :loading="loading" :total="total"
      v-model:page="query.page" v-model:pageSize="query.pageSize"
      @update:page="load" @update:pageSize="load(1)"
    >
      <template #toolbar>
        <el-button type="primary" :icon="Download">导出考勤报表</el-button>
      </template>
      <el-table-column prop="workerId" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="90" />
      <el-table-column prop="trade" label="工种" width="100" />
      <el-table-column prop="team" label="班组" width="130" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="inTime" label="入场时间" width="100" />
      <el-table-column prop="outTime" label="离场时间" width="100" />
      <el-table-column prop="workHours" label="工时" width="80">
        <template #default="{ row }">{{ row.workHours }} h</template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="80">
        <template #default="{ row }">
          <el-tag size="small" :type="row.type === '正常' ? 'success' : 'warning'" effect="plain">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="device" label="打卡设备" width="130" />
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import EChart from '@/components/EChart.vue'
import request from '@/utils/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const trendOption = ref({})
const todayOption = ref({})

const query = reactive({ page: 1, pageSize: 20, keyword: '' })
const searchFields = [
  { prop: 'keyword', label: '姓名', placeholder: '搜索姓名' },
  { prop: 'date', label: '日期', type: 'daterange' }
]

async function load(page) {
  if (page) query.page = page
  loading.value = true
  const { data } = await request.get('/staff/attendance', { params: query })
  list.value = data.list
  total.value = data.total
  loading.value = false
}

async function loadChart() {
  const { data } = await request.get('/staff/attendance/heatmap')
  trendOption.value = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: data.map(d => d[0].slice(5)), axisLabel: { interval: 4 } },
    yAxis: { type: 'value', name: '人' },
    series: [{
      name: '出勤', type: 'bar', data: data.map(d => d[1]),
      itemStyle: { color: '#1677ff' }, barWidth: '60%'
    }]
  }

  todayOption.value = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, icon: 'circle' },
    series: [{
      type: 'pie', radius: ['55%', '78%'],
      label: { formatter: '{b}\n{c}人', fontSize: 12 },
      data: [
        { value: 220, name: '正常', itemStyle: { color: '#52c41a' } },
        { value: 18,  name: '迟到', itemStyle: { color: '#faad14' } },
        { value: 6,   name: '早退', itemStyle: { color: '#fa8c16' } },
        { value: 42,  name: '请假/缺勤', itemStyle: { color: '#86909c' } }
      ]
    }]
  }
}

onMounted(() => { load(1); loadChart() })
</script>
