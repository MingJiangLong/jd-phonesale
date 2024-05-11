<template>
  <!-- 出库单页面 -->
  <div class="stock-out-page-container">
    <!-- 正常显示页面 -->
    <div id="stock-out-container" ref="printDomRef">
      <StockOut v-for="item in stockOutList" :stock-out-info="item" />
    </div>

    <!-- 底部操作栏 -->
    <div class="operate-bar" v-if="showOperatorBar">
      <Button @click="onPrintBtnClick">打印出库单</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { I_StockOut, fetchStockOut } from "@/service";
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router";
import StockOut from '@/components/StockOutInfo.vue'
import { Button, } from 'vant'
import { nextTick } from "vue";
const showOperatorBar = ref(true)
const route = useRoute()
const stockOutList = ref<I_StockOut[]>([])
const printDomRef = ref()
async function onFetchStockOut() {
  const params = route.params as any
  const data = await fetchStockOut(params);
  stockOutList.value = data.data;
}

function onPrintBtnClick() {
  showOperatorBar.value = false
  window.onafterprint = () => {
    showOperatorBar.value = true
  };
  nextTick(() => {
    window.print()
  })
}

onMounted(() => {
  onFetchStockOut()
})
</script>

<style scoped lang="less">
.stock-out-page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  #stock-out-container {
    flex: 1;
    overflow-y: scroll
  }

  .operate-bar {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: #ebf5fc;

    button {
      background: linear-gradient(103deg, #009AFF 0%, #0093EE 100%);
      font-size: 13px;
      border-radius: 25px;
      color: white;
      width: 60vw;
    }
  }
}
</style>