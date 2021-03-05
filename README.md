# v-track-img

#这里非常感谢这位作者的思路和代码https://github.com/l-hammer/v-track

v-track通过 Vue 自定义指令的方式将埋点代码与业务代码完全解耦~

## 埋点策略
不再使用传统的调用接口的方式，去配合后端进行数据的传输。

而使用访问一张，0字节图片传参的方式去处理埋点数据，后端去获取访问日志，解析参数。

这样的好处非常多，比如：

- 减轻服务器压力
- 方法速度快，响应及时
- 前端不依赖后端接口
- 不和业务耦合
- 后端不用提供多个api埋点接口

## 安装

### YARN

```shell
$ yarn add v-track-img
```

### NPM

```shell
$ npm install v-track-img --save
```

### CDN

目前可以通过[unpkg.com/v-track-img](https://unpkg.com/v-track-img/)获取到最新版本的资源，在页面上使用 script 标签直接引入文件即可开始使用

```html
<script src="https://unpkg.com/v-track-img/dist/v-track-img.js"></script>
```


> 建议使用 CDN 引入 v-track-img 的用户在链接地址上锁定版本，以免将来 v-track-img 升级时受到非兼容性更新的影响。锁定版本的方法请查看 [unpkg.com](https://unpkg.com/) or [jsdelivr.com](https://www.jsdelivr.com/)。

## 用法

```js
import Vue from "vue"
import VTrackImg from "v-track-img"
import trackEvents from "./track-events"

Vue.use(VTrackImg, {
  trackEvents,// 埋点事件对象
  trackEnable: {
    UVPV: true,// 是否开启UVPV统计，routeUpdate即在当前路由参数发生改变时埋点，默认为false
    TONP: false // 是否开启页面停留时长统计，默认为false
  },
  trackBaseConfig: {
    url:"", //图片域名
    channel:"", //渠道
    whiteList:[],// 白名单列表，在白名单的地址不会自动发送埋点请求
  },
  sentryConfig:{ //sentyr配置
    dsn: "",
    release: '',
    env: process.env.VUE_APP_ENV
  }
});
```

```js
/* track-events.js */
/*
window.trackAction( //发送点击事件的埋点
    evt, //访问类型1-pvuv,2-统计页面停留时间埋点，3-点击事件，4-白名单
    page,  //页面路由对象 context.$router.currentRoute
    clickOperate,  //点击按钮的操作  例：查询|新增|编辑| 等
    item,  //埋点传的参数
    uid   //用户id
);
*/
export default {
  /**
   * @name UVPV 固定名称不支持修改
   * @desc UV、PV埋点
   * @param {Object} context 当前上下文
   */
  UVPV(context) {
    page = context.$router.currentRoute
    window.trackAction("1",page,"");
  },
  /**
   * @name TONP 固定名称不支持修改
   * @desc 页面停留时间埋点（Time on Page）
   * @param {Object} context 当前上下文
   * @param {Timestamp} et 进入页面时间
   * @param {Timestamp} dt 离开页面时间
   */
  TONP(context, { et, dt }) {
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
    page = context.$root._route //当前路由
    window.trackAction("4",page ,"",item, item.uid);
  },
  ...
}
```

```HTML
<!-- 页面行为埋点（track-view为v-track全局注册的组件） -->
<track-view v-track:10002></track-view>
<track-view v-track:10002.watch="{ rest }"></track-view>
<track-view v-track:10002.watch.delay="{ rest }"></track-view>
<track-view v-if="rest" v-track:10002></track-view>

<!-- 事件行为埋点（DOM） -->
<div v-track:10002.click="handleClick"></div>
<div v-track:10002.click="{ handleClick, item, index }"></div>
<div v-track:10002.click.async="{ handleSearch, rest }"></div>
<div v-track:10002.click.delay="handleClick"></div>

<!-- 事件行为埋点（组件） -->
<cmp v-track:10002.click="handleClick"></cmp>
<cmp v-track:10002.[自定义事件名]="handleSearch"></cmp>
<cmp v-track:10002.[自定义事件名].delay="handleSearch"></cmp>
<cmp v-track:10002.[自定义事件名].async="{ handleSearch, rest }"></cmp>

<!-- 区域展现埋点（block 可以是 DOM 或者组件） -->
<block v-track:10002.show></block>
<block v-track:10002.show.once></block>
<block v-track:10002.show.custom="{ ref: 'scroll' }"></block>
<block v-track:10002.show.custom.once="{ ref: 'scroll' }"></block>
```

## 指令修饰符

- `.click` 表示事件行为的埋点
- `.[custom-event]` 表示自定义事件行为的埋点
- `.native` 表示监听组件原生click事件行为的埋点
- `.watch` 表示页面异步行为的埋点
- `.async` 配合`.click`指令，表示异步事件行为的埋点
- `.delay` 表示埋点是否延迟执行，默认先执行埋点再执行回调
- `.show` 表示区域曝光埋点
- `.once` 配合`.show`指令，只执行一次埋点
- `.custom` 配合`.show`指令，表示使用自定义scroll事件

## LICENSE


For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
