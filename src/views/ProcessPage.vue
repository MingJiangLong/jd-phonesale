<template>
  <div class="page-container process-page-container">
    <Card>
      <div class="address">
        <img src="@/assets/img/ic_order@2x.png" alt="" />
        <div>
          <div>订单编号 - {{ postInfo.orderNo }}</div>
          <div>收货地址：广东省深圳市南山区粤海街道博园路8号小区12座2011</div>
        </div>
      </div>
    </Card>
    <Card title="订单进度" style="margin-top: 10px">
      <Steps direction="vertical" :active="postInfo?.logList.length - 1">
        <Step v-for="item in postInfo?.logList">
          <span>{{ item.orderStatusDesc }}</span>
          <p>{{ item.createdTime }}</p>
        </Step>
      </Steps>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Steps, Step } from "vant"
import { ref } from "vue"
import Card from "@/components/Card.vue"
const route = useRoute()
import { useRoute } from "vue-router";
import { fetchOrderProcess } from "@/service";
import { showError } from "@/utils";
import { onMounted } from "vue";

const postInfo = ref();

async function onFetchPostInfo() {
  try {
    const params = route.params as any
    const result = await fetchOrderProcess(params)
    postInfo.value = result.data
  } catch (error: any) {
    showError(error?.message)
  }
}


onMounted(() => {
  onFetchPostInfo()
})


</script>

<style scoped lang="less">
@address-size: 32px;

.process-page-container {
  padding: 10px;

  .address {
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      width: @address-size;
      height: @address-size;
      margin-right: 16px;
    }

    div:first-child {
      font-size: 16px;
      color: #333333;
      font-weight: 500;
    }

    div:last-child {
      font-size: 13px;
      color: #5c6c7c;
      font-weight: 400;
    }
  }
}

:deep(.van-icon) {
  font-size: 17px;
}
</style>
