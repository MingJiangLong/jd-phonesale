<template>
  <div class="page-container stock-page-container">
    <PhoneType v-model:show="showOptions" @on-change="onChangeGoodsType" v-model:activeInfo="activeInfo" />
    <Office @on-change="onChangeStoreId" />
    <Tabs v-model:active="tabIndex" @change="onToggleTab">
      <Tab title="未输入库存" />
      <Tab title="已输入库存" />
    </Tabs>
    <Row
         align="center"
         justify="end"
         style="padding: 5px;font-size: 12px;">
      <Col span="7">
      <input v-model="currentSearchTypeName" placeholder="请选择类型" disabled
             style="text-align: right; width: 100%;border: none;background: transparent;" />
      </Col>
      <Col offset="2" @click="showOptions = !showOptions">
      <img src="@/assets/img/ic_arrow_down@2x.png" style="height: 18px;width: 18px;"/>
      </Col>
    </Row>
    <Search placeholder="请输入商品名称" @onSearch="onSearch" ref="searchRef" style="padding: 5px;" />
    <div style="display: flex;flex-direction: column; flex: 1;overflow-y:scroll;padding: 5px;">
      <!-- 本来两个列表是差别是很大的，谁知道后来就一样了 -->
      <UboxList :load="getStockGoodsList" description="暂无商品库存记录" ref="listRef">
        <template #default="{ list }">
          <div class="goods-card" v-for="item in list">
            <span class="phone-name">{{ item.productName }}</span>
            <div class="price-container">
              <span>¥{{ item.price ?? 0 }}</span>
              <span>约定价</span>
            </div>
            <div class="stock-operate">
              <div>库存</div>
              <div @click="onOpenStockModal(item)">{{ item.currentQty ?? '输入商品库存' }}</div>
            </div>
          </div>
        </template>
      </UboxList>
    </div>
    <!-- 修改库存弹窗 -->
    <Overlay :show="showUpdateStockModal">
      <div class="update-stock-modal">
        <div>请输入库存</div>
        <input placeholder="请输入商品库存" type="number" :step="1" v-model="stockNum" />
        <div class="operate flex">
          <Button @click="onUpdateStockModalCancel">取消</Button>
          <Button type="primary" @click="onConfirmUpdateStockNumber" :loading="isConfirmLoading">确定</Button>
        </div>
      </div>
    </Overlay>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import {
  Tabs, Tab, Overlay, Button, Row, Col
} from "vant"
import Search from "@/components/Search.vue"
import { fetchGoodsStockList, Stock, updateGoodsStock } from "@/service";
import { showError } from "@/utils";
import Office from "@/components/Office.vue";
import useOfficeInfo from "@/store/useOfficeInfo";
import UboxList from "@/components/UboxList.vue";
import PhoneType from "@/components/PhoneType.vue";


const officeInfo = useOfficeInfo()
/**
 * 搜索值
 */
const searchValue = ref("")
const searchRef = ref<any>(null)
const tabIndex = ref<number>(0)
const listRef = ref<any>(null)
/**
 * 已输入库存
 */
const STOCK_INPUT = 1

/**
 * 选中的库存商品信息
 */
const selectedStockGoodsInfo = ref<{ priceId?: number, stockId?: number, productId: number }>();

const stockNum = ref<number>(0)
const isConfirmLoading = ref(false)

const showUpdateStockModal = ref(false)

function clearSearchValue() {
  searchValue.value = '';
  searchRef.value?.onClear?.()
}

/**
 * 确定修改商品库存
 * @param changeQty 
 */
async function onConfirmUpdateStockNumber() {
  try {
    if (!officeInfo.storeId) throw new Error('未选择任何门店')
    isConfirmLoading.value = true
    const changeQty = stockNum.value
    if (changeQty == 0 && tabIndex.value != STOCK_INPUT) throw RangeError('库存不能为0!')
    if (changeQty != (~~changeQty)) throw RangeError('库存只能为整数!')
    const data = {
      ...selectedStockGoodsInfo.value,
      storeId: officeInfo.storeId,
      changeQty
    }
    await updateGoodsStock(data);
    showUpdateStockModal.value = false
    listRef.value.reset()
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isConfirmLoading.value = false
  }
}

async function getStockGoodsList(pageNumber: number) {
  if (!officeInfo.storeId) return {
    pageNumber: 1,
    total: 0,
    list: []
  };
  const response = await fetchGoodsStockList({
    searchType: tabIndex.value == STOCK_INPUT ? '2' : '1',
    pageNumber,
    productName: searchValue.value,
    storeId: officeInfo.storeId,
    categoryId: activeInfo.value.subId ?? activeInfo.value.mainId ?? 0
  })
  const data = response.data;
  return {
    pageNumber: data.pageNumber,
    total: data.totalCount,
    list: data.result
  }
}

/**
 * 搜索
 * @param value 
 */
function onSearch(value: string) {
  searchValue.value = value;
  listRef.value.reset()
}

async function initPageData() {
  listRef.value.reset()
}


onMounted(() => {
  initPageData()
})


function onToggleTab() {
  clearSearchValue()
  listRef.value.reset()
}

function onOpenStockModal(item: Stock) {
  showUpdateStockModal.value = true
  stockNum.value = item.currentQty ?? 0
  selectedStockGoodsInfo.value = {
    priceId: item.priceId,
    stockId: item.stockId,
    productId: item.productId
  }
}
function onUpdateStockModalCancel() {
  showUpdateStockModal.value = false
}


function onChangeStoreId() {
  listRef.value.reset()
}

const activeInfo = ref<{
  mainId?: number
  mainName?: string
  mainIndex?: number
  subId?: number
  subName?: string
  subIndex?: number
}>({
  mainId: undefined,
  mainIndex: undefined
})

const showOptions = ref(false);
function onChangeGoodsType(value: any) {
  showOptions.value = false
  activeInfo.value = value;
  listRef.value.reset()
}

const currentSearchTypeName = computed(() => {
  const currentValue = activeInfo.value;
  if (!currentValue.mainId && !currentValue.subId) return ''
  if (currentValue.mainId && currentValue.subId) return `${currentValue.mainName}/${currentValue.subName}`
  if (currentValue.mainId) return currentValue.mainName
  return currentValue.subName
})
</script>

<style scoped lang="less">
@icon-size: 24px;

.stock-page-container {
  font-size: 16px;

  .office-face {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    background: #ffffff;

    img {
      width: @icon-size;
      height: @icon-size;
    }

    span {
      font-size: 14px;
      color: #333333;
      font-weight: 500;
      padding-left: 8px;
    }
  }

  .tab-container {
    padding: 10px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .goods-card {
    background: #ffffff;
    padding: 16px;
    margin-top: 10px;
    border-radius: 8px;

    .phone-name {
      font-size: 14px;
      color: #333333;
      font-weight: 500;
    }

    .price-container {
      padding-top: 8px;

      &>span:nth-child(1) {

        font-weight: 400;
        color: #333333;
        font-size: 17px;
        padding-left: 4px;
        font-weight: 600;
      }

      &>span:nth-child(2) {
        font-size: 13px;
        padding-left: 3px;
        color: #89959c;
      }
    }

    .stock-operate {
      padding-top: 24px;
      font-size: 15px;
      display: flex;
      align-items: center;

      &>div:nth-child(1) {
        flex: 1;
      }

      &>div:nth-child(2) {
        font-size: 15px;
        color: #89959c;
        font-weight: 400;
        background: #f4f9fd;
        border-radius: 4px;
        padding: 8px 16px;
        min-width: 80px;
        text-align: center;
      }
    }
  }

  .update-stock-modal {
    padding: 20px 0;
    background: #ffffff;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 25vh;
    width: 76vw;
    text-align: center;

    input {
      background: #f4f9fd;
      border-radius: 4px;
      font-size: 16px;
      color: #89959c;
      text-align: center;
      font-weight: 400;
      margin: 34px 0;
      padding: 11px;
      border: none;
    }

    button {
      padding: 9px 41px;
      font-size: 16px;
      color: #ffffff;
      text-align: center;
      font-weight: 500;
      border-radius: 20px;
    }

    .operate>button:nth-child(1) {
      background: #eceef4;
      color: #333333;
      border: none;
      margin-right: 16px;
    }

  }


}
</style>
