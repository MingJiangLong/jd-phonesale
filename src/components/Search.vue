<template>
  <div class="search-component-container">
    <div class="flex search-container">
      <img src="@/assets/img/icon_search_gray@2x.png" alt="" />
      <input
             placeholder="请输入商品名称"
             v-model="inputValue"
             @change="onInputValueChange" />
      <img
           src="@/assets/img/close_del@2x.png"
           v-if="showClose"
           @click="onClear" />
    </div>
    <span @click="onSearchBtnClick">查询</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ref, } from "vue"
const inputValue = ref()
const emit = defineEmits<{
  (e: "onInput", value: string): void
  (e: "onSearch", value: string): void
}>()

defineExpose({
  onClear
})
function onClear() {
  inputValue.value = ""
}
function onInputValueChange(e: any) {
  const value = e.target?.value
  inputValue.value = value
  emit("onInput", value)
}

const showClose = computed(() => {
  return `${inputValue.value ?? ""}`.length
})

function onSearchBtnClick() {
  emit("onSearch", inputValue.value)
}
</script>

<style scoped lang="less">
@icon-size: 24px;

.search-component-container {
  display: flex;
  background: transparent;
  align-items: center;
  padding: 6px 0;

  &>span {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    padding-left: 16px;
  }

  img {
    width: @icon-size;
    height: @icon-size;
  }

  input {
    padding: 0px 8px;
    border: none;
    width: 100%;
    font-size: 15px;
    color: #333333;
    font-weight: 400;
  }

  input:placeholder {
    font-size: 15px;
    color: #89959c;
    font-weight: 400;
  }

  .search-container {
    flex: 1;
    background: #ffffff;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 7px 16px;
  }
}</style>
