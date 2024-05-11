<template>
  <div class="shopping-list">
    <div class="head-info">
      <div>
        <div>订单编号:12122222</div>
        <div>运单号:</div>
        <div>流水号:202020202</div>
      </div>
      <div>购物清单</div>
      <img id="shopping-list-barcode">
    </div>

    
    <div>用户信息</div>
    <div>
      <div>用户名称</div>
      <div>送达时间</div>
      <div>用户地址</div>
    </div>

    <div>支付信息</div>
    <div>
      <div>支付方式:在线支付</div>
    </div>
    <table>
      <tr>
        <td>京东商品编码</td>
        <td>商家商品编码</td>
        <td>UPC码</td>
        <td>京东商品名称</td>
        <td>数量</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import JSbarcode from 'jsbarcode'

onMounted(() => {
  JSbarcode("#shopping-list-barcode", "A1AA3A4A5A6A7A78")
})
</script>

<style scoped lang="less">
@border-color: black;

.shopping-list {

  .head-info {
    display: flex;
  }

  table {
    border: 1px solid @border-color;
    border-collapse: collapse;

    td {
      border: 1px solid @border-color;
      padding: 3px 5px
    }
  }
}
</style>