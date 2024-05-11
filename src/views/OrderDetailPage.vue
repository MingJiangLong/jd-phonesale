<template>
  <div class="page-container order-detail-container">
    <div style="flex: 1;">
      <div class="code">
        <div>取件码</div>
        <div>{{ orderDetail?.getCode }}</div>
      </div>
      <StatusBar
                 style="margin-bottom: 10px"
                 :time="orderDetail?.createdTime"
                 :status="orderDetail?.orderStatus"
                 :status-str="orderDetail?.orderStatusDesc"
                 @on-click="onClickStatusBar" />
      <Card title="商品信息">
        <CompleteGoodsInfo :items="orderDetail?.orderItemList ?? []" />
      </Card>
      <PostInfo style="margin-top: 10px" />
    </div>

    <Button v-if="showRejectBtn" class="operate" @click="onRejectConfirm" :loading="isRejecting">确认拒收入店</Button>
    <Button v-if="showReDeliveryBtn" class="operate" @click="onRedelivery" :loading="isLoading">再投</Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import Card from "@/components/Card.vue"
import CompleteGoodsInfo from "@/components/CompleteGoodsInfo.vue"
import PostInfo from "@/components/PostInfo.vue"
import StatusBar from "@/components/StatusBar.vue"
import { useRoute } from "vue-router"
import { confirmReject, fetchOrderDetail, reDelivery } from "@/service"
import { showError } from "@/utils"
import { useRouter } from "vue-router"
import { Button } from "vant"
import { computed } from "vue"
const route = useRoute()
const router = useRouter()

const orderDetail = ref()
provide("orderDetail", orderDetail)
async function onFetchOrderDetail() {
  try {
    const params = route.params as any
    const result = await fetchOrderDetail(params)
    orderDetail.value = result.data;
  } catch (error: any) {
    showError(error?.message)
  }
}

/**
 * 显示确认拒收入店
 */
const showRejectBtn = computed(() => {
  return orderDetail?.value?.orderStatus === 'JD_REJECTING'
})

/** 显示再投按钮 */
const showReDeliveryBtn = computed(() => {
  return orderDetail?.value?.orderStatus === 'JD_REJECTED'
})

const isLoading = ref(false)
async function onRedelivery() {
  try {
    const params = route.params as any
    isLoading.value = true;
    await reDelivery(params.orderId)
    onFetchOrderDetail()
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isLoading.value = false;
  }

}
function onClickStatusBar() {
  const params = route.params as any
  router.push(`/order/process/${params.orderId}`)
}

const isRejecting = ref(false)
async function onRejectConfirm() {
  try {
    isRejecting.value = true
    const params = route.params as any
    await confirmReject(params)
    onFetchOrderDetail()
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isRejecting.value = false
  }
}
onMounted(() => {
  onFetchOrderDetail()
})
</script>

<style scoped lang="less">
.order-detail-container {
  padding: 10px;

  .code {
    font-size: 30px;
    color: #333333;
    font-weight: 500;
    text-align: center;
    padding: 14px 0;

    div:first-child {
      font-size: 15px;
      color: #333333;
      font-weight: 400;
      padding-bottom: 10px;
    }
  }
}

.operate {
  width: 87vw;
  height: 6vh;
  background-image: linear-gradient(135deg, #009aff 0%, #0093ee 100%);
  border-radius: 25px;
  color: #ffffff;
  padding: 13px;
  margin: auto;
  margin-top: 10px;
}
</style>
