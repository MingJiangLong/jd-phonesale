<template>
  <Popup v-model:show="props.show" position="bottom" class="popup-container" @close="emits('update:show', false)">
    <div class="phone-type-container">
      <div class="main-type-container">
        <div
             v-for="(mainType, index) in list " :key="mainType.id"
             @click="onClickMain(mainType, index)"
             :class="['phone-main-type', isMainActive(mainType.id) ? 'main-type-active' : 'main-type-inactive']"
             :style="borderRadiusStyle(index)">
          {{ mainType.name }}
          <Loading :size="15" v-if="mainType.loading" style="padding-left: 5px;" />
        </div>
      </div>
      <div class="sub-type-container">
        <div
             v-for="( sub, index) in subList  "
             :class="['phone-sub-type', isSubActive(sub.id) ? 'sub-type-active' : 'sub-type-inactive']"
             @click="onClickSub(sub, index)">
          {{ sub.name }}
        </div>
      </div>
      <div class="operate">
        <Button @click="emits('onChange', currentActiveInfo)">确定</Button>
      </div>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue"
import { Popup, Loading, Button } from 'vant'
import { fetchGoodsTypeList } from "@/service";
import { showError } from "@/utils";
type I_ActiveInfo = {
  mainId?: number
  mainName?: string
  mainIndex?: number
  subId?: number
  subName?: string
  subIndex?: number
}

type GoodsType = {
  id: number
  name: string
  loading?: boolean
  children: GoodsType[]
}
const ALL_TAG = 0
const props = defineProps<{
  show: boolean
  activeInfo: I_ActiveInfo
}>()

const currentActiveInfo = ref<I_ActiveInfo>(
  {
    mainId: undefined,
    mainName: undefined,
    mainIndex: undefined,
    subId: undefined,
    subName: undefined,
    subIndex: undefined,
  }
)

watchEffect(() => {
  if (props.show) {
    currentActiveInfo.value = {
      ...props.activeInfo,
    }
  }
})

const emits = defineEmits<{
  (e: 'update:show', value: any): void
  (e: 'onChange', value: any): void
}>()

const subList = computed(() => {
  let find = list.value.find(item => item.id == currentActiveInfo.value.mainId)
  if (find) return find.children;
  return []
})

const list = ref<GoodsType[]>([])

async function onClickMain(info: GoodsType, index: number) {
  try {
    list.value[index].loading = false
    if (currentActiveInfo.value.mainId == info.id) return;
    currentActiveInfo.value = {
      mainId: info.id,
      mainIndex: index,
      mainName: info.name,
      subId: undefined,
      subIndex: undefined,
      subName: undefined
    }

    if (currentActiveInfo.value.mainId == ALL_TAG) return

    // 查询子节点
    const result = await fetchGoodsTypeList(info.id);
    const data = result.data;
    list.value[index].children = data.map(item => ({ id: item.categoryId, name: item.categoryName, children: [] }))
  } catch (error: any) {
    showError(error?.message)
  } finally {
    list.value[index].loading = false
  }

}

function onClickSub(info: GoodsType, index: number) {
  if (currentActiveInfo.value.mainIndex == undefined) return;
  if (currentActiveInfo.value.subId == info.id) {
    return currentActiveInfo.value = {
      ...currentActiveInfo.value,
      subId: undefined,
      subIndex: undefined,
      subName: undefined
    }
  };
  currentActiveInfo.value = {
    ...currentActiveInfo.value,
    subId: info.id,
    subIndex: index,
    subName: info.name
  }
}

function isMainActive(id: number) {
  return currentActiveInfo.value.mainId == id
}

function isSubActive(id: number) {
  return currentActiveInfo.value.subId == id
}
function borderRadiusStyle(index: number) {
  let borderRadius = 15;
  let styleStr = ''
  if (index == 0) styleStr = `border-top-right-radius: ${borderRadius}px;`
  if (currentActiveInfo.value.mainIndex == undefined) return styleStr
  if (currentActiveInfo.value.mainIndex - 1 == index) {
    styleStr += `border-bottom-right-radius: ${borderRadius}px;`
  }
  if (currentActiveInfo.value.mainIndex + 1 == index) {
    styleStr += `border-top-right-radius: ${borderRadius}px`
  }
  return styleStr
}


async function onInitData() {
  const result = await fetchGoodsTypeList(0)
  const data = result.data;
  let temp = data.map(item => ({ id: item.categoryId, name: item.categoryName, loading: false, children: [] }))
  temp = [{ id: ALL_TAG, name: '全部', loading: false, children: [] }, ...temp]
  list.value = temp
}

onMounted(() => {
  onInitData()
})

</script>

<style scoped lang="less">
.popup-container {
  height: 60%;
  background: transparent;
}

.phone-type-container {
  height: 100%;
  background: white;
  overflow-x: hidden;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: grid;
  grid-template-rows: auto 15%;
  grid-template-columns: 1fr 2fr;


  .operate {
    background: #ebf5fc;
    grid-column: span 2;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      background: linear-gradient(103deg, #009AFF 0%, #0093EE 100%);
      font-size: 13px;
      border-radius: 25px;
      width: 80vw;
      color: white;
    }
  }
}

.main-type-container {
  width: 35vw;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 16px;
}

.phone-main-type {
  padding: 14px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sub-type-container {
  width: 60vw;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

.phone-sub-type {
  border-radius: 18px;
  width: 65%;
  text-align: center;
  padding: 5px 7px;
  margin-top: 10px;
  font-size: 15px;
}

.sub-type-inactive {
  font-size: 15px;
  color: #89959C;
  font-weight: normal;
  border: 1px solid #89959C;
}

.sub-type-active {
  font-weight: bold;
  background: rgba(0, 148, 240, 0.10);
  border: 1px solid #0094F1;
  color: #0094F1;
  border-radius: 18px;
}

.main-type-active {
  font-weight: bold;
  background: white;
}

.main-type-inactive {
  font-weight: normal;
  background: #F4F6FC;
}
</style>