
import { HOST } from '@/config'
import { getAppToken, redirectToLogin, setAppToken } from '@/utils'
import Axios, { AxiosRequestConfig } from 'axios'
const axios = Axios.create({
  timeout: 1000 * 6,
  timeoutErrorMessage: "请求超时,稍候重试",
  baseURL: HOST
})
/** 不需要token的接口 */
const notNeedToken = ['/sms/sendVerifyCode', '/login']

axios.interceptors.request.use((config) => {
  const url = config.url;
  if (notNeedToken.includes(url ?? '')) return config;
  const token = getAppToken()
  config.headers.Authorization = token
  return config
})

axios.interceptors.response.use(res => {
  if (res.data?.code == 10000) {
    return res.data
  }

  // a0006 登录信息过期  c0002登录时微信报错
  if (res.data?.code == 'A0006' || res.data?.code == 'C0002') {
    setAppToken('')
    return redirectToLogin()
  }
  
  return Promise.reject(new Error(res.data?.msg ?? '系统异常'))
}, (error) => {
  return Promise.reject(error)
})

type Response<T> = {
  code: number
  data: T
  message: string
}

function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig<any>) {
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
  return get('/sms/sendVerifyCode', {
    params: {
      phoneNumber
    }
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
  }>('/login', {
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
  }>('/user/currentUser')
}
/**
 * 登出
 * @param userName 
 * @param verifyCode 
 * @returns 
 */
export async function logout() {
  return await post('/exit')
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
/**
 * 获取商品库存
 */
export async function fetchGoodsStockList(options: {
  pageNumber: number
  productName?: string
  searchType: "1" | '2'
  storeId?: string | number
}) {
  return await post<{
    result: Stock[]
    pages: number
    pageNumber: number
    totalCount: number
  }>('/stock/stockPage', {
    ...options,
    pageSize: 10
  })
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
/**
 * 获取门店列表
 * @returns 
 */
export async function fetchStoresList() {
  return await get<Store[]>('/shop/currentUserStores')
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
  return await post('/stock/stockReport', option)
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
  }>('/order/storeOrderPageWithItems', {
    ...data,
    pageSize: 10
  })
}

type Order = {
  quantity: number
  orderItemId: number
  orderId: number
}

type Ship = {
  consignee: string
  consigneeMobile: string
  deliveryAddress: string
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
}
/**
 * 获取订单详情
 * @returns 
 */
export async function fetchOrderDetail(params: { orderId: string | number }) {
  return await get<OrderDetail>('/order/queryStoreOrderDetail', {
    params: params
  })
}

/**
 * 确认订单
 * @returns 
 */
export async function submitSn(data: {
  orderId: number | string
  snItemList: Array<{ orderItemId: number | string, snList: string[] }>
  storeId: number | string
}) {
  return post('/order/submitSNAndShipment', data)
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
/**
 * 获取订单进度
 * @returns 
 */
export async function fetchOrderProcess(params: { orderId: string | number }) {
  return get<PostInfo>("/order/getOrderLog", {
    params
  })
}

export async function confirmReject(params: { orderId: string }) {
  return get('/order/confirmReject', {
    params
  })
}

type SignInfo = {
  nonceStr: string
  timestamp: string
  signature: string
}

export function fetchSignInfo(url: string) {
  return get<SignInfo>('/wx/jsSignature', { params: { url } })
}