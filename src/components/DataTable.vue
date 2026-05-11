<template>
  <div class="data-table">
    <!-- 工具栏：左操作 + 右辅助 -->
    <div v-if="$slots.toolbar || $slots.toolbarRight" class="table-toolbar">
      <div class="left"><slot name="toolbar" /></div>
      <div class="right"><slot name="toolbarRight" /></div>
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      :border="false"
      stripe
      style="width: 100%"
      :max-height="maxHeight"
      @selection-change="$emit('selection-change', $event)"
    >
      <el-table-column v-if="selectable" type="selection" width="48" />
      <el-table-column v-if="showIndex" type="index" label="#" width="56" />
      <slot />
    </el-table>

    <div v-if="total > 0" class="pagination">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="v => $emit('update:page', v)"
        @size-change="v => $emit('update:pageSize', v)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
  loading: Boolean,
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
  selectable: Boolean,
  showIndex: { type: Boolean, default: true },
  maxHeight: { type: [Number, String], default: undefined }
})
defineEmits(['selection-change', 'update:page', 'update:pageSize'])
</script>

<style lang="scss" scoped>
.data-table { display: flex; flex-direction: column; }
.table-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
  .left, .right { display: flex; align-items: center; gap: 8px; }
}
.pagination {
  display: flex; justify-content: flex-end;
  margin-top: 16px;
}
</style>
