import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { Vue3Mq } from "vue3-mq"
import clickOutside from './helpers/click-outside-directive.js'
import appear from './helpers/transition-appear-directive'
import { toTitleCase } from './helpers/toTitleCase'
import { v4 as uuidv4 } from 'uuid';
import { clerkPlugin } from 'vue-clerk/plugin'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
app.directive('click-outside', clickOutside);
app.directive('appear', appear)
app.use(clerkPlugin, {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
})
app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(Vue3Mq);
app.config.globalProperties.$uuid = uuidv4;
app.config.globalProperties.$toTitleCase = toTitleCase

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')

const globals = app.config.globalProperties
export { globals }