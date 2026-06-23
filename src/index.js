// Vue Query Builder 库入口文件
import VueQueryBuilder from './VueQueryBuilder.vue'
import ElementPlusGroup from './layouts/ElementPlus/ElementPlusGroup.vue'
import ElementPlusRule from './layouts/ElementPlus/ElementPlusRule.vue'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import { createI18n } from 'vue-i18n'

// 导出语言包
export const zhCNMessages = zhCN
export const enUSMessages = enUS

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const getDefaultLocale = () => {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('zh')) {
      return 'zh-CN'
    }
  }
  return 'en-US'
}

const createQueryBuilderI18n = (options = {}) => {
  return createI18n({
    legacy: false,
    locale: options.locale || getDefaultLocale(),
    fallbackLocale: options.fallbackLocale || 'en-US',
    messages: Object.assign({}, messages, options.messages || {})
  })
}

// 导出组件
export { VueQueryBuilder }
export { ElementPlusGroup }
export { ElementPlusRule }
export { createQueryBuilderI18n }
export { zhCN, enUS, messages, getDefaultLocale }

// 默认导出组件
export default VueQueryBuilder

// 提供一个 install 方法，方便全局注册
VueQueryBuilder.install = function (app, options = {}) {
  // 初始化 i18n（如果用户没有提供自己的）
  if (options.i18n) {
    // 如果用户提供了 i18n 实例，直接使用
    app.use(options.i18n)
  } else if (options.useI18n !== false) {
    // 创建新的 i18n 实例
    const i18n = createQueryBuilderI18n(options)
    app.use(i18n)
  }

  // 注册组件
  app.component('VueQueryBuilder', VueQueryBuilder)
  app.component('ElementPlusGroup', ElementPlusGroup)
  app.component('ElementPlusRule', ElementPlusRule)

  return app
}

// 提供一个创建 i18n 实例的辅助函数，供用户单独使用
VueQueryBuilder.useI18n = createQueryBuilderI18n
