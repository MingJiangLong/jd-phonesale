import { HOST, isDev } from "@/config"
import { getAppToken, redirectToLogin, setAppToken } from "@/utils"
import Axios, { AxiosRequestConfig } from "axios"
const axios = Axios.create({
  timeout: 1000 * 6,
  timeoutErrorMessage: "请求超时,稍候重试",
  baseURL: HOST,
})
/** 不需要token的接口 */
const notNeedToken = ["/sms/sendVerifyCode", "/login"]

axios.interceptors.request.use(config => {
  const url = config.url
  if (notNeedToken.includes(url ?? "")) return config
  const token = getAppToken()
  config.headers.Authorization = token
  return config
})

axios.interceptors.response.use(
  res => {
    if (res.data?.code == 10000) {
      return res.data
    }

    // a0006 登录信息过期  c0002登录时微信报错
    if ((res.data?.code == "A0006" || res.data?.code == "C0002") && !isDev) {
      setAppToken("")
      return redirectToLogin()
    }

    return Promise.reject(new Error(res.data?.msg ?? "系统异常"))
  },
  error => {
    return Promise.reject(error)
  }
)

function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) {
  return axios.post<any, Response<T>>(url, data, config)
}

function get<T = any>(url: string, config?: AxiosRequestConfig<any>) {
  return axios.get<any, Response<T>>(url, config)
}

/**
 * 获取验证码
 * @param phoneNumber 手机号码
 */
export function fetchVerifyCode(phoneNumber: string) {
  return get("/sms/sendVerifyCode", {
    params: {
      phoneNumber,
    },
  })
}

/**
 * 登录
 * @param phoneNumber 手机号
 * @param verifyCode 验证码
 * @returns
 */
export function login(phoneNumber: string, smsCode: string, code: string) {
  return post<{
    accessToken: string
    tokenHead: string
  }>("/login", {
    phoneNumber,
    smsCode,
    code,
  })
}

export async function fetchUserInfo() {
  return get<{
    phoneNumber: string
    realName: string
    username: string
  }>("/user/currentUser")
}
/**
 * 登出
 * @param userName
 * @param verifyCode
 * @returns
 */
export async function logout() {
  return await post("/exit")
}

/**
 * 获取商品库存
 */
export async function fetchGoodsStockList(options: {
  pageNumber: number
  productName?: string
  searchType: "1" | "2"
  storeId?: string | number
  categoryId?:number
}) {
  return await post<{
    result: Stock[]
    pages: number
    pageNumber: number
    totalCount: number
  }>("/stock/stockPage", {
    ...options,
    pageSize: 10,
  })
}

/**
 * 获取门店列表
 * @returns
 */
export async function fetchStoresList() {
  // return {
  //   code: "10000",
  //   msg: "操作成功",
  //   data: [
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //     {
  //       relId: 645,
  //       uid: 5874437,
  //       storeId: 225901,
  //       businessId: 1041,
  //       roleId: "ROLE_TNKJ_DZ",
  //       enabled: 1,
  //       createdTime: 1710401920000,
  //       updatedTime: 1710401920000,
  //       storeName: "方旭龙岗麟恒中心广场",
  //       username: "15994811809",
  //       phoneNumber: "15994811809",
  //       realName: "吴玲珠",
  //       roleName: "店长",
  //     },
  //   ],
  //   ts: 1710914982719,
  // }
  return await get<Store[]>("/shop/currentUserStores")
}

/**
 * 修改商品库存
 * @returns
 */
export async function updateGoodsStock(option: {
  changeQty?: number
  priceId?: number
  productId?: number
  storeId?: number
}) {
  return await post("/stock/stockReport", option)
}

/**
 * 获取订单列表
 * @returns
 */
export async function fetchOrderList(data: {
  storeId: number
  orderQryStatus: number
  pageNumber: number
}) {
  return await post<{
    pageNumber: number
    totalCount: number
    result: any[]
  }>("/order/storeOrderPageWithItems", {
    ...data,
    pageSize: 10,
  })
}

/**
 * 获取订单详情
 * @returns
 */
export async function fetchOrderDetail(params: { orderId: string | number }) {
  return await get<OrderDetail>("/order/queryStoreOrderDetail", {
    params: params,
  })
}

/**
 * 确认订单
 * @returns
 */
export async function submitSn(data: {
  orderId: number | string
  snItemList: Array<{ orderItemId: number | string; snList: string[] }>
  storeId: number | string
}) {
  return post("/order/submitSNAndShipment", data)
}

/**
 * 获取订单进度
 * @returns
 */
export async function fetchOrderProcess(params: { orderId: string | number }) {
  return get<PostInfo>("/order/getOrderLog", {
    params,
  })
}

export async function confirmReject(params: { orderId: string }) {
  return get("/order/confirmReject", {
    params,
  })
}

type SignInfo = {
  nonceStr: string
  timestamp: string
  signature: string
}

export function fetchSignInfo(url: string) {
  return get<SignInfo>("/wx/jsSignature", { params: { url } })
}

/** 查询出库单 */
export function fetchStockOut(params: { orderId: string | number }) {
  return get<I_StockOut[]>("/order/listDeliverOrder", { params })
}

/**
 * 查询购物清单详情
 * @param params
 * @returns
 */
export function fetchShoppingListDetail(params: { orderId: string | number }) {
  return get<I_ShoppingListDetail>("/order/getBuyList", { params })
}

/**
 * 提交序列号
 */
export function submitNo(data: I_SubmitNoData) {
  return post("/order/submitSN", data)
}

/**
 * 出库
 */
export function stockOut(orderId: number | string, storeId: number | string) {
  return post("/order/shipment", {
    orderId,
    storeId,
  })
}

/** 再投放 */
export function reDelivery(orderId: number | string) {
  return get("/order/reDeliver", { params: { orderId } })
}

export function fetchGoodsTypeList(goodsId = 0) {
  return get<I_GoodsType[]>("/product/category/listCategoryByParentId", {
    params: { parentId: goodsId },
  })
}

export type I_GoodsType = {
  categoryId: number
  categoryName: string
  subList: I_GoodsType[]
}

export type I_StockOut = {
  /** 收货人 */
  consignee: string

  /** 联系人手机 */
  consigneeMobile: string
  /** 收货地址 */
  deliveryAddress: string
  /** 店 */
  dian: string
  /** 	应收金额 */
  due: string
  /** 订单条形码 */
  orderBarcode: string
  /** 订单Id */
  orderId: string
  /** 订单号 */
  orderNo: number
  /** 预期送达时间 */
  promiseMsg: string
  /** 第三方订单号 */
  thirdOrderNo: string
  /** 第几件数 */
  which: string
}

type Order = {
  quantity: number
  orderItemId: number
  orderId: number

  /** 序列号英文逗号拼接 */
  productUniqueId?:string
}

type Ship = {
  consignee: string
  consigneeMobile: string
  deliveryAddress: string
  /** 预计送达 */
  promiseMsg: string
}
export type OrderDetail = {
  createdTime: string
  orderId: number
  orderNo: string
  /**
   * 订单明细
   */
  orderItemList: Order[]

  /**
   * 配送信息
   */
  orderShipList: Ship[]

  getCode: string
  orderStatus: string
  orderStatusDesc: string
  thirdOrderNo: string

  /** 是否已提交序列号 */
  snsubmitted: boolean
}
type Response<T> = {
  code: number
  data: T
  message: string
}
export type Stock = {
  /**
   * 当前库存
   */
  currentQty: number

  /**
   * 订单预占库存
   */
  orderQty: number

  /**
   * 约定价
   */
  price: number

  /**
   * 价格Id
   */
  priceId?: number

  stockId?: number

  /**
   * 商品Id
   */
  productId: number

  /**
   * 商品名称
   */
  productName: string

  /**
   * 门店Id
   */
  storeId: number

  /**
   * 可用库存
   */
  usableQty: number
}

export type Store = {
  /**
   * 	业务线号
   */
  businessId: string

  /**
   * 创建时间
   */
  createdTime: string

  /**
   * 是否禁用：0是; 1否
   */
  enabled: 0 | 1

  /**
   * 电话
   */
  phoneNumber: string

  /**
   * 真实姓名
   */
  realName: string
  relId: number

  /**
   * 角色Id
   */
  roleId: string
  /**
   * 角色名
   */
  roleName: string

  /**
   * 点位ID
   */
  storeId: number

  /**
   * 点位名称
   */
  storeName: string

  /**
   * 用户ID
   */
  uid: number

  /**
   * 更新时间
   */
  updatedTime: string

  /**
   * username
   */
  username: string
}
type PostInfo = {
  /**
   * 运单号
   */
  deliveryId: string

  /**
   * 	订单ID
   */
  orderId: number
  /**
   * 订单编号
   */
  orderNo: string

  /**
   * 第三方订单编号
   */
  thirdOrderNo: string

  statusLogList: {
    orderStatusDesc: string
    orderStatus: string
    createTIme: string
    operator: string
  }[]
}

export type I_ShoppingListDetail = {
  /** 收货人 */
  consignee: string

  /** 联系人手机 */
  consigneeMobile: string
  /** 收货地址 */
  deliveryAddress: string

  /** 运单号 */
  deliveryId: string
  /** 订单Id */
  orderId: string
  /** 订单号 */
  orderNo: number

  /** 预期送达时间 */
  promiseMsg: string

  /** 第三方订单号 */
  thirdOrderNo: string

  /** 包裹数 */
  qty: number

  /** 商品信息 */
  productInfoList: {
    /** 商家商品编码 */
    outSkuId: string
    /** 商品Id */
    productId: number
    /** 数量 */
    qty: number
    /** 京东商品编码 */
    salesChannelSkuId: string
    /** UPC码 */
    upc: string

    /** 商品名称 */
    productName: string
  }[]
}

export type I_SubmitNoData = {
  /** 订单ID */
  orderId: number | string
  /** 序列号明细 */
  snItemList: {
    /** 订单明细ID */
    orderItemId: number | string

    /** 序列号 */
    snList: string[]
  }[]

  /** 门店ID */
  storeId: number | string
}
