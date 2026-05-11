<template>
  <div class="search-bar">
    <el-form :model="modelValue" inline @submit.prevent="onSearch">
      <template v-for="f in visibleFields" :key="f.prop">
        <el-form-item :label="f.label" :style="{ marginBottom: '12px' }">
          <el-input
            v-if="!f.type || f.type === 'input'"
            v-model="modelValue[f.prop]"
            :placeholder="f.placeholder || `请输入${f.label}`"
            clearable
            style="width: 180px"
            @keyup.enter="onSearch"
          />
          <el-select
            v-else-if="f.type === 'select'"
            v-model="modelValue[f.prop]"
            :placeholder="`请选择${f.label}`"
            clearable
            style="width: 160px"
          >
            <el-option v-for="o in f.options" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
          <el-date-picker
            v-else-if="f.type === 'daterange'"
            v-model="modelValue[f.prop]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
      </template>
      <el-form-item style="margin-bottom: 12px">
        <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
        <el-button :icon="RefreshLeft" @click="onReset">重置</el-button>
        <el-button v-if="hasMore" link type="primary" @click="expanded = !expanded">
          {{ expanded ? '收起' : '更多筛选' }}
          <el-icon style="margin-left: 2px">
            <ArrowUp v-if="expanded" /><ArrowDown v-else />
          </el-icon>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search, RefreshLeft, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  modelValue: { type: Object, default: () => ({}) },
  collapseAt: { type: Number, default: 4 }
})
const emit = defineEmits(['search', 'reset'])

const expanded = ref(false)
const hasMore = computed(() => props.fields.length > props.collapseAt)
const visibleFields = computed(() =>
  hasMore.value && !expanded.value ? props.fields.slice(0, props.collapseAt) : props.fields
)

function onSearch() { emit('search', props.modelValue) }
function onReset() {
  props.fields.forEach(f => { props.modelValue[f.prop] = f.type === 'daterange' ? [] : '' })
  emit('reset')
  emit('search', props.modelValue)
}
</script>

<style lang="scss" scoped>
.search-bar {
  background: #fafbfc;
  padding: 14px 16px 2px;
  border-radius: 6px;
  margin-bottom: 16px;
  :deep(.el-form-item__label) { font-size: 13px; color: #4e5969; }
}
</style>
