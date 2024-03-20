import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import "amfe-flexible"
import Vconsole from "vconsole"
import { isProdEnv } from "./utils"
import { createPinia } from "pinia"
import "vant/lib/index.css"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import Wechat from "./utils/Wechat"
import { APP_BASE_URL, APP_ID, isDev } from "./config"
import { fetchSignInfo } from "./service"

const pinia = createPinia()

export const wechat = new Wechat(
  {
    appId: APP_ID,
    hostUrl: APP_BASE_URL,
    jsApiList: ["scanQRCode"],
    debug: !!!isProdEnv,
  },
  async () => {
    const [url] = window.location.href.split("#")
    const response = await fetchSignInfo(url)
    return response.data
  }
)

const app = createApp(App)
if (isDev) {
  app.use(() => new Vconsole())
}
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router).mount("#app")
