<template>
  <Card>
    <div class="post-info" v-for="item in orderDetail?.orderShipList">
      <div>订单编号</div>
      <div>{{ orderDetail?.thirdOrderNo }} <span @click="onCopy">复制</span></div>
      <div>下单时间</div>
      <div>{{ orderDetail?.createdTime }}</div>
      <div>预计送达</div>
      <div>{{item?.promiseMsg}}</div>
      <div>收件人</div>
      <div>{{ item.consignee }}</div>
      <div>手机号码</div>
      <div>{{ item.consigneeMobile }}</div>
      <div>收货地址</div>
      <div>{{ item.deliveryAddress }}</div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "@/components/Card.vue"
import { OrderDetail } from "@/service";
import { writeText } from "@/utils"
import { showToast } from "vant"
import { Ref } from "vue";
import { inject } from "vue"
const orderDetail = inject<Ref<OrderDetail>>("orderDetail")

function onCopy() {
  
  writeText(orderDetail?.value?.thirdOrderNo ?? '')
  showToast("订单编号已复制")
}
</script>

<style scoped lang="less">
.post-info {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;

  div:nth-child(odd) {
    color: red;
    font-size: 14px;
    color: #89959c;
    font-weight: 400;
    margin: 8px 16px 8px 0;
  }

  span {
    display: inline-block;
    border: 1px solid #009aff;
    font-size: 10px;
    color: #009aff;
    font-weight: 500;
    padding: 4px 5px;
    margin-left: 6px;
    border-radius: 8px;
    transform: scale(0.7);
  }
}
</style>
