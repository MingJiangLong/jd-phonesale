<template>
  <!-- 购物清单页面 -->
  <div class="shopping-list-detail-page">
    <div>
      <div>
        <Row>
          <Col span="10">
          <Row>
            <Col span="24">订单编号: {{ shoppingListDetail?.orderNo }}</Col>
            <Col span="24">运单号: {{ shoppingListDetail?.deliveryId }}</Col>
            <Col span="24">流水号: {{ shoppingListDetail?.thirdOrderNo }}</Col>
          </Row>
          </Col>

          <Col span="8" style="display: flex; justify-content: center;align-items: center;font-size: 16px;color:red">
          购物清单
          </Col>
        </Row>

        <div class="title">用户信息:</div>
        <Row>
          <Col span="12" offset="2">用户名称: {{ shoppingListDetail?.consignee }}</Col>
          <Col span="10">联系方式: {{ shoppingListDetail?.consigneeMobile }}</Col>
          <Col span="22" offset="2">送达时间: {{ shoppingListDetail?.promiseMsg }}</Col>
          <Col span="22" offset="2">用户地址: {{ shoppingListDetail?.deliveryAddress }}</Col>
        </Row>

        <div class="title">支付信息:</div>
        <Row>
          <Col span="10" offset="2">支付方式: 在线支付</Col>
          <Col span="12">应收金额: 0</Col>
        </Row>
        <div class="title">商品信息:</div>
        <div style="width: 100%;overflow-x: scroll">
          <table>
            <tr>
              <td>京东商品编码</td>
              <td>上架商品编码</td>
              <td>UPC码</td>
              <td>京东商品名称</td>
              <td>数量</td>
            </tr>
            <tr v-for="(item) in shoppingListDetail?.productInfoList" :key="item.productId">
              <td>{{ item.salesChannelSkuId }}</td>
              <td>{{ item.outSkuId }}</td>
              <td>{{ item.upc }}</td>
              <td>{{ item.productName }}</td>
              <td>{{ item.qty }}</td>
            </tr>
          </table>
        </div>
        <Row>
          <Col span="4" offset="20" style="color: red;text-align: end;padding: 10px 0;">
          包裹数:2
          </Col>
          <Col span="10" offset="14" class="sign-box">
          <div>请确认商品齐全完整外观完好</div>
          <div></div>
          <div>相关人签字/日期</div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="operator-bar" v-if="showOperator">
      <Button @click="onPrintBtnClick">打印购物清单</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { I_ShoppingListDetail, fetchShoppingListDetail } from "@/service";
import { ref, nextTick, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Button, Row, Col } from "vant";
const route = useRoute();
const shoppingListDetail = ref<I_ShoppingListDetail>()

const showOperator = ref(true)
async function onFetchDetail() {
  const params = route.params as any
  const data = await fetchShoppingListDetail(params);
  shoppingListDetail.value = data.data;
}

function onPrintBtnClick() {
  showOperator.value = false
  window.onafterprint = () => {
    showOperator.value = true
  };
  nextTick(() => {
    window.print()
  })
}

onMounted(() => {
  onFetchDetail()
})
</script>

<style scoped lang="less">
table {
  width: 100%;
  border-collapse: collapse;

  td {
    border: 1px solid #737373;
    padding: 6px 10px;
    text-wrap: nowrap;
  }

}

.sign-box {
  border: 1px solid #737373;
  height: 10vh;
  display: flex;
  flex-direction: column;
  padding: 3px;

  >div:nth-child(2) {
    flex: 1
  }

  >div:nth-child(3) {
    text-align: end;
  }
}

.title {
  font-size: 14px;
  font-weight: 600;
  padding: 20px 0 5px;
}

.shopping-list-detail-page {
  font-size: 12px;
  display: flex;
  height: 100vh;
  flex-direction: column;

  img {
    width: 100%;
    height: 100%;
  }

  .van-col {
    margin-top: 5px;
  }

  >div:nth-child(1) {
    flex: 1;
    overflow-y: scroll;
    margin: 5px;


    >div:nth-child(1) {
      border: 1px solid black;
      padding: 5px;
    }
  }

  >div:nth-child(2) {
    height: 9vh;
    background: #ebf5fc;
    display: flex;
    justify-content: center;
    align-items: center
  }
}

.operator-bar {
  button {
    background: linear-gradient(103deg, #009AFF 0%, #0093EE 100%);
    font-size: 13px;
    border-radius: 25px;
    color: white;
    width: 60vw;
  }
}
</style>