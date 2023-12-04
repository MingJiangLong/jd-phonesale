<template>
  <div class="status-bar-container" @click="emits('onClick')">
    <img :src="blue_icon" v-if="resolveStatus.includes(props.status ?? '')" />
    <img :src="red_icon" v-if="rejectStatus.includes(props.status ?? '')" />
    <div>{{ props.time }}</div>
    <img src="@/assets/img/arrow_right@2x.png" />
  </div>
</template>

<script setup lang="ts">
import { } from "vue"
import blue_icon from "@/assets/img/dot_blue@2x.png"
import red_icon from "@/assets/img/dot_red@2x.png"
const rejectStatus = ['JD_REJECTING', 'JD_REJECTED'];
const resolveStatus = ['JD_OUTBOUND', 'JD_SHIPPED', 'JD_DELIVERED',
  'JD_COMPLETED', 'JD_CANCELED',];
const props = defineProps<{
  status?: string
  time?: string
}>()

const emits = defineEmits<{
  (e: "onClick"): void
}>()

</script>

<style scoped lang="less">
@icon-size: 14px;

.status-bar-container {
  display: flex;
  padding: 8px 10px;
  background: #ffffff;
  border-radius: 8px;
  align-items: center;

  img {
    width: @icon-size;
    height: @icon-size;
  }

  div {
    flex: 1;
    padding: 0 8px;
    font-size: 13px;
    color: #89959c;
    line-height: 21px;
    font-weight: 400;
  }
}
</style>
