<template>
  <div ref="chartRef" :style="{ width: '100%', height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: Number, default: 300 },
  theme: { type: String, default: '' }
})

const chartRef = ref(null)
let chart = null

function resize() { chart?.resize() }

onMounted(async () => {
  await nextTick()
  chart = echarts.init(chartRef.value, props.theme || undefined)
  chart.setOption(props.option)
  window.addEventListener('resize', resize)
})

watch(() => props.option, val => chart?.setOption(val, true), { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>
