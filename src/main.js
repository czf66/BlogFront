import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/base.css';
// 引入iconfont的css
import '../iconfont/iconfont.css'

// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.prototype.$baseUrl = process.env.VUE_APP_BASEURL

Vue.use(ElementUI, { size: 'small' });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
