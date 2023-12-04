<template>
  <div class="login-page-container">
    <p class="welcome">欢迎登陆</p>

    <div class="form-label">手机号码</div>
    <input
           class="phone-number-input"
           placeholder="请输入手机号码"
           v-model="phone" />

    <div class="form-label">验证码</div>
    <div class="verify-code-container">
      <input
             type="text"
             class="phone-number-input"
             placeholder="请输入验证码"
             v-model="verifyCode" />
      <Button
              :loading="isSendingVerify"
              :disabled="isSendingVerify || !isIdle"
              @click="onFetchVerifyCode">{{ tip }}</Button>
    </div>

    <Button @click="onLogin" :loading="isLogin">登陆</Button>
  </div>
</template>

<script setup lang="ts">
import useThrottle from '@/utils/useThrottle'
import useLoginInfo from "@/store/useLoginInfo"
import { useRouter } from "vue-router"
import { Button } from "vant"
import { ref } from "vue"
import { fetchVerifyCode, login } from "@/service"
import { getUrlSearchData, setAppToken, showError, } from "@/utils"
const router = useRouter()
const loginInfo = useLoginInfo()
const tip = ref("获取验证码")
const phone = ref()
const verifyCode = ref()

const [start, , isIdle] = useThrottle(
  i => {
    if (i == 60) return (tip.value = "获取验证码")
    tip.value = `重新获取${60 - i}s`
  },
  { times: 60 }
)

const isSendingVerify = ref(false)
async function onFetchVerifyCode() {
  try {
    isSendingVerify.value = true
    if (!phone.value) throw RangeError('手机号码不能为空')
    await fetchVerifyCode(phone.value)
    start()
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isSendingVerify.value = false
  }
}

const isLogin = ref(false);

// 刷新页面重新获取
// const needRefreshPageCode = ['A0013', 'A0010', 'A0005']
// 这里还可能会有很多
async function onLogin() {
  try {
    isLogin.value = true
    if (!phone.value) throw RangeError('手机号码不能为空')
    if (!verifyCode.value) throw RangeError('验证码不能为空')

    const wechatCode = getUrlSearchData('code') ?? ''
    const result = await login(phone.value, verifyCode.value, wechatCode);
    const data = result?.data;
    setAppToken(`${data?.tokenHead} ${data?.accessToken}`)
    loginInfo.accessToken = `${data?.tokenHead} ${data?.accessToken}`;

    // 如果有，回到重定向之前的页面
    if (loginInfo.nextPage) {
      return router.replace(loginInfo.nextPage)
    }
    router.push("/")
  } catch (error: any) {
    showError(error?.message)
  } finally {
    isLogin.value = false
  }
}

</script>

<style scoped lang="less">
.login-page-container {
  height: 100vh;
  background: linear-gradient(180deg, #e6f3ff 1%, #ecf5fc 100%);
  padding: 0 24px;

  input {
    font-size: 18px;
  }

  .welcome {
    font-size: 22px;
    text-align: center;
    color: #333333;
    font-weight: 500;
  }

  .form-label {
    color: #333333;
    font-weight: 400;
    padding: 13px 0;
  }

  .phone-number-input {
    box-sizing: border-box;
    width: 100%;
    padding: 13px 16px;
    background: #ffffff;
    box-shadow: 0px 8px 150px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .phone-number-input::placeholder {
    font-size: 17px;
    color: #616e7c;
    font-weight: 400;
  }

  .verify-code-container {
    display: flex;
    background: #ffffff;
    align-items: center;
    box-shadow: 0px 8px 150px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;

    input {
      border: none;
      flex: 1;
    }

    button {
      background: #ffffff;
      border: none;
      font-size: 14px;
      color: #009aff;
      padding: 0 14px;

      &:active {
        background: #ffffff;
        animation: none;
      }
    }
  }

  &>button {
    background-image: linear-gradient(135deg, #009aff 0%, #0093ee 100%);
    border-radius: 25px;
    font-size: 17px;
    color: #ffffff;
    text-align: center;
    font-weight: 500;
    width: 100%;
    border: none;
    margin-top: 53px;
    padding: 13px 0;
  }
}
</style>
