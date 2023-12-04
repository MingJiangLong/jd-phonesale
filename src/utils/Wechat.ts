type WechatConfig = {
  appId: string
  hostUrl: string
  jsApiList: string[]
  debug?: boolean
}

type SignInfo = {
  nonceStr: string
  timestamp: string
  signature: string
}

/**
 * 页面进入main时候初始化 
 * 其他地方可能会导致获取不到code
 */
export default class Wechat {

  /**
   * 过期时间
   */
  private validTime = 0;
  private signInfo?: SignInfo;
  private refreshSignFn;
  private code: string

  /**
   * 微信 config函数需要的配置项
   */
  private options: WechatConfig = {
    appId: '',
    hostUrl: '',
    jsApiList: [],
    debug: false,
  }


  constructor(options?: WechatConfig, refreshSign?: (code: string) => Promise<SignInfo>) {

    this.options = {
      ...this.options,
      ...options
    }
    this.code = this.getCode();
    this.refreshSignFn = refreshSign;

    wx.error(async (error) => {
      // this.max--;
      // if (this.max > 0) {
      //   this.clearSignInfo();
      // }
      alert(JSON.stringify(error))
    })
  }


  getCode() {
    const [, search] = window.location.href.split('?')
    const searchParams = new URLSearchParams(search)
    return searchParams.get('code') ?? '';
  }

  isSignInfoChanged(newSignInfo: SignInfo) {
    const oldSignInfo = this.signInfo;
    return newSignInfo.nonceStr != oldSignInfo?.nonceStr
      || newSignInfo.signature != oldSignInfo?.signature
      || newSignInfo.timestamp != oldSignInfo?.timestamp
  }

  async refreshSign() {
    if (typeof this.refreshSignFn !== 'function') throw new Error('获取鉴权信息失败!');
    const signInfo = await this.refreshSignFn(this.code);
    if (!this.isSignInfoChanged(signInfo)) return;
    this.signInfo = signInfo;
    this.validTime = Date.now() + 7200 * 1000;
  }

  /**
   * 清除签名信息信息
   */
  async clearSignInfo() {
    this.validTime = 0;
    this.signInfo = void 0;
  }

  /**
   * 重置Wechat配置
   * @param options 
   */
  async resetConfig(options: WechatConfig) {
    this.options = options;
    this.clearSignInfo();
    await this.refreshSign()
    return await this.config()
  }

  /**
   * 签名是否可用
   * 主要是依据时间判断
   * @returns 
   */
  isSignInfoValid() {
    return this.validTime != 0 && Date.now() >= this.validTime
  }


  /**
   * 初始化重新调用config
   * @returns 
   */
  private async config() {
    return new Promise((s, e) => {
      if (!this.signInfo) throw new Error('获取签名信息失败!')
      const defaultOptions = this.options;
      if (!defaultOptions.appId) throw new Error('获取appId失败,调用resetConfig进行配置');
      wx.config({
        debug: defaultOptions.debug ?? true,
        appId: defaultOptions.appId,
        jsApiList: ["scanQRCode"],
        ...this.signInfo,
        success() {
          s(true)
        },
      })
    })

    return this;
  }

  async scanQRCode(): Promise<string | void> {
    // if (!this.isSignInfoValid()) {
    //   await this.refreshSign();
    //   await this.config();
    //   return this.scanQRCode()
    // }
    await this.refreshSign();
    await this.config();
    return new Promise((resolve) => {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          resolve(res.resultStr)
        }
      })

    })
  }
}