<template>
  <div class="component-container">
    <div class="goods-name">商品名称:{{ props.item.productName }}</div>
    <div class="goods-detail">
      <div>
        <div>约定价</div>
        <div>数量</div>
      </div>
      <div>
        <div>¥ {{ props.item.originalPrice}}</div>
        <div>{{ props.item.quantity }}</div>
      </div>
    </div>
    <slot></slot>
    <div
         v-if="props.showDivide"
         class="van-hairline--bottom"
         style="margin-top: 10px;"></div>
  </div>
</template>

<script setup lang="ts">
import { } from "vue"
const props = defineProps<{ item: any, showDivide?: boolean }>()
</script>

<style scoped lang="less">.goods-name {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  padding: 12px 0 15px 0;
}

.goods-detail>div {
  display: flex;

  &>:nth-child(1) {
    flex: 3;
    margin-right: 10px;
  }

  &>:nth-child(2) {
    flex: 2;
  }
}

.goods-detail>:nth-child(1) {
  font-size: 13px;
  color: #89959C;
  font-weight: 400;
}

.goods-detail>:nth-child(2) {
  font-size: 18px;
  color: #333333;
  font-weight: 600;
  margin-top: 10px;

  &>div {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

}
</style>