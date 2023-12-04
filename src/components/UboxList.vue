<template>
  <div class="ubox-list">
    <PullRefresh v-model="refreshing" @refresh="onLoad" style="flex: 1;">
      <List
            :loading="loading"
            :finished="finished"
            @load="onLoad"
            :immediate-check="props.loadWhenMounted"
            finished-text="没有更多了">
        <Empty v-if="!list.length" :description="props.description" />
        <slot v-else :list="list"></slot>
      </List>
    </PullRefresh>
  </div>
</template>

<script setup lang="ts">
import { showError } from "@/utils";
import { PullRefresh, List, Empty } from "vant";
import { ref } from "vue";
import { } from "vue"

type Response = {
  pageNumber: number
  total: number
  list: any[]
}
const props = defineProps<{
  load: (pageNum: number) => Promise<Response>
  description?: string
  loadWhenMounted?: boolean
}>()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const list = ref<any[]>([])
const pageIndex = ref(0)

defineExpose({
  reset
})

function reset() {
  pageIndex.value = 0;
  onLoad()
}
async function onLoad() {
  try {
    loading.value = true
    finished.value = false
    if (refreshing.value) {
      pageIndex.value = 0
    }
    const result = await props?.load(pageIndex.value + 1);
    pageIndex.value = result.pageNumber;

    if (result.pageNumber == 1) {
      list.value = result.list
    } else {
      list.value = [...list.value, ...result.list]
    }

    if (result.total == list.value.length) {
      finished.value = true
    } else {
      finished.value = false
    }
  } catch (error: any) {
    finished.value = true;
    showError(error?.message)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}
</script>

<style scoped lang="less">
.ubox-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>