<template>
  <div>

    <div class="office-face" @click="openModal">
      <img src="@/assets/img/ic_shop@2x.png" alt="" />
      <!-- <span>{{ officeInfo.currentOffice ? officeInfo.currentOffice?.storeName : '请选择门店' }}</span> -->
      <span>{{ officeName }}</span>
    </div>
    <Overlay :show="showModal">
      <div class="update-office-modal">
        <div class="title">选择门店</div>
        <div class="list">
          <RadioGroup v-model="officeId">
            <div class="list-item" v-for="item in officeInfo.officeList">
              <div>{{ item.storeName }}</div>
              <div>
                <Radio :name="item.storeId" />
              </div>
            </div>
          </RadioGroup>
        </div>
        <div class="operate flex">
          <Button type="primary" @click.stop="onCloseModal">确定</Button>
        </div>
      </div>
    </Overlay>
  </div>
</template>

<script setup lang="ts">
import useOfficeInfo from '@/store/useOfficeInfo';
import { showError } from '@/utils';
import { Overlay, RadioGroup, Button, Radio } from "vant";
import { onMounted } from 'vue';
import { watch } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const officeInfo = useOfficeInfo();
const showModal = ref(false)
const officeId = ref<number>()
const emits = defineEmits<{
  (event: 'onChange'): void
}>()


function openModal() {
  if (!officeInfo.officeList.length) return showError('该账号下无门店信息!')
  showModal.value = true
  officeId.value = officeInfo.currentOffice?.storeId
}

function onCloseModal() {
  const office = officeInfo.officeList.find(item => item.storeId == officeId.value);
  officeInfo.updateCurrentOffice(office)
  showModal.value = false
}

const officeName = computed(() => {
  return officeInfo.currentOffice?.storeName ?? '请选择门店'
})

watch(() => officeInfo.currentOffice?.storeId, () => {
  emits('onChange')
})

onMounted(() => {
  officeInfo.initOfficeInfo()
})


</script>

<style scoped lang="less">
@icon-size: 24px;



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

.update-office-modal {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 52vh;
  background: #f4f6fc;
  border-radius: 16px 16px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 17px;
    color: #333333;
    text-align: center;
    font-weight: 500;
    padding: 23px 0;
  }

  .list {
    flex: 1;
    overflow-y: scroll;
  }

  .list-item {
    display: flex;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    margin: 0 10px 10px;
    align-items: center;

    div:first-child {
      flex: 1;
    }

    div:last-child {
      width: 20px;
    }
  }

  button {
    background-image: linear-gradient(135deg, #009aff 0%, #0093ee 100%);
    border-radius: 25px;
    width: 86vw;
    margin: 4px 7vw;
  }
}
</style>