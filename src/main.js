import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import main from './main.vue'
import main from './main.vue'


import axios from 'axios'
const app = createApp(main)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 设置 axios 的请求根路径
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true;  
// 将 axios 挂载为 app 的全局自定义属性
// 每个组件可以通过 this 直接访问到全局挂载的自定义属性
app.config.globalProperties.$http = axios

import './assets/style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import login from './components/login.vue'
import man from './components/App.vue'
import AnchorData from './components/AnchorData.vue'
import forgotPassword from './components/forgotPassword.vue'
import personal from './components/personal.vue'
import register from './components/register.vue'
import StartLive from './components/StartLive.vue'
import Withdrawal from './components/Withdrawal.vue'

const routes = [
  { path: '/', component: login },
  { path: '/main',
    component: man ,
    children: [
      { path: '/main/AnchorData', component: AnchorData },
      { path: '/main/personal', component: personal },
      { path: '/main/StartLive', component: StartLive },
      { path: '/main/Withdrawal', component: Withdrawal },
    ]

  },
  { path: '/forgotPassword', component: forgotPassword },
  // { path: '/main/personal', component: personal },
  { path: '/register', component: register },
  // { path: '/main/StartLive', component: StartLive },
  // { path: '/main/Withdrawal', component: Withdrawal },
]
  // 配置路由
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })
  app.use(router)
  app.mount('#app')

    
  