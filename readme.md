# 浮声 - Ethereal Sounds

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Barbatos411/Ethereal-Sounds?style=social)
![GitHub forks](https://img.shields.io/github/forks/Barbatos411/Ethereal-Sounds?style=social)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![platform](https://img.shields.io/badge/python-3.10-green.svg)]()
![GitHub issues](https://img.shields.io/github/issues/Barbatos411/Ethereal-Sounds)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Barbatos411/Ethereal-Sounds)
![GitHub repo size](https://img.shields.io/github/repo-size/Barbatos411/Ethereal-Sounds)

<img src="https://count.getloli.com/@Ethereal-Sounds?name=Ethereal-Sounds&theme=random&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto" alt="访问数量"/>

</div>

一个模仿listen1的在线、可拓展的音乐播放器，平台开发见Wiki(编辑中...（其实还没写）)

[Listen1](https://github.com/listen1/listen1):
让你用一个网页就能听到多个网站的在线音乐（现已包括网易云音乐、QQ音乐、酷我音乐、酷狗音乐、BiliBili、咪咕音乐、千千音乐）。你可以非常的简单的访问和收听在线音乐，而不用受到单个音乐网站资源不全地限制了。

## 功能

### 支持的平台

- [x] 网易云音乐
- [x] QQ音乐
- [x] 酷狗音乐
- [x] 酷我音乐
- [x] BiliBili

### 已实现

- [x] 搜索
- [x] 播放音乐
- [x] 滚动歌词
- [x] 音频控制
- [x] 播放列表

### TODO

- [ ] 各平台首页
- [ ] 平台账号登录
- [ ] 收藏、创建歌单
- [ ] 自定义音效
- [ ] 更多的配色、主题

## 安装

### 拉取仓库源码并进入项目目录

```bash
# 使用github
git clone https://github.com/Barbatos411/Ethereal-Sounds.git
cd Ethereal-Sounds

# 使用gitee
git clone https://gitee.com/Barbatos411/Ethereal-Sounds.git
cd Ethereal-Sounds
```

### 创建虚拟环境

```bash
python -m venv venv
```

### 启动虚拟环境

#### Linux/Unix/MacOS

```bash
source venv/bin/activate
```

#### Windows

```bash
.\venv\Scripts\activate
```

### 在虚拟环境中安装依赖

```bash
pip install -r requirements.txt
```

### 启动

```
python main.py
```

### 更新

```bash
git pull
```

## 致谢

本项目借鉴了开源项目 **[Listen1](https://github.com/listen1/listen1)** 的设计理念和功能思路。在此对 Listen1
的开发团队和社区表示诚挚的感谢

感谢以下项目的支持：

- **[FastAPI](https://fastapi.tiangolo.com/)** : 提供了高性能的 API 构建框架。
- **[Starlette](https://www.starlette.io/)** : 支持异步请求和路由系统，是 FastAPI 的底层框架。
- **[Uvicorn](https://www.uvicorn.org/)** : 作为 ASGI 服务器，为项目提供快速的运行环境。
- **[httpx](https://www.python-httpx.org/)** 和 **[httpcore](https://www.python-httpx.org/httpcore/)** : 处理异步 HTTP
  请求，提升了网络交互的效率。
- [**Web Audio API**](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) : 浏览器内置的强大音频处理接口，用于音频播放、可视化和自定义控制。
- [**SQLite**](https://www.sqlite.org/) : 轻量级嵌入式数据库，用于存储用户数据和歌单信息。
- **[BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/)** 和 *
  *[soupsieve](https://facelessuser.github.io/soupsieve/)** : 强大的 HTML 解析工具，简化了爬虫功能。
- **[Jinja2](https://palletsprojects.com/p/jinja/)** — 便捷的模板引擎，用于前端页面渲染。
- **[Pydantic](https://docs.pydantic.dev/)** : 数据验证和结构化的基石，使数据处理更为安全可靠。

感谢 [MapleLeaf](https://gitee.com/maple-leaf-sweeping) 大佬提供的技术指导和宝贵建议

## 版权声明

“网易云音乐”、"QQ音乐"、“酷狗音乐”、"酷我音乐"、“哔哩哔哩”等文字、图形和商业标识，其著作权或商标权归其各自公司所有。
相关平台享有其授权音乐内容的版权，请勿随意下载、复制或传播版权内容。
如需了解更多，请参考对应平台的用户协议或版权政策。

## 贡献者

> 🌟 星光闪烁，你们的智慧如同璀璨的夜空。感谢所有为 **Ethereal-Sounds** 做出贡献的人！

<a href="https://github.com/Barbatos411/Ethereal-Sounds/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Barbatos411/Ethereal-Sounds" alt="贡献者"/>
</a>

![Alt](https://repobeats.axiom.co/api/embed/002c2203d71e30e71dde64f255706628de6a498c.svg "Repobeats analytics image")

![Star History Chart](https://api.star-history.com/svg?repos=Barbatos411/Ethereal-Sounds&type=Date)

## 其他

如果觉得此项目对你有帮助的话,可以点一个 star🌟,你的支持就是不断更新的动力~
