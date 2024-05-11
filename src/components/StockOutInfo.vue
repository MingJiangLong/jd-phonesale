<template>
  <div style=" margin-bottom: 120px;">
    <div class="print-gird">
      <div class="item-1">
        <img :id="`img_${stockOutInfo.orderBarcode}_1`" style="width: 100%;height: 100%;" />
      </div>
      <div class="item-2">流水单号:{{ stockOutInfo.orderNo }}</div>
      <div class="item-3">
        店
      </div>

      <div class="item-4">店</div>
      <div class="item-5">
        {{ stockOutInfo.dian }}
      </div>
      <div class="item-6"></div>
      <div class="item-7">
        {{ stockOutInfo.which }}
      </div>

      <div class="item-8">电</div>
      <div class="item-9">
        <div>{{ stockOutInfo.promiseMsg }}</div>
      </div>
      <div class="item-10">未知</div>
      <div class="item-11"></div>


      <div class="item-12">客户信息</div>
      <div class="item-13">{{ stockOutInfo.deliveryAddress }}</div>
      <div class="item-14">应收金额</div>
      <div class="item-15">{{ stockOutInfo.due }}</div>
      <div class="item-16">客户签字</div>
      <div class="item-17"></div>

      <div class="item-18"></div>

      <div class="item-19">
        <div>包裹号：{{ stockOutInfo.orderBarcode }}</div>
        <div>{{ stockOutInfo.consignee }}：{{ stockOutInfo.consigneeMobile }}</div>
      </div>
      <div class="item-20">
        <img :id="`img_${stockOutInfo.orderBarcode}_2`" style="width: 100%;height: 100%;" />
      </div>
      <div class="item-21">
        备注:
      </div>
      <div class="item-22"></div>
    </div>
    <div style="font-size: 12px;">
      <div>请您确认商品外观完好，保留此包裹联时，代表您已经签收并确认配送商品信息。</div>
      <div>客户须知及退货信息请登录http://help.jd.com</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JSBarcode from 'jsbarcode'
import { onMounted } from "vue";
import { I_StockOut } from "@/service";
const props = defineProps<{
  stockOutInfo: I_StockOut
}>()


onMounted(() => {
  JSBarcode(`#img_${props.stockOutInfo.orderBarcode}_1`, props.stockOutInfo.orderBarcode)
  JSBarcode(`#img_${props.stockOutInfo.orderBarcode}_2`, props.stockOutInfo.thirdOrderNo)
})
</script>

<style scoped lang="less">
@border-color: #737373;
@flex-values: 1, 2, 3, 4, 5;
@width-percent-values: 10, 20, 30, 40;
@border-width: .1px;
@padding-start: 1;
@padding-end: 22;
@title-size: 20px;
@need-center: 3, 4, 5, 7, 8, 10, 12, 13, 14, 15, 16;

.generate-center() {
  .looping-class(@index) when (@index > 0) {
    @value: extract(@need-center, @index); // 提取对应索引的值

    .item-@{value} {
      display: flex;
      justify-content: center;
      align-items: center
    }

    .looping-class(@index - 1);
  }

  .looping-class(length(@need-center));
}

.generate-center();

.set-common-grid-item() {
  .looping-class(@index) when (@index > 0) and (@index <=@padding-end) and not (@index =18) {
    .item-@{index} {
      padding: 3px;
    }

    .looping-class(@index + 1);
  }

  .looping-class(@padding-start);
}

.set-common-grid-item();

.print-gird {
  height: 500px;
  border: 1px solid @border-color;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(7, 1fr) 10px repeat(3, 1fr)
}

.item-1 {
  grid-area: 1 / 1 / 3 / 4;
  border-bottom: 1px solid @border-color;
}

.item-2 {
  grid-area: 1 / 4 / 3 / 8;
  border-bottom: 1px solid @border-color;
  // border-right: 1px solid @border-color;
  font-weight: bold;
  padding: 8px 2px;
}

.item-3 {
  grid-area: 1 / 8 / 3 / 9;
  border-bottom: 1px solid @border-color;
  font-size: @title-size;
  font-weight: bold;
}

.item-4 {
  grid-area: 3 / 1 / 5 / 2;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-5 {
  grid-area: 3 / 2 / 5 / 6;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
  font-weight: bold;
  font-size: @title-size;
}

.item-6 {
  grid-area: 3 / 6 / 5 / 8;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-7 {
  grid-area: 3 / 8 / 5 / 9;
  border-bottom: 1px solid @border-color;
  font-size: @title-size;
  font-weight: bold;
}

.item-8 {
  grid-area: 5 / 1 / 6 / 2;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-9 {
  grid-area: 5 / 2 / 6 / 5;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-10 {
  grid-area: 5 / 5 / 6 / 6;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-11 {
  grid-area: 5 / 6 / 6 / 9;
  border-bottom: 1px solid @border-color;
}

.item-12 {
  grid-area: 6 / 1 / 8 / 2;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-13 {
  grid-area: 6 / 2 / 8 / 6;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-14 {
  grid-area: 6 / 6 / 7 / 8;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-15 {
  grid-area: 6 / 8 / 7 / 9;
  border-bottom: 1px solid @border-color;
}

.item-16 {
  grid-area: 7 / 6 / 8 / 8;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-17 {
  grid-area: 7 / 8 / 8 / 9;
  border-bottom: 1px solid @border-color;
}

.item-18 {
  grid-area: 8 / 1 / 9 / 9;
  border-bottom: 1px solid @border-color;
}

.item-19 {
  grid-area: 9 / 1 / 10 / 6;
  padding: 3px;
  border-right: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.item-20 {
  grid-area: 10 / 1 / 12 / 6;
  border-right: 1px solid @border-color;
}

.item-21 {
  grid-area: 9 / 6 / 12 / 8;
  border-right: 1px solid @border-color;
}

.item-22 {
  grid-area: 9 / 8 / 12 / 9;
}
</style>