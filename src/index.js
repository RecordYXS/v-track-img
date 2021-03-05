/*
 * @Author: yuxiaosong
 * @Date: 2021-01-15 11:55:01
 * @Last Modified by: yuxiaosong
 * @Last Modified time: 2021-01-15 11:55:01
 */
import * as hooks from "./hooks";
import { trackConfig, trackAction } from "./tracks/action";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";

export default class VTrackImg {
  constructor() {
    this.installed = false;
  }
  // 保存当前点击的元素
  // static target = null;
  // Vue.use 将执行此方法
  static install(Vue, { trackEvents, trackEnable = {}, trackBaseConfig = {}, sentryConfig = {} }) {
    trackEnable = {
      UVPV: false,
      TONP: false,
      ...trackEnable
    };
    if(trackBaseConfig != {}){
      trackConfig(trackBaseConfig)
    }
    if(sentryConfig != {}){
      //sentry  获取报错信息  只有在正式环境才会发送报错数据
      sentryConfig.env == "production" && Sentry.init({
        dsn: sentryConfig.dsn,
        integrations: [
          new VueIntegration({
            Vue,
            tracing: true,
          }),
          new Integrations.BrowserTracing(),
        ],
        release: sentryConfig.release,
        logErrors: true,
        tracesSampleRate: 1.0,
      });
    }

    window.trackAction = trackAction;
    const TRACK_TONP = (ctx, et) => {
      if (trackEnable.TONP) {
        trackEvents.TONP(ctx, {
          et,
          dt: Date.now()
        });
      }
    };

    if (this.installed) return;
    this.installed = true;
    // 注册v-track全局指令
    Vue.directive("track", {
      bind: (...args) => hooks.bind.call(this, ...args, trackEvents),
      componentUpdated: (...args) =>
        hooks.updated.call(this, ...args, trackEvents),
      unbind: (...args) => hooks.unbind.call(this, ...args)
    });

    // 注册<track-view>全局组件
    Vue.component("TrackView", {
      render: h =>
        h("span", {
          style: "display: none"
        })
    });

    Vue.mixin({
      data: () => ({
        PAGE_ENTER_TIME: Date.now()
      }),
      created() {
        window.onbeforeunload = () => TRACK_TONP(this, this.PAGE_ENTER_TIME);
      },
      // 统计UV、PV
      beforeRouteEnter(_, __, next) {
        next(vm => {
          if(vm.$vnode.key){
            trackEnable.UVPV && trackEvents.UVPV(vm);
          }
        });
      },
      beforeRouteUpdate(_, __, next) {
        // 确保导航升级完成
        this.$watch("$route", () => {
          if (trackEnable.UVPV && trackEnable.UVPV === "routeUpdate") {
            trackEvents.UVPV(this);
          }
        });
        next();
      },
      // 页面停留时间
      beforeRouteLeave(_, __, next) {
        TRACK_TONP(this, this.PAGE_ENTER_TIME);
        next();
      }
    });
  }
}
