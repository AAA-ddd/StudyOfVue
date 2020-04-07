import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径***
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 请求拦截 让每次发出的接口请求前面带上 toekn
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)
Vue.use(ZkTable)

new Vue({
  router,
  render: h => h(App)

}).$mount('#app')
