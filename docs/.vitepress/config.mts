import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

export default defineConfig({
  title: "Ethereal Sounds",
  description: "浮声 - Ethereal Sounds",
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin); //代码组图标
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(), //代码组图标
    ],
  },
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.jpg",
    nav: [
      { text: "主页", link: "/" },
      { text: "使用", link: "/start" },
      { text: "API", link: "/API" },
    ],
    //编辑本页
    editLink: {
      pattern: 'https://github.com/Barbatos411/Ethereal-Sounds/edit/main/docs/:path',
      text: '在GitHub编辑本页'
    },
    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Ethereal-Sounds'
    },
    //上次更新时间 //
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },
    //本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
        },
      },
    },
    returnToTopLabel: "返回顶部",
    sidebar: [
      {
        text: "🚀快速开始",
        items: [
          { text: "安装", link: "/start#安装" },
          { text: "配置", link: "/start#配置" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Barbatos411/Ethereal-Sounds",
        ariaLabel: "GitHub",
      },
      {
        icon: {
          svg: '<svg t="1744791044094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2594" width="200" height="200"><path d="M512 1024q-104 0-199-40-92-39-163-110T40 711Q0 616 0 512t40-199Q79 221 150 150T313 40q95-40 199-40t199 40q92 39 163 110t110 163q40 95 40 199t-40 199q-39 92-110 163T711 984q-95 40-199 40z m259-569H480q-10 0-17.5 7.5T455 480v64q0 10 7.5 17.5T480 569h177q11 0 18.5 7.5T683 594v13q0 31-22.5 53.5T607 683H367q-11 0-18.5-7.5T341 657V417q0-31 22.5-53.5T417 341h354q11 0 18-7t7-18v-63q0-11-7-18t-18-7H417q-38 0-72.5 14T283 283q-27 27-41 61.5T228 417v354q0 11 7 18t18 7h373q46 0 85.5-22.5t62-62Q796 672 796 626V480q0-10-7-17.5t-18-7.5z" p-id="2595"></path></svg>',
        },
        link: "https://gitee.com/Barbatos411/Ethereal-Sounds",
        ariaLabel: "Gitee",
      },
    ],
  },
});
