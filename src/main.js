import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
//引入路由
import router from './router'
//全局引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入less样式
import './assets/less/index.less'
//注册图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入store
import store from './store/index.js'
//引入mock
import './api/mock.js'
//引入api
import api from './api/api.js'

const app = createApp(App);
//注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)//全局注册路由
app.use(store)//全局注册store
app.use(ElementPlus)//全局注册element-plus
app.config.globalProperties.$api = api//全局挂载api

//全局路由守卫
router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.replaceState.token
    if (!token && to.name !== 'login') {
        next({ name: "login" })
    } else {
        next()
    }
})

app.mount('#app')
