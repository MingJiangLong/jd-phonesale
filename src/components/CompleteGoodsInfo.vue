<template>
  <div class="phone-base-info">
    <GoodsInfo v-for="(item, index) in props.items" :item="item"
               :show-divide="index < ((props.items?.length ?? 0) - 1)">
      <div class="mark" v-if="props.needComplete">
        <span>序列号</span>
        <div>
          <div class="scan" v-for="(_sn, index2) in props.snItemList?.[index].snList" :key="index2">
            <input
                   type="text" placeholder="请输入或扫描识别序列号"
                   :value="props.snItemList?.[index].snList[index2]"
                   @input="onOrderCodeChange($event?.target?.value, index, index2)" />
            <img src="@/assets/img/icon_scan@2x.png" @click="onScanQrCode(index, index2)" />
          </div>
        </div>
      </div>
    </GoodsInfo>
  </div>
</template>

<script setup lang="ts">
import { } from "vue"
import GoodsInfo from "./GoodsInfo.vue";
import { wechat } from "@/main";
import { showError } from "@/utils";
const props = defineProps<{
  items: any[]
  needComplete?: boolean
  snItemList?: Array<{
    orderItemId: number
    snList: Array<string>
  }>
}>()

const emits = defineEmits<{
  (e: "update:snItemList", value: any): void
}>()

function onOrderCodeChange(valueStr: string, i1: number, i2: number) {
  let snItemList = props.snItemList;
  let temp = snItemList?.[i1]
  if (!temp) return;
  if (temp.snList.includes(valueStr)) throw new Error(`条形码${valueStr}已存在!`)
  temp.snList[i2] = valueStr;
  emits('update:snItemList', snItemList)
}

async function onScanQrCode(i1: number, i2: number) {
  try {
    const result = await wechat.scanQRCode<string>()
    console.log('result', result);

    onOrderCodeChange(result, i1, i2)
  } catch (error: any) {
    showError(error?.message)
  }
}
</script>

<style scoped lang="less">
.phone-base-info {
  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }

  .info {
    padding-top: 12px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 1fr;

    div:nth-child(1) {
      font-size: 13px;
      color: #89959c;
      font-weight: 400;
    }

    div:nth-child(2) {
      font-size: 13px;
      color: #89959c;
      font-weight: 400;
    }

    div:nth-child(3) {
      font-size: 18px;
      color: #333333;
      line-height: 25px;
      font-weight: 600;
    }

    div:nth-child(4) {
      font-size: 18px;
      color: #333333;
      line-height: 25px;
      font-weight: 600;
    }
  }

  .mark {
    display: flex;
    margin-top: 25px;

    &>div {
      flex: 1;
      margin-left: 10px;
    }

    &>span {
      font-size: 15px;
      color: #009aff;
      font-weight: 500;
    }

    .scan {
      background: #f4f9fd;
      border-radius: 4px;
      padding: 9px 16px 9px 12px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      input {
        border: none;
        flex: 1;
        font-size: 15px;
        padding-left: 0;
        background: #f4f9fd;
      }

      input:placeholder {
        font-size: 15px;
        color: #89959c;
        font-weight: 400;
      }

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
