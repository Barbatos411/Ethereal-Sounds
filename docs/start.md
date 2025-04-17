# 浮声 - Ethereal Sounds 启动指南

## 环境要求

- Python 3.8+ (推荐使用Python 3.10)

## 快速开始

### 1. 获取源码

::: code-group

```sh [GitHub]
#使用GitHub
git clone https://github.com/Barbatos411/Ethereal-Sounds.git
```

```sh [Gitee]
#使用Gitee
git clone https://gitee.com/Barbatos411/Ethereal-Sounds.git
```

:::
### 2. 创建虚拟环境

```bash [bash]
cd Ethereal-Sounds  # 进入项目目录
```
::: tip
建议使用虚拟环境，避免依赖冲突
:::



```bash [python]
python -m venv venv  # 创建虚拟环境
```

### 3. 启动虚拟环境

::: code-group

```bash [Linux/Unix/MacOS]
source venv/bin/activate
```

```cmd [Windows]
.\venv\Scripts\activate
```

:::
### 4. 安装依赖

```bash [pip]
pip install -r requirements.txt
```

### 5. 配置文件

1. 复制 `config.yaml.example` 为 `config.yaml`
2. 根据需要修改配置文件：
   - `HOST`: 服务器host地址
   - `PORT`: 服务器端口（1-65535之间）
   - `LOGLEVEL`: 日志级别（INFO/DEBUG/WARNING/ERROR/CRITICAL）
   - `LOG_RETAIN_DAYS`: 日志保留天数
   - `platforms`: 各音乐平台配置

### 6. 启动服务

```bash [python]
python main.py
```

## 功能特性

### 已实现功能

- 跨平台搜索：支持多个音乐平台的统一搜索
- 音频播放：支持多平台音频流式播放
- 歌词显示：支持LRC格式歌词解析和显示
- 专辑管理：支持查看和播放专辑内容
- 平台管理：支持多平台接入和统一管理
- 数据持久化：支持SQLite数据存储

### 支持的平台

目前支持以下音乐平台：

- 网易云音乐：支持搜索、音频播放、歌词和专辑
- QQ音乐：支持搜索、音频播放、歌词和专辑
- 酷狗音乐：支持搜索、音频播放和歌词
- 酷我音乐：支持搜索、音频播放、歌词和专辑
- 哔哩哔哩：支持音频搜索和播放
- 本地音乐：支持本地音频文件播放和管理

## 项目结构

```
├── platforms/  # 音乐平台实现
│   ├── Netease/  # 网易云音乐平台
│   │   ├── album.py      # 专辑相关
│   │   ├── get_audio.py  # 音频获取
│   │   ├── get_lrc.py    # 歌词获取
│   │   ├── home.py       # 主页数据
│   │   └── search.py     # 搜索功能
│   ├── QQMusic/   # QQ音乐平台
│   ├── KGMusic/   # 酷狗音乐平台
│   ├── KWMusic/   # 酷我音乐平台
│   ├── Bilibili/  # 哔哩哔哩平台
│   ├── Local/     # 本地音乐
│   ├── base.py    # 平台基类
│   └── platform_manager.py  # 平台管理器
├── routers/    # API路由
│   ├── database.py  # 数据库接口
│   └── platform.py  # 平台接口
├── utils/      # 工具函数
│   ├── cookie.py     # Cookie管理
│   ├── db.py         # 数据库操作
│   ├── lyrics.py     # 歌词处理
│   ├── make_index.py # 索引生成
│   └── time.py       # 时间工具
├── web/        # 前端资源
│   ├── assets/   # 静态资源
│   └── index.html # 主页面
├── config.py   # 配置管理
├── log.py      # 日志管理
└── main.py     # 主程序
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。请确保：

1. 遵循现有的代码风格
2. 添加必要的测试和文档
3. 提交前进行充分测试