<template>
  <div class="block-tabs">
    <div
         v-for="item in props.tabs"
         :key="item.value"
         class="tab-item"
         :class="['tab-item', props.value?.value == item.value ? 'tab-active' : 'tab-not-active']"
         @click="onChange(item)">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
const props = defineProps<{
  tabs: { name: string, value: any }[]
  defaultValue?: any
  value?: any
}>()

const emits = defineEmits<{
  (e: 'update:value', value: any): void
  (e: 'onChange', value: any): void
}>()


function onChange(value: any) {
  emits('update:value', value)
  emits('onChange', value)
}

onMounted(() => {
  if (!props.defaultValue) {
    onChange(props.tabs[0])
  } else {
    onChange(props.defaultValue)
  }
})
</script>

<style scoped lang="less">
.block-tabs {
  display: flex;
  overflow-x: scroll;
  flex-wrap: nowrap;
  padding: 4px 12px;
  background: white;
  column-gap: 10px;

  .tab-item {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .tab-active {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 500;
    background: #009AFF;
  }

  .tab-not-active {
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    background: #EBEEF5;
  }
}
</style>