<template>
  <el-tag :type="tagType" :effect="effect" round size="small">{{ label || statusText }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

// 通用状态映射
const STATUS_MAP = {
  // 通用
  success: { type: 'success', text: '成功' },
  active:  { type: 'success', text: '进行中' },
  running: { type: 'primary', text: '运行中' },
  online:  { type: 'success', text: '在线' },
  offline: { type: 'info',    text: '离线' },
  pending: { type: 'warning', text: '待处理' },
  warning: { type: 'warning', text: '告警' },
  error:   { type: 'danger',  text: '异常' },
  closed:  { type: 'info',    text: '已停用' },
  done:    { type: 'success', text: '已完成' },
  // 整改类
  unrectified: { type: 'danger',  text: '未整改' },
  rectifying:  { type: 'warning', text: '整改中' },
  rectified:   { type: 'success', text: '已整改' },
  // 人员考勤
  in:     { type: 'success', text: '在场' },
  out:    { type: 'info',    text: '离场' }
}

const props = defineProps({
  status: String,
  label: String,
  effect: { type: String, default: 'light' }
})

const tagType = computed(() => STATUS_MAP[props.status]?.type || 'info')
const statusText = computed(() => STATUS_MAP[props.status]?.text || props.status)
</script>
