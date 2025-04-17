import{_ as s,c as i,o as e,ag as n}from"./chunks/framework.Ds6Eueu6.js";const b=JSON.parse('{"title":"浮声 - Ethereal Sounds 启动指南","description":"","frontmatter":{},"headers":[],"relativePath":"start.md","filePath":"start.md","lastUpdated":1744905124000}'),l={name:"start.md"};function t(p,a,h,d,o,c){return e(),i("div",null,a[0]||(a[0]=[n(`<h1 id="浮声-ethereal-sounds-启动指南" tabindex="-1">浮声 - Ethereal Sounds 启动指南 <a class="header-anchor" href="#浮声-ethereal-sounds-启动指南" aria-label="Permalink to &quot;浮声 - Ethereal Sounds 启动指南&quot;">​</a></h1><h2 id="环境要求" tabindex="-1">环境要求 <a class="header-anchor" href="#环境要求" aria-label="Permalink to &quot;环境要求&quot;">​</a></h2><ul><li>Python 3.8+ (推荐使用Python 3.10)</li></ul><h2 id="快速开始" tabindex="-1">快速开始 <a class="header-anchor" href="#快速开始" aria-label="Permalink to &quot;快速开始&quot;">​</a></h2><h3 id="_1-获取源码" tabindex="-1">1. 获取源码 <a class="header-anchor" href="#_1-获取源码" aria-label="Permalink to &quot;1. 获取源码&quot;">​</a></h3><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-f8wj4" id="tab-ohRrH1T" checked><label data-title="GitHub" for="tab-ohRrH1T">GitHub</label><input type="radio" name="group-f8wj4" id="tab-6AgPb2w"><label data-title="Gitee" for="tab-6AgPb2w">Gitee</label></div><div class="blocks"><div class="language-sh vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#使用GitHub</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/Barbatos411/Ethereal-Sounds.git</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#使用Gitee</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://gitee.com/Barbatos411/Ethereal-Sounds.git</span></span></code></pre></div></div></div><h3 id="_2-创建虚拟环境" tabindex="-1">2. 创建虚拟环境 <a class="header-anchor" href="#_2-创建虚拟环境" aria-label="Permalink to &quot;2. 创建虚拟环境&quot;">​</a></h3><div class="vp-code-block-title"><div class="vp-code-block-title-bar"><span class="vp-code-block-title-text" data-title="bash">bash</span></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Ethereal-Sounds</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 进入项目目录</span></span></code></pre></div></div><div class="vp-code-block-title"><div class="vp-code-block-title-bar"><span class="vp-code-block-title-text" data-title="python">python</span></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 创建虚拟环境</span></span></code></pre></div></div><h3 id="_3-启动虚拟环境" tabindex="-1">3. 启动虚拟环境 <a class="header-anchor" href="#_3-启动虚拟环境" aria-label="Permalink to &quot;3. 启动虚拟环境&quot;">​</a></h3><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-t9h7c" id="tab-ZyQ1l-b" checked><label data-title="Linux/Unix/MacOS" for="tab-ZyQ1l-b">Linux/Unix/MacOS</label><input type="radio" name="group-t9h7c" id="tab-Xosgm7h"><label data-title="Windows" for="tab-Xosgm7h">Windows</label></div><div class="blocks"><div class="language-bash vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">source</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv/bin/activate</span></span></code></pre></div><div class="language-cmd vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.\\venv\\Scripts\\activate</span></span></code></pre></div></div></div><h3 id="_4-安装依赖" tabindex="-1">4. 安装依赖 <a class="header-anchor" href="#_4-安装依赖" aria-label="Permalink to &quot;4. 安装依赖&quot;">​</a></h3><div class="vp-code-block-title"><div class="vp-code-block-title-bar"><span class="vp-code-block-title-text" data-title="pip">pip</span></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> requirements.txt</span></span></code></pre></div></div><h3 id="_5-配置文件" tabindex="-1">5. 配置文件 <a class="header-anchor" href="#_5-配置文件" aria-label="Permalink to &quot;5. 配置文件&quot;">​</a></h3><ol><li>复制 <code>config.yaml.example</code> 为 <code>config.yaml</code></li><li>根据需要修改配置文件： <ul><li><code>HOST</code>: 服务器host地址</li><li><code>PORT</code>: 服务器端口（1-65535之间）</li><li><code>LOGLEVEL</code>: 日志级别（INFO/DEBUG/WARNING/ERROR/CRITICAL）</li><li><code>LOG_RETAIN_DAYS</code>: 日志保留天数</li><li><code>platforms</code>: 各音乐平台配置</li></ul></li></ol><h3 id="_6-启动服务" tabindex="-1">6. 启动服务 <a class="header-anchor" href="#_6-启动服务" aria-label="Permalink to &quot;6. 启动服务&quot;">​</a></h3><div class="vp-code-block-title"><div class="vp-code-block-title-bar"><span class="vp-code-block-title-text" data-title="python">python</span></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> main.py</span></span></code></pre></div></div><h2 id="功能特性" tabindex="-1">功能特性 <a class="header-anchor" href="#功能特性" aria-label="Permalink to &quot;功能特性&quot;">​</a></h2><h3 id="已实现功能" tabindex="-1">已实现功能 <a class="header-anchor" href="#已实现功能" aria-label="Permalink to &quot;已实现功能&quot;">​</a></h3><ul><li>跨平台搜索：支持多个音乐平台的统一搜索</li><li>音频播放：支持多平台音频流式播放</li><li>歌词显示：支持LRC格式歌词解析和显示</li><li>专辑管理：支持查看和播放专辑内容</li><li>平台管理：支持多平台接入和统一管理</li><li>数据持久化：支持SQLite数据存储</li></ul><h3 id="支持的平台" tabindex="-1">支持的平台 <a class="header-anchor" href="#支持的平台" aria-label="Permalink to &quot;支持的平台&quot;">​</a></h3><p>目前支持以下音乐平台：</p><ul><li>网易云音乐：支持搜索、音频播放、歌词和专辑</li><li>QQ音乐：支持搜索、音频播放、歌词和专辑</li><li>酷狗音乐：支持搜索、音频播放和歌词</li><li>酷我音乐：支持搜索、音频播放、歌词和专辑</li><li>哔哩哔哩：支持音频搜索和播放</li><li>本地音乐：支持本地音频文件播放和管理</li></ul><h2 id="项目结构" tabindex="-1">项目结构 <a class="header-anchor" href="#项目结构" aria-label="Permalink to &quot;项目结构&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── platforms/  # 音乐平台实现</span></span>
<span class="line"><span>│   ├── Netease/  # 网易云音乐平台</span></span>
<span class="line"><span>│   │   ├── album.py      # 专辑相关</span></span>
<span class="line"><span>│   │   ├── get_audio.py  # 音频获取</span></span>
<span class="line"><span>│   │   ├── get_lrc.py    # 歌词获取</span></span>
<span class="line"><span>│   │   ├── home.py       # 主页数据</span></span>
<span class="line"><span>│   │   └── search.py     # 搜索功能</span></span>
<span class="line"><span>│   ├── QQMusic/   # QQ音乐平台</span></span>
<span class="line"><span>│   ├── KGMusic/   # 酷狗音乐平台</span></span>
<span class="line"><span>│   ├── KWMusic/   # 酷我音乐平台</span></span>
<span class="line"><span>│   ├── Bilibili/  # 哔哩哔哩平台</span></span>
<span class="line"><span>│   ├── Local/     # 本地音乐</span></span>
<span class="line"><span>│   ├── base.py    # 平台基类</span></span>
<span class="line"><span>│   └── platform_manager.py  # 平台管理器</span></span>
<span class="line"><span>├── routers/    # API路由</span></span>
<span class="line"><span>│   ├── database.py  # 数据库接口</span></span>
<span class="line"><span>│   └── platform.py  # 平台接口</span></span>
<span class="line"><span>├── utils/      # 工具函数</span></span>
<span class="line"><span>│   ├── cookie.py     # Cookie管理</span></span>
<span class="line"><span>│   ├── db.py         # 数据库操作</span></span>
<span class="line"><span>│   ├── lyrics.py     # 歌词处理</span></span>
<span class="line"><span>│   ├── make_index.py # 索引生成</span></span>
<span class="line"><span>│   └── time.py       # 时间工具</span></span>
<span class="line"><span>├── web/        # 前端资源</span></span>
<span class="line"><span>│   ├── assets/   # 静态资源</span></span>
<span class="line"><span>│   └── index.html # 主页面</span></span>
<span class="line"><span>├── config.py   # 配置管理</span></span>
<span class="line"><span>├── log.py      # 日志管理</span></span>
<span class="line"><span>└── main.py     # 主程序</span></span></code></pre></div><h2 id="贡献指南" tabindex="-1">贡献指南 <a class="header-anchor" href="#贡献指南" aria-label="Permalink to &quot;贡献指南&quot;">​</a></h2><p>欢迎提交 Issue 和 Pull Request 来帮助改进项目。请确保：</p><ol><li>遵循现有的代码风格</li><li>添加必要的测试和文档</li><li>提交前进行充分测试</li></ol>`,28)]))}const k=s(l,[["render",t]]);export{b as __pageData,k as default};
