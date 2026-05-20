<template>
  <el-skeleton :rows="6" animated v-if="loading" />
  <el-form v-else :model="form" label-width="120px" :disabled="!editable" label-position="right">
    <el-row :gutter="24">
      <el-col :sm="12">
        <el-form-item label="项目名称"><el-input v-model="form.name" /></el-form-item>
      </el-col>
      <el-col :sm="12">
        <el-form-item label="项目编号"><el-input v-model="form.code" /></el-form-item>
      </el-col>
      <el-col :sm="12">
        <el-form-item label="工程类型">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="房屋建筑工程" value="房屋建筑工程" />
            <el-option label="市政工程" value="市政工程" />
            <el-option label="装饰装修" value="装饰装修" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="12">
        <el-form-item label="工程等级">
          <el-select v-model="form.level" style="width:100%">
            <el-option label="特类" value="特类" />
            <el-option label="一类" value="一类" />
            <el-option label="二类" value="二类" />
            <el-option label="三类" value="三类" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="建筑面积">
          <el-input v-model.number="form.area"><template #append>㎡</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="地上层数"><el-input v-model.number="form.storeyAbove" /></el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="地下层数"><el-input v-model.number="form.storeyBelow" /></el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="总投资">
          <el-input v-model.number="form.investment"><template #append>万元</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="开工日期">
          <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
      </el-col>
      <el-col :sm="8">
        <el-form-item label="竣工日期">
          <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
      </el-col>
      <el-col :sm="12">
        <el-form-item label="项目经理"><el-input v-model="form.manager" /></el-form-item>
      </el-col>
      <el-col :sm="12">
        <el-form-item label="合同编号"><el-input v-model="form.contractNo" /></el-form-item>
      </el-col>
      <el-col :sm="24">
        <el-form-item label="项目地址"><el-input v-model="form.address" /></el-form-item>
      </el-col>
      <el-col :sm="24">
        <el-form-item label="项目简介"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import request from '@/utils/request'

const props = defineProps({
  projectId: { type: String, required: true },
  editable: { type: Boolean, default: false }
})

const loading = ref(true)
const form = ref({})

async function load() {
  loading.value = true
  const { data } = await request.get(`/project/detail/${props.projectId}`)
  form.value = data
  loading.value = false
}

watch(() => props.projectId, load, { immediate: true })

defineExpose({ form })
</script>
