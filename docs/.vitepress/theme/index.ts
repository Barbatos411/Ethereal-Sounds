// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './style/blur.css'
import './style/custom-block.css'
import './style/vp-code-group.css'
import './style/vp-code-title.css'

import { inBrowser } from 'vitepress'

import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';

import Mycomponent from "./components/Mycomponent.vue"
import 'virtual:group-icons.css' //代码组样式 //
import Linkcard from "./components/Linkcard.vue"
import confetti from "./components/confetti.vue"

import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import 'nprogress-v2/dist/index.css' // 进度条样式

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Linkcard', Linkcard)
    app.component('confetti', confetti)
    app.component('Mycomponent', Mycomponent)

    if (inBrowser) {
      NProgress.configure({ showSpinner: false })
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChanged = () => {
        NProgress.done() // 停止进度条
      }
    }
  }
} satisfies Theme


// 人生处一世,去若朝露兮