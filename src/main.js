import Vue from 'vue'
import App from './App.vue'
import VTrackImg from "./";
import trackEvents from "./tracks/index";
Vue.use(VTrackImg, {
  trackEvents,
  trackEnable: {
    UVPV: "routeUpdate",
    TONP: false
  },
  trackBaseConfig: {
    url:"", //域名
    channel:"", //渠道
    project:"",//项目
    whiteList:[],// 白名单列表，在白名单的地址不会发送埋点请求
  }
});


new Vue({
  el: '#app',
  render: h => h(App)
})
