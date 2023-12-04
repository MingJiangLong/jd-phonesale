
declare namespace wx {
  function config(options: {
    debug: boolean, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: string, // 必填，公众号的唯一标识
    timestamp: string // 必填，生成签名的时间戳
    nonceStr: string, // 必填，生成签名的随机串
    signature: string,// 必填，签名
    jsApiList: string[]// 必填，需要使用的JS接口列表
    success?: () => void
  }): void

  function scanQRCode(options: {
    needResult: 0 | 1
    scanType: Array<"qrCode" | "barCode">
    success: (res: any) => void
  }): void

  function error(callback: (error: any) => void)
}


