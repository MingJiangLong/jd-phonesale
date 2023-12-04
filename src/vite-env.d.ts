/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MODE: string
  readonly VITE_HOST: string
  readonly VITE_APP_ID: string
  readonly VITE_APP_BASE_URL: string
  readonly VITE_WECHAT_SCOPE: string
  // 更多环境变量...
}