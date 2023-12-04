
declare namespace weui {

  /**
   * actionSheet 弹出式菜单
   * @param menus 上层的选项
   * @param actions 下层的选项
   * @param options 配置项
   */
  function actionSheet(menus: Pick<ActionSheet, 'Menus'>, actions: Pick<ActionSheet, 'Actions'>, options?: Pick<ActionSheet, 'Options'>): void

  /**
   * alert 警告弹框，功能类似于浏览器自带的 alert 弹框，用于提醒、警告用户简单扼要的信息，只有一个“确认”按钮，点击“确认”按钮后关闭弹框。
   * @param content 弹窗内容
   * @param onOk 点击确定按钮的回调
   * @param options 配置项
   */
  function alert(content: string, onOk?: () => void, options?: ModalOption): void

  /**
   * 确认弹窗
   * @param content 弹窗内容
   * @param onOk 点击确定按钮的回调
   * @param onCancel 点击取消按钮的回调
   * @param options 配置项
   */
  function confirm(content: string, onOk?: () => void, onCancel?: () => void, options?: ModalOption): void

  /**
   * dialog，弹窗，alert和confirm的父类
   * @param options 
   */
  function dialog(options: ModalOption & {
    /**
     * 弹窗的内容
     */
    content?: string
  }): void

  const form: {

    /**
     * 表单校验
     * @param selector 表单的selector(#id .class)
     * @param callback 校验后的回调
     * @param options 配置项
     */
    validate(selector: string, callback: (error?: any) => boolean, options?: { regexp?: { [k: string]: RegExp } }): void

    /**
     * 当表单的input失去焦点时校验
     * @param selector 表单的selector(#id .class)
     * @param options 配置项
     */
    checkIfBlur(selector: string, options?: { regexp?: { [k: string]: RegExp } }): void

    /**
     * showErrorTips 显示错误提示
     * @param error 
     */
    showErrorTips(error: {
      /**
       * 出错了的dom元素
       */
      ele: HTMLElement

      /**
       * 	出错了的msg。会根据此msg找到对应的Tips（比如msg是empty），那么ele上的emptyTips就会以topTips显示
       */
      msg: string
    }): void

    /**
     * hideErrorTips 隐藏错误提示
     * @param ele 
     */
    hideErrorTips(ele: HTMLElement): void
  }

  /**
   * gallery 带删除按钮的图片预览，主要是配合图片上传使用
   * @param url gallery显示的图片的url
   * @param options 
   */
  function gallery(url: string, options: ?{
    className?: string
    onDelete?: () => void
  }): void

  function loading(content: string, options?: { className?: string }): { hide: () => void }

  /**
   * picker 多列选择器。
   * @param items 
   * @param options 
   */
  function picker(items: PickerItem[], options?: PickerOption): void

  /**
   * datePicker 时间选择器，由picker拓展而来，提供年、月、日的选择。
   * @param options 
   */
  function datePicker(options: DatePickerOption): void

  /**
   * searchbar 搜索框，主要实现搜索框组件一些显隐逻辑
   * @param selector 
   */
  function searchBar(selector: string): void

  /**
   * slider slider滑块，单位是百分比。注意，因为需要获取slider的长度，所以必须要在slider可见的情况下来调用。
   * @param selector 
   * @param options 
   */
  function slider(selector: string, options?: SliderOptions): void

  /**
   * tab tab导航栏
   * @param selector 
   * @param options 
   */
  function tab(selector: string, options?: TabOptions): void

  /**
   * toast 一般用于操作成功时的提示场景
   * @param content 
   * @param options 
   */
  function toast(content: string, options?: ToastOptions): void

  /**
   * toptips 顶部报错提示
   * @param content 
   * @param options 
   */
  function topTips(content: string, options?: TopTipsOptions): void

  /**
   * uploader 上传组件
   * @param selector 
   * @param options 
   */
  function uploader(selector: string, options?: Partial<UploaderOptions>)
}

type UploaderOptions = {
  url: string
  auto: boolean
  type: string
  fileVal: string
  compress: {
    width?: number
    height?: number
    quality?: number
  }
  onBeforeQueued: (files: File[]) => void
  onQueued: () => void
  onBeforeSend: (data, headers) => void
  onSuccess: (ret) => void
  onProgress: (procent) => void
  onError: () => void

}
type TopTipsOptions = {
  duration?: number
  className?: string
  callback?: () => void
}
type ToastOptions = {
  duration?: number
  callback?: () => void
  className?: string
}
type TabOptions = {
  defaultIndex?: number
  onChange?: (index: number) => void
}
type SliderOptions = {
  step?: number
  defaultValue?: number
  onChange?: (percent: number) => void
}
type PickerItem = {
  label: string
  value: number
  disable?: boolean
  children?: PickerItem[]
}
type PickerOption = {
  depth?: 1 | 2 | 3
  id?: string
  className?: string
  container?: string
  defaultValue?: any[]
  onChange?: (value: any) => void
  onConfirm?: (value: any) => void
  onClose?: () => void
}
type DatePickerOption = {
  id?: string
  start?: number | string | Date
  end?: number | string | Date
  cron?: string
  className?: string
  defaultValue?: any[]
  onChange?: (value: any) => void
  onConfirm?: (value: any) => void
}

type Button = {
  /**
   * 按钮的文字
   */
  label: string

  /**
   * 按钮的类型 [primary, default]
   */
  type: 'primary' | 'default'

  /**
   * 按钮的回调
   * @returns 
   */
  onClick: () => void
}

type ModalOption = {

  /**
   * 弹窗的标题
   */
  title?: string

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 按钮配置项
   */
  buttons?: Button[]
}

type ActionSheet = {
  /**
   * 上层的选项
   */
  Menus: {
    /**
     * 选项的文字
     */
    label: string
    /**
     * 选项点击时的回调
     * @returns 
     */
    onClick: () => void
  }[]
  Actions: {
    label: string
    onClick: () => void
  }[]
  Options: {
    className: string
    onClose: () => void
  }
}


// type ActionSheetOptions = {
//   label: string
//   onClick: () => void
// }[]