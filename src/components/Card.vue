<template>
  <div class="card-container">
    <div v-if="props.title" class="card-title">{{ props.title }}</div>
    <div :class="['card-desc', !!!props.title ? 'card-container' : '']">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {} from "vue"
const props = defineProps<{
  title?: string
}>()
</script>

<style scoped lang="less">
.card-container {
  border-radius: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
}
.card-title {
  background: #f6fbff;
  border-radius: 8px 8px 0px 0px;
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  padding: 14px 16px 10px;
}
.card-desc {
  background: #ffffff;
  padding: 16px;
  font-size: 14px;
}
</style>
