<template>
  <div class="page-container">
    <Office @on-change="onOfficeChange" />
    <BlockTabs :tabs="tabs" v-model:value="currentTab" @on-change="onTabChange" />
    <div style="display: flex;flex-direction: column; flex: 1;overflow-y:scroll">
      <UboxList :load="getList" description="暂无订单数据" ref="listRef">
        <template #default="{ list }">
          <Card v-for="item in list" @click="onGoodsCardClick(item)" style="margin: 5px 8px;">
            <div style="display: flex;">
              <div class="goods-time" style="flex: 1;">{{ item?.createdTime }}</div>
              <div class="status-desc" style="color: #009AFF;" v-if="normalStatus[item.orderStatus]">
                {{ normalStatus[item.orderStatus] }}
              </div>
              <div class="status-desc" style="color: #FA5151;" v-if="rejectStatus[item.orderStatus]">
                {{ rejectStatus[item.orderStatus] }}
              </div>
            </div>
            <div v-for="(goods, index) in item.salesOrderItemList">
              <GoodsInfo :item="goods" :show-divide="index < ((item.salesOrderItemList?.length ?? 0) - 1)" />
            </div>
          </Card>
        </template>
      </UboxList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Card from "@/components/Card.vue"
import { useRouter } from "vue-router"
import UboxList from "@/components/UboxList.vue";
import Office from "@/components/Office.vue";
import useOfficeInfo from "@/store/useOfficeInfo";
import { fetchOrderList } from "@/service";
import BlockTabs from "@/components/BlockTabs.vue";
import GoodsInfo from "@/components/GoodsInfo.vue";
const router = useRouter()
const officeInfo = useOfficeInfo();

const normalStatus: any = {
  JD_OUTBOUND: "已出库",
  JD_SHIPPED: "已发货",
  JD_DELIVERED: "已妥投",

}
const rejectStatus: any = {
  JD_REJECTING: "拒收未入店",
  JD_REJECTED: "拒收已入店",
}
const tabs = [
  { name: "待出库", value: 1 },
  { name: "待收货", value: 2 },
  { name: "已完成", value: 3 },
  { name: "已拒收", value: 4 },
  { name: "已取消", value: 5 },
]
const currentTab = ref<{ name: string, value: any }>()
const listRef = ref<any>(null)

function onTabChange() {
  listRef.value.reset()
}
async function getList(pageNumber: number) {
  if (!officeInfo.storeId) return {
    pageNumber: 1,
    total: 0,
    list: []
  };
  const response = await fetchOrderList({
    pageNumber,
    storeId: officeInfo.storeId,
    orderQryStatus: currentTab.value?.value
  })
  const data = response?.data;
  return {
    pageNumber: data?.pageNumber,
    total: data?.totalCount,
    list: data?.result ?? []
  }
}

/**
 * 门店变化
 */
function onOfficeChange() {
  listRef.value.reset()
}

/** 待出库 */
const NOT_START = 'JD_PENDING_OUTBOUND'
const OTHER_STATUS = ['JD_OUTBOUND', 'JD_SHIPPED', 'JD_DELIVERED',
  'JD_COMPLETED', 'JD_CANCELED', 'JD_REJECTING', 'JD_REJECTED']
/**
 * 商品卡片点击事件
 */
function onGoodsCardClick(item: any) {

  if (item.orderStatus == NOT_START) {
    router.push(`/order/fill/${item?.orderId}`)
  }

  if (OTHER_STATUS.includes(item.orderStatus)) {
    router.push(`/order/detail/${item?.orderId}`)
  }
}

</script>

<style scoped lang="less">
.goods-time {
  font-size: 13px;
  color: #89959C;
}



.status-desc {
  font-size: 14px;
  font-weight: 500;
}
</style>
