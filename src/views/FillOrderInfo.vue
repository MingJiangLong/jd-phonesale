<template>
  <div class="fill-order-container page-container">
    <div>
      <div class="status">
        <img src="@/assets/img/ic_wait@2x.png" />
        <div class="desc">
          <div>待出库</div>
          <div>请填写商品序列号</div>
        </div>
        <img src="@/assets/img/box@2x.png" />
      </div>
      <Card title="商品信息">
        <CompleteGoodsInfo :items="detail?.orderItemList ?? []" :need-complete="true" v-model:snItemList="snItemList" />
      </Card>
      <PostInfo style="margin-top: 10px" />
    </div>
    <Button class="operate" @click="onSubmit" :loading="isSubmitting">提交序列号</Button>
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/Card.vue"
import CompleteGoodsInfo from "@/components/CompleteGoodsInfo.vue"
import PostInfo from "@/components/PostInfo.vue"
import { Button } from "vant"
import { useRoute, useRouter } from "vue-router"
import { fetchOrderDetail, OrderDetail, submitSn } from "@/service"
import { onMounted, provide } from "vue"
import { showError } from "@/utils"
import { ref } from "vue"
import useOfficeInfo from "@/store/useOfficeInfo"
const route = useRoute();
const router = useRouter();
const officeInfo = useOfficeInfo();
const detail = ref<OrderDetail>();
provide('orderDetail', detail)
const snItemList = ref<Array<{
  orderItemId: number
  snList: Array<string>
}>>([])

function initSnItemList(orderDetail: OrderDetail) {
  return orderDetail.orderItemList.reduce<Array<{
    orderItemId: number
    snList: Array<string>
  }>>((count, current) => {
    let item = current.quantity;
    count.push(
      {
        orderItemId: current.orderItemId,
        snList: new Array(item).fill('')
      }
    )
    return count;
  }, [])
}

async function onFetchOrderDetail() {
  try {
    const params = route.params as any
    const result = await fetchOrderDetail(params)

    const data = result.data;
    const temp = initSnItemList(data);
    snItemList.value = temp
    detail.value = data
  } catch (error: any) {
    showError(error?.message)
  }
}

const isSubmitting = ref(false)
async function onSubmit() {
  try {
    isSubmitting.value = true
    const params = route.params as any
    snItemList.value.forEach(item => {
      const isSomeNull = item.snList.some(sn => {
        let temp = `${sn}`.trim();
        return !temp.length
      })
      if (isSomeNull) throw new Error("商品对应序列号必填!");
    })

    if (!officeInfo.storeId) throw new Error("未选择任何门店")
    await submitSn({
      orderId: params.orderId,
      storeId: officeInfo.storeId,
      snItemList: snItemList.value
    })
    router.push(`/order/detail/${params?.orderId}`)
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isSubmitting.value = false
  }

}
onMounted(() => {
  onFetchOrderDetail()
})
</script>

<style scoped lang="less">
.fill-order-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &>div {
    flex: 1;
    overflow-y: scroll;
  }

  .status {
    display: flex;
    align-items: center;
    padding: 4px 13px;

    img:first-child {
      width: 32px;
      height: 32px;
    }

    .desc {
      flex: 1;
      padding-left: 16px;
      font-size: 13px;
      color: #009aff;
      font-weight: 400;

      div:first-child {
        font-size: 20px;
        color: #333333;
        font-weight: 500;
        padding-bottom: 6px;
      }
    }

    img:last-child {
      width: 100px;
      height: 72px;
    }
  }

  .operate {
    width: 87vw;
    height: 6vh;
    background-image: linear-gradient(135deg, #009aff 0%, #0093ee 100%);
    border-radius: 25px;
    color: #ffffff;
    padding: 13px;
    margin-top: 10px;
  }
}
</style>
