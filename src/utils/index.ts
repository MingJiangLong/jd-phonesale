import { APP_BASE_URL, APP_ID } from "@/config";
import { showToast } from "vant";

/**
 * 本地开发环境
 * 不可以用于vite.config
 */
export const isLocalEnv = import.meta.env.MODE === 'development'
/**
 * 测试开发环境
 * 不可以用于vite.config
 */
export const isTestEnv = import.meta.env.MODE === 'testing'

/**
 * 生产环境
 * 不可以用于vite.config
 */
export const isProdEnv = import.meta.env.MODE === 'prod'

/**
 * 复制
 * @param value 
 */
export function writeText(value: string) {
  navigator.clipboard.writeText(value)
}

export function readText() {
  return navigator.clipboard.readText();
}


export function showError(error: string) {
  showToast({
    message: error,
    duration: 2000
  })
}

export function getUrlSearchData(key: string) {
  const [, search] = window.location.href.split('?')
  const searchParams = new URLSearchParams(search)
  return searchParams.get(key);
}

const APP_KEY = 'APP__KEY'
export function setAppToken(value: string) {
  localStorage.setItem(APP_KEY, value)
}
export function getAppToken() {
  return localStorage.getItem(APP_KEY)
}

/**
 * 去登录页面
 */
export function redirectToLogin() {

  const loginUrl = `${APP_BASE_URL}/#/login`
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${encodeURIComponent(loginUrl)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
  window.location.replace(url);
}