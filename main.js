// 导入 store 的实例对象
import store from './store/store.js'

// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 2. 将 store 挂载到 Vue 实例上
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'

// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http

//请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求拦截器：请求开始之前做一些事情
$http.beforeRequest = function(option) {
  uni.showLoading({
    title: '数据加载中...'
  })
}

// 响应拦截器：请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装弹框方法
uni.$showMsg = function(title = '数据请求失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  
  return {
    app
  }
}
// #endif
