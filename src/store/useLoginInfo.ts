import { defineStore } from "pinia";

export default defineStore('loginInfo', {
  state: (): State => {
    return {
      accessToken: '',
      // accessToken: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzYyMTg2MDQwMCIsIm9wZW5JZCI6IjIzMjMyIiwiZXhwIjoxNjk1MjY2NzM3LCJpYXQiOjE2OTM5NzA3Mzd9.vCS06StkkE3P-ZQKwER_-EpcvHViQ_zVIifwYX8Qto0',
      userName: '',
      nextPage: '',
      wechatCode: '',
    }
  },
  getters: {
    ACCESS_TOKEN(state) {
      return () => state.accessToken
    }
  },
  actions: {
    clearAll() {
      this.accessToken = ''
      this.userName = ''
      this.nextPage = ''
    }
  },
  persist: true
})

type State = {
  accessToken: string
  userName: string
  nextPage: string
  wechatCode?: string
  // openid?: string
}