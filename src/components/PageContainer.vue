<template>
  <div class="page-container" :class="{ flat }">
    <div v-if="$slots.header || title" class="page-header">
      <div class="page-title-wrap">
        <h2 v-if="title" class="page-title">{{ title }}</h2>
        <p v-if="desc" class="page-desc">{{ desc }}</p>
      </div>
      <div class="page-actions">
        <slot name="header" />
      </div>
    </div>
    <div class="page-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  desc: String,
  flat: Boolean
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.page-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  min-height: calc(100vh - 56px - 49px - 32px);
  &.flat { background: transparent; padding: 0; }
}
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 16px;
}
.page-title { font-size: 18px; margin: 0; color: $text-primary; font-weight: 600; }
.page-desc { font-size: 12px; color: $text-muted; margin: 4px 0 0; }
.page-body { }
</style>
