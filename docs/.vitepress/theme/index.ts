// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './style/blur.css'
import './style/custom-block.css'
import './style/vp-code-group.css'
import './style/vp-code-title.css'

import 'virtual:group-icons.css' //代码组样式 //
import Linkcard from "./components/Linkcard.vue"
import confetti from "./components/confetti.vue"

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Linkcard' , Linkcard)
    app.component('confetti' , confetti)
  }
} satisfies Theme
