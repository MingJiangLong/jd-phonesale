<template>
  <div class="page-container mine-page-container">
    <div class="info">
      <img src="@/assets/img/avatar_nor@2x.png" />
      <span>{{ userPhone }}</span>
    </div>
    <Button size="large" type="default" @click="onLogout" :loading="isLogout">退出登录</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Button } from "vant"
import useLoginInfo from "@/store/useLoginInfo"
import { fetchUserInfo, logout } from "@/service";
import { redirectToLogin, setAppToken, showError } from "@/utils";
import { onMounted } from "vue";
const loginInfo = useLoginInfo()
const isLogout = ref(false)

const userPhone = ref('')
async function onFetchUserInfo() {
  try {
    const response = await fetchUserInfo();
    userPhone.value = response.data.phoneNumber
  } catch (error: any) {
    showError(error?.message)
  }

}
async function onLogout() {
  try {
    isLogout.value = true
    await logout()
    loginInfo.clearAll()
    setAppToken('')
    redirectToLogin()
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isLogout.value = false
  }

}

onMounted(() => {
  onFetchUserInfo()
})
</script>

<style scoped lang="less">
@avatar-size: 56px;

.mine-page-container {
  .info {
    margin: 10px 16px;
    padding: 22px;
    background: #ffffff;
    display: flex;
    align-items: center;
    border-radius: 8px;

    img {
      width: @avatar-size;
      height: @avatar-size;
    }

    span {
      padding-left: 20px;
      font-size: 18px;
      color: #1d2227;
      font-weight: 400;
    }
  }

  button {
    background: #ffffff;
    border-radius: 25px;
    font-size: 17px;
    color: #009aff;
    text-align: center;
    font-weight: 500;
    width: 86vw;
    margin: 30px 7vw;
  }
}
</style>
