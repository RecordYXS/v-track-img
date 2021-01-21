/*
 * @Author: 于晓松
 * @Date: 2020-11-09 16:23:00
 */
let page = {}
export default {
  /**
   * @name UVPV 固定名称不支持修改
   * @desc UV、PV埋点
   * @param {Object} context 当前上下文
   */
  UVPV(context) {
    page = {
      path:"",
      fullPath:""
    }
    window.trackAction("1",page,"");
  },
  /**
   * @name TONP 固定名称不支持修改
   * @desc 页面停留时间埋点（Time on Page）
   * @param {Object} context 当前上下文
   * @param {Timestamp} et 进入页面时间
   * @param {Timestamp} dt 离开页面时间
   */
  TONP(_, { et, dt }) {
    window.trackAction("2", {
      stt: `${(dt - et) / 1e3}s`
    });
  },
  /**
   * @desc 自定义发送页面埋点请求
   * @name 10001 埋点唯一标识ID（自定义）
   * @param {Object} context 当前上下文
   * @param {Object} item 事件参数
   * @param {Object} event 事件对象
   */
  10001(context,item) {
    page = {
      path:"",
      fullPath:""
    }
    window.trackAction("4",page ,"",item);
  },
    /**
   * @desc 点击事件
   * @param {Object} context 当前上下文
   * @param {Object} item 事件参数
   * @param {Object} event 事件对象
   */
  10002({age, username, clickOperate}) {
    window.trackAction("3", page, clickOperate, {age,username});
  },
  
};
