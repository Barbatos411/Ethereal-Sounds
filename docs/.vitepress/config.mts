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
      groupIconVitePlugin({
        customIcon: {
          js: "logos:javascript", //js图标
          md: "logos:markdown", //markdown图标
          css: "logos:css-3", //css图标
          pip: "logos:python", //python图标
          github:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584c.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076c-.343-.93-.881-1.175-.881-1.175c-.734-.489.048-.489.048-.489c.783.049 1.224.832 1.224.832c.734 1.223 1.859.88 2.3.685c.048-.538.293-.88.489-1.076c-1.762-.196-3.621-.881-3.621-3.964c0-.88.293-1.566.832-2.153c-.05-.147-.343-.978.098-2.055c0 0 .685-.196 2.201.832c.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832c.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915c.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.98 7.98 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0" clip-rule="evenodd"/></svg>', //github图标
          gitee:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#ca3f06" fill-rule="evenodd" d="M8 7v2.4h3.97c-.16 1.03-1.2 3.02-3.97 3.02c-2.39 0-4.34-1.98-4.34-4.42S5.61 3.58 8 3.58c1.36 0 2.27.58 2.79 1.08l1.9-1.83C11.47 1.69 9.89 1 8 1C4.13 1 1 4.13 1 8s3.13 7 7 7c4.04 0 6.72-2.84 6.72-6.84c0-.46-.05-.81-.11-1.16z" clip-rule="evenodd"/></svg>', //gitee图标
          python: "logos:python", //python图标
          bash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M13.655 3.56L8.918.75a1.79 1.79 0 0 0-1.82 0L2.363 3.56a1.89 1.89 0 0 0-.921 1.628v5.624a1.89 1.89 0 0 0 .913 1.627l4.736 2.812a1.79 1.79 0 0 0 1.82 0l4.736-2.812a1.89 1.89 0 0 0 .913-1.627V5.188a1.89 1.89 0 0 0-.904-1.627zm-3.669 8.781v.404a.15.15 0 0 1-.07.124l-.239.137c-.038.02-.07 0-.07-.053v-.396a.78.78 0 0 1-.545.053a.07.07 0 0 1-.027-.09l.086-.365a.15.15 0 0 1 .071-.096a.05.05 0 0 1 .038 0a.66.66 0 0 0 .497-.063a.66.66 0 0 0 .37-.567c0-.206-.112-.292-.384-.293c-.344 0-.661-.066-.67-.574A1.47 1.47 0 0 1 9.6 9.437V9.03a.15.15 0 0 1 .07-.126l.231-.147c.038-.02.07 0 .07.054v.409a.75.75 0 0 1 .453-.055a.073.073 0 0 1 .03.095l-.081.362a.16.16 0 0 1-.065.09a.06.06 0 0 1-.035 0a.6.6 0 0 0-.436.072a.55.55 0 0 0-.331.486c0 .185.098.242.425.248c.438 0 .627.199.632.639a1.57 1.57 0 0 1-.576 1.185zm2.481-.68a.1.1 0 0 1-.036.092l-1.198.727a.034.034 0 0 1-.04.003a.04.04 0 0 1-.016-.037v-.31a.09.09 0 0 1 .055-.076l1.179-.706a.035.035 0 0 1 .056.035v.273zm.827-6.914L8.812 7.515c-.559.331-.97.693-.97 1.367v5.52c0 .404.165.662.413.741a1.5 1.5 0 0 1-.248.025c-.264 0-.522-.072-.748-.207L2.522 12.15a1.56 1.56 0 0 1-.75-1.338V5.188a1.56 1.56 0 0 1 .75-1.34l4.738-2.81a1.46 1.46 0 0 1 1.489 0l4.736 2.812a1.55 1.55 0 0 1 .728 1.083c-.154-.334-.508-.427-.92-.185h.002z"/></svg>', //bash图标
          cmd: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="#000"><path d="m10.875 7l2.008 5h-.711l-2.008-5zm-5.125.594q-.414 0-.75.125a1.54 1.54 0 0 0-.578.375q-.243.25-.375.61a2.4 2.4 0 0 0-.133.827q0 .43.117.781t.352.594q.234.243.57.383q.337.14.766.133a2.6 2.6 0 0 0 .992-.195l.125.484a2 2 0 0 1-.492.148a4.4 4.4 0 0 1-.75.07a2.6 2.6 0 0 1-.914-.156a2.2 2.2 0 0 1-.742-.453a1.9 1.9 0 0 1-.485-.742a3.2 3.2 0 0 1-.18-1.023q0-.547.18-1t.5-.782q.32-.328.774-.507a2.7 2.7 0 0 1 1-.18q.445 0 .718.07q.274.07.399.14l-.149.493a2 2 0 0 0-.406-.14a2.4 2.4 0 0 0-.539-.055M8 8h1v1H8zm0 2h1v1H8z"/><path d="M15.5 1H.5l-.5.5v13l.5.5h15l.5-.5v-13zM15 14H1V5h14zm0-10H1V2h14z"/></g></svg>', //cmd图标
          linux:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M13.281 11.156a.84.84 0 0 1 .375.297q.125.188.18.453q.03.155.07.29a1.8 1.8 0 0 0 .219.476q.07.109.188.242q.1.11.18.281a.8.8 0 0 1 .077.328a.5.5 0 0 1-.093.305a1 1 0 0 1-.235.219q-.18.125-.375.219q-.195.093-.39.195a3.6 3.6 0 0 0-.555.328q-.235.172-.469.438a2.8 2.8 0 0 1-.625.523a1.5 1.5 0 0 1-.383.172q-.195.055-.39.07q-.453 0-.75-.156t-.516-.57q-.062-.118-.125-.149a.8.8 0 0 0-.203-.055L8.67 15q-.39-.03-.796-.031a4 4 0 0 0-.672.054q-.344.055-.68.133q-.07.016-.14.117a2 2 0 0 1-.196.227a1.1 1.1 0 0 1-.335.219a1.5 1.5 0 0 1-.555.101q-.258 0-.555-.054a1.8 1.8 0 0 1-.531-.18a3.6 3.6 0 0 0-.953-.328q-.469-.086-.992-.156a3 3 0 0 1-.344-.063a.8.8 0 0 1-.29-.133a.7.7 0 0 1-.194-.219a.8.8 0 0 1-.079-.351q0-.243.063-.469t.07-.476q0-.173-.023-.336a4 4 0 0 1-.032-.352q0-.397.188-.586q.187-.187.547-.297a1 1 0 0 0 .297-.148a2 2 0 0 0 .234-.203a2 2 0 0 0 .203-.242q.094-.134.211-.266a.1.1 0 0 0 .024-.07q0-.095-.008-.18l-.016-.188q0-.53.164-1.07q.165-.539.43-1.055a9 9 0 0 1 .594-.992q.328-.476.648-.883a4.4 4.4 0 0 0 .68-1.203q.226-.625.234-1.36q0-.311-.031-.616a6 6 0 0 1-.031-.625q0-.626.14-1.125q.141-.5.438-.86c.297-.36.456-.419.773-.539Q7.633.015 8.296 0q.79 0 1.259.313q.468.312.718.82q.25.507.32 1.133q.072.624.079 1.265v.133q0 .321.008.57a2.5 2.5 0 0 0 .226.977q.11.242.328.523q.375.494.766.993q.39.5.71 1.03q.321.532.524 1.11t.211 1.25a3.3 3.3 0 0 1-.164 1.04zm-6.554-8.14q.108 0 .18.054a.36.36 0 0 1 .109.149a1 1 0 0 1 .054.187q.016.094.016.196a.3.3 0 0 1-.024.125a.3.3 0 0 1-.07.086l-.094.078a1 1 0 0 0-.093.093a.4.4 0 0 1-.149.141a2 2 0 0 0-.18.117a1.3 1.3 0 0 0-.156.133a.26.26 0 0 0-.07.195q0 .07.07.117a.7.7 0 0 1 .266.305q.079.18.172.352q.093.17.242.289q.149.117.46.117h.048q.312-.015.594-.164q.281-.148.562-.313a1 1 0 0 1 .102-.046a.4.4 0 0 0 .101-.055l.57-.445a1 1 0 0 0 .024-.102l.016-.11a.24.24 0 0 0-.04-.14a.4.4 0 0 0-.093-.094a.34.34 0 0 0-.133-.054a1 1 0 0 1-.14-.04a1.1 1.1 0 0 1-.352-.14a1.5 1.5 0 0 0-.344-.156q-.03-.008-.047-.047a1 1 0 0 1-.031-.094a.2.2 0 0 1-.008-.102a.13.13 0 0 0-.008-.078q0-.093.016-.195a.6.6 0 0 1 .07-.195a.4.4 0 0 1 .125-.14a.4.4 0 0 1 .203-.056q.243 0 .352.18q.11.18.117.39a.4.4 0 0 1-.039.18a.4.4 0 0 0-.04.172q0 .063.04.086a.3.3 0 0 0 .102.031q.18 0 .234-.085a.53.53 0 0 0 .062-.258q0-.18-.03-.399a1.3 1.3 0 0 0-.126-.406a1 1 0 0 0-.242-.313a.57.57 0 0 0-.383-.124q-.405 0-.586.203q-.18.202-.187.609q0 .117.015.234T8 3.719q0 .039-.008.039a.2.2 0 0 1-.047-.016l-.093-.039a1 1 0 0 0-.118-.039a.5.5 0 0 0-.203-.008a1 1 0 0 1-.125.008q-.11 0-.11-.039q0-.117-.015-.297t-.078-.36a1 1 0 0 0-.156-.296q-.094-.117-.281-.125a.32.32 0 0 0-.227.086a1 1 0 0 0-.164.203a.64.64 0 0 0-.086.266a5 5 0 0 1-.031.25a1.5 1.5 0 0 0 .07.406q.04.125.086.219q.047.093.11.093q.038 0 .101-.054q.063-.055.063-.102q0-.024-.024-.031a.2.2 0 0 0-.047-.008q-.054 0-.094-.055a.5.5 0 0 1-.062-.125l-.047-.148a.56.56 0 0 1 .055-.398q.07-.126.258-.133M5.023 15.18q.188 0 .368-.032a1 1 0 0 0 .336-.125a.6.6 0 0 0 .234-.242a.9.9 0 0 0 .094-.375a.8.8 0 0 0-.047-.273a1 1 0 0 0-.133-.25a3 3 0 0 0-.203-.281a3 3 0 0 1-.203-.282l-.29-.43q-.14-.21-.28-.445a8 8 0 0 1-.235-.406a2.7 2.7 0 0 0-.266-.398a1.2 1.2 0 0 0-.218-.211a.47.47 0 0 0-.29-.094a.44.44 0 0 0-.296.11a2 2 0 0 0-.258.265a3 3 0 0 1-.297.305q-.164.149-.422.234a.74.74 0 0 0-.312.172q-.11.11-.11.336q0 .156.024.312q.023.156.031.313q0 .21-.063.398a1.2 1.2 0 0 0-.062.367q0 .212.148.297q.15.087.336.117q.235.04.446.063q.21.024.414.07q.202.047.406.102q.203.054.43.172q.046.023.14.054l.211.07q.117.04.219.063a1 1 0 0 0 .148.024m2.86-.938q.219 0 .469-.047a3.5 3.5 0 0 0 .976-.336a2.6 2.6 0 0 0 .406-.257a.2.2 0 0 0 .032-.047a.3.3 0 0 0 .023-.063v-.008q.046-.172.078-.375a9 9 0 0 0 .055-.414a9 9 0 0 1 .055-.414q.03-.203.054-.398q.032-.21.078-.406q.047-.195.125-.368a1 1 0 0 1 .211-.304a1.5 1.5 0 0 1 .344-.25v-.016l-.008-.023a.3.3 0 0 1 .047-.149a1.4 1.4 0 0 1 .117-.164a.6.6 0 0 1 .149-.133a1 1 0 0 1 .164-.078a10 10 0 0 0-.102-.375a5 5 0 0 1-.094-.375a7 7 0 0 0-.093-.476a3 3 0 0 0-.11-.36a1.3 1.3 0 0 0-.18-.32q-.116-.157-.288-.375a1 1 0 0 1-.118-.156a.6.6 0 0 1-.046-.196a2 2 0 0 0-.047-.203a10 10 0 0 0-.242-.75a3 3 0 0 0-.172-.383a4 4 0 0 0-.172-.289q-.078-.117-.164-.117q-.188 0-.446.149q-.257.148-.546.328t-.563.336q-.273.156-.492.148a.7.7 0 0 1-.43-.148a2.2 2.2 0 0 1-.36-.344q-.164-.195-.273-.336t-.164-.156q-.062 0-.07.093a3 3 0 0 0-.008.211v.133q0 .047-.016.063q-.086.18-.187.351q-.101.172-.203.352a1.6 1.6 0 0 0-.219.758q0 .117.016.234q.015.117.078.227l-.016.03a1.3 1.3 0 0 1-.133.157a1 1 0 0 0-.132.164a2.8 2.8 0 0 0-.407.93q-.117.5-.125 1.015q0 .134.016.266q.016.133.016.266l-.008.086l-.008.086a.75.75 0 0 1 .313.109q.18.102.39.258t.399.36q.187.202.359.398q.172.195.25.39t.101.32a.44.44 0 0 1-.125.329a1 1 0 0 1-.312.203q.133.234.328.398q.195.165.422.266t.492.148t.516.047m3.133 1.11q.164 0 .32-.047a1.7 1.7 0 0 0 .445-.203q.203-.133.375-.329a3.1 3.1 0 0 1 .977-.75l.258-.117a2 2 0 0 0 .257-.133a1 1 0 0 0 .165-.132a.26.26 0 0 0 .078-.188a.3.3 0 0 0-.024-.117a.6.6 0 0 0-.07-.117a5 5 0 0 1-.203-.305a2 2 0 0 1-.149-.297l-.125-.312a3 3 0 0 1-.11-.352a.3.3 0 0 0-.054-.101a.53.53 0 0 0-.46-.235a.53.53 0 0 0-.266.07l-.266.149a7 7 0 0 1-.281.148a.66.66 0 0 1-.297.07a.4.4 0 0 1-.258-.077a.6.6 0 0 1-.172-.211a2 2 0 0 1-.117-.258l-.094-.258a1.3 1.3 0 0 1-.14.188a.7.7 0 0 0-.125.203q-.102.234-.125.523q-.039.453-.102.883a4.7 4.7 0 0 1-.21.86a2 2 0 0 0-.063.273a3 3 0 0 0-.032.289q0 .383.235.633t.633.25"/></svg>', //Linux/Unix/MacOS图标
          windows:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="m6 1.5l.5-.5h8l.5.5v7l-.5.5H12V8h2V4H7v1H6zM7 2v1h7V2zM1.5 7l-.5.5v7l.5.5h8l.5-.5v-7L9.5 7zM2 9V8h7v1zm0 1h7v4H2z" clip-rule="evenodd"/></svg>',
        },
      }), //代码组图标
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
      pattern:
        "https://github.com/Barbatos411/Ethereal-Sounds/edit/main/docs/:path",
      text: "在GitHub编辑本页",
    },
    //页脚
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Ethereal-Sounds",
    },
    //上次更新时间 //
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short", // 可选值full、long、medium、short
        timeStyle: "medium", // 可选值full、long、medium、short
      },
    },
    //本地搜索
    search: {
      provider: "local",
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
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
          { text: "从安装包开始", link: "/start.html" },
          { text: "从原代码开始", link: "/start.html#环境要求" },
        ],
      },
      {
        text: "⛏️API文档",
        items: [
          { text: "基础信息", link: "/API.html#基础信息" },
          { text: "平台接口", link: "/API.html#平台相关接口" },
          { text: "数据库接口", link: "/API.html#数据库相关接口" },
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
