import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router"
import StockPage from "@/views/StockPage.vue"
import useLoginInfo from "@/store/useLoginInfo"
import { getAppToken, redirectToLogin } from "@/utils"
import { isDev } from "@/config"
const routes: Array<RouteRecordRaw> = [
  { path: "/", component: StockPage, meta: { title: "库存" } },
  {
    path: "/orders",
    component: () => import("@/views/OrderListPage.vue"),
    meta: { title: "订单" },
  },
  {
    path: "/order/process/:orderId",
    component: () => import("@/views/ProcessPage.vue"),
    meta: { title: "物流信息" },
  },
  {
    path: "/order/detail/:orderId",
    component: () => import("@/views/OrderDetailPage.vue"),
    meta: { title: "订单详情" },
  },
  {
    path: "/login",
    component: () => import("@/views/LoginPage.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/mine",
    component: () => import("@/views/MinePage.vue"),
    meta: { title: "我的" },
  },
  {
    path: "/order/fill/:orderId",
    component: () => import("@/views/FillOrderInfo.vue"),
    meta: { title: "订单详情" },
  },
  {
    path: "/stock-out/:orderId",
    component: () => import("@/views/StockOutPage.vue"),
    meta: { title: "出库单" },
  },
  {
    path: "/shopping-list/:orderId",
    component: () => import("@/views/ShoppingListPage.vue"),
    meta: { title: "购物清单" },
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  // 设置title
  window.document.title = `${to.meta.title ?? ""}`
  // 拦截无登录并记录要跳转的页面
  const loginInfo = useLoginInfo()
  const LOGIN_ROUTER = "/login"
  const token = getAppToken()

  // 未鉴权
  if (to.path != LOGIN_ROUTER && !token && !isDev) {
    // 记录当前页
    loginInfo.nextPage = to.path
    return redirectToLogin()
  }
  next()
})

export default router
