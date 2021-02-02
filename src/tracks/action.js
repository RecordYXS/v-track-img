/*
 * @Author: yuxiaosong
 * @Date: 2021-01-15 11:55:01
 * @Last Modified by: yuxiaosong
 * @Last Modified time: 2021-01-28 13:55:01
 */

import object from './object'
import send from './send'

let trackBaseConfig = {
  url:"", //域名
  channel:"", //渠道
  whiteList:[],// 白名单列表，在白名单的地址不会发送埋点请求
  project:"", //项目
} 
export function trackConfig (config) {
  trackBaseConfig = config
} 
/**
 * 埋点Action
 */
export function trackAction(evt, page, clickOperate = '', addtional = {},uid = "") {
  //如果是手动修改channel，则替换原有的channel
  if(evt == 5){
    trackBaseConfig.channel = addtional.channel
    return false
  }
  if(localStorage.getItem("guid")==null){ //获取唯一标识
    localStorage.setItem("guid",object.guid())
  }
  //判断url里面是否有channelcode参数，如果有则替换channel
  const channelCode = object.getQueryVariable(page.fullPath,"channelcode")
  if(channelCode && channelCode != ""){
    trackBaseConfig.channel = channelCode
  }
  let data = {
    action:"",  //访问类型  clickview | pageview
    channel:trackBaseConfig.channel, //渠道
    page:page.path,   //访问页面
    clickOperate, //点击按钮的操作  列：查询|新增|编辑|查看|删除|导出|购买 等   如果action是clickview,那么clickOperate是必填项
    params:{...addtional},  //传递的参数
    ts: new Date().getTime(),  //时间戳
    uuid:localStorage.getItem("guid"), //唯一标识
    uid:uid, //用户id
    project:trackBaseConfig.project, //项目
  };
  if (evt === "1" || evt === "4") {
    data.action = "pageView"
    if(localStorage.getItem("sessionTime")==null){ //判断session是否存在，如果不存在则添加一个
      localStorage.setItem("sessionTime",new Date().getTime())
      localStorage.setItem("sessionId",object.sessionid())
    }else{
      const oldTime = localStorage.getItem("sessionTime")
      const newTime = new Date().getTime()
      const minute =  parseInt(Math.abs(newTime-oldTime)/1000/60);
      if(minute > 10){  //如果访问时长超过10分钟，则在生成一个新的
        localStorage.setItem("sessionTime",new Date().getTime())
        localStorage.setItem("sessionId",object.sessionid())
      }
    }
    // console.log("统计UVPV埋点");
  }
  if (evt === "2") {
    // console.log("统计页面停留时间埋点");
  }
  if (evt === "3") {
    data.action = "clickView"
    // console.log("点击事件埋点");
  }
  data.sessionId = localStorage.getItem("sessionId")
  if(trackBaseConfig.whiteList.indexOf(data.page) == -1 || evt == "4"){
    send(trackBaseConfig.url + "?" + object.toQueryString(data)) //发送埋点数据
  }
}