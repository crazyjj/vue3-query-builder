import { createApp, provide } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './locales'
import { useI18n } from 'vue-i18n'

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.provide('useI18n', useI18n)
app.mount('#app')
