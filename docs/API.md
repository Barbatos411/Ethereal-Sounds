# 浮声 - Ethereal Sounds API 文档

## 基础信息

- 基础URL: `http://localhost:PORT`（PORT在config中配置）
- 所有API返回格式均为JSON，除非特别说明
- 错误响应会包含status_code和detail字段
- 所有请求都应该包含适当的Content-Type头
- 支持跨域请求(CORS)

### 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或登录失效 |
| 403 | 无访问权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 平台相关接口

### 获取支持的平台列表

获取系统当前支持的所有音乐平台信息。

```http
GET /platforms
```

**响应参数：**
- `platforms` (array): 平台列表
  - `id` (string): 平台唯一标识
  - `name` (string): 平台名称
  - `order` (integer): 平台排序序号

**响应示例：**
```json
{
    "platforms": [
        {
            "id": "netease",
            "name": "网易云音乐",
            "order": 1
        },
        {
            "id": "qq",
            "name": "QQ音乐",
            "order": 2
        }
    ]
}
```

### 搜索歌曲

在指定平台搜索音乐。

```http
GET /search
```

**请求参数：**
- `keyword` (string, required): 搜索关键词，支持歌曲名、歌手名、专辑名
- `platform` (string, required): 搜索平台，必须是已支持的平台ID
- `page` (integer, default: 1): 分页页码，从1开始
- `limit` (integer, default: 20): 每页返回数量，默认20条

**响应参数：**
- `songs` (array): 搜索结果列表
  - `id` (string): 歌曲ID
  - `name` (string): 歌曲名称
  - `artist` (string): 艺术家名称
  - `album` (string): 专辑名称
  - `duration` (integer): 歌曲时长(秒)
  - `cover` (string): 封面图片URL

### 获取音频

获取指定歌曲的音频流或播放地址。

```http
GET /get_audio
```

**请求参数：**
- `platform` (string, required): 平台ID
- `audio_id` (string, required): 歌曲ID
- `quality` (string, optional): 音质选择，可选值：standard(标准)、high(高质量)、hires(无损)

**响应：**
- Content-Type: audio/mpeg - 直接返回音频流
- 或 JSON格式：
  ```json
  {
      "url": "音频文件URL",
      "expires": "URL过期时间",
      "quality": "音质信息"
  }
  ```

### 获取歌词

获取指定歌曲的歌词内容。

```http
GET /get_lrc
```

**请求参数：**
- `platform` (string, required): 平台ID
- `audio_id` (string, required): 歌曲ID
- `type` (string, optional): 歌词类型，可选值：lrc(LRC格式)、txt(纯文本)

**响应参数：**
- `lrc` (string): LRC格式歌词内容
- `tlyric` (string, optional): 翻译歌词
- `romalrc` (string, optional): 罗马音歌词

### 获取平台主页内容

获取平台首页推荐内容。

```http
GET /home
```

**请求参数：**
- `platform` (string, required): 平台ID
- `categories` (string, optional): 内容分类，多个分类用逗号分隔
- `page` (integer, default: 1): 分页页码
- `limit` (integer, default: 20): 每页数量

**响应参数：**
- `banners` (array): 轮播图列表
- `playlists` (array): 推荐歌单
- `new_songs` (array): 新歌推荐
- `hot_songs` (array): 热门歌曲

### 平台登录

用户登录指定平台。

```http
GET /login
```

**请求参数：**
- `platform` (string, required): 登录平台ID
- `method` (string, required): 登录方式，可选值：password(密码登录)、code(验证码登录)、qr(二维码登录)
- `username` (string, conditional): 用户名/手机号，密码登录时必需
- `password` (string, conditional): 密码，密码登录时必需
- `code` (string, conditional): 验证码或二维码信息

**响应参数：**
- `token` (string): 登录凭证
- `user_info` (object): 用户信息
- `expires_in` (integer): 凭证有效期

### 获取专辑信息

获取专辑详细信息。

```http
GET /album
```

**请求参数：**
- `platform` (string, required): 平台ID
- `album_id` (string, required): 专辑ID

**响应参数：**
- `id` (string): 专辑ID
- `name` (string): 专辑名称
- `artist` (string): 艺术家名称
- `release_time` (string): 发行时间
- `description` (string): 专辑描述
- `cover` (string): 封面图片URL
- `songs` (array): 专辑歌曲列表

### 获取资源引用

获取资源的引用信息。

```http
GET /referer
```

**请求参数：**
- `platform` (string, required): 平台ID
- `url` (string, required): 资源URL地址

**响应参数：**
- `referer` (string): 引用地址
- `user_agent` (string): User-Agent信息
- `headers` (object): 其他请求头信息

## 数据库相关接口

### 查询数据

```http
GET /get_data
```

**请求参数：**
- `database` (string, default: "data"): 数据库名称
- `table` (string, required): 表名
- `keyword` (string, required): 查询关键词
- `select` (string, required): 需要返回的字段，多个字段用逗号分隔
- `where` (string, required): 查询条件字段
- `limit` (integer, optional): 返回记录数量限制

### 获取所有数据

```http
GET /get_all_data
```

**请求参数：**
- `database` (string, default: "data"): 数据库名称
- `table` (string, required): 表名
- `order_by` (string, optional): 排序字段
- `order_type` (string, optional): 排序方式，可选值：asc(升序)、desc(降序)

### 设置数据

```http
GET /set_data
```

**请求参数：**
- `database` (string, required): 数据库名称
- `table` (string, required): 表名
- `where_column` (string, required): 条件字段名
- `keyword` (string, required): 条件值
- `set_column` (string, required): 要更新的字段名
- `value` (string, required): 更新值

### 更新数据

```http
GET /update_data
```

**请求参数：**
- `database` (string, required): 数据库名称
- `table` (string, required): 表名
- `where_column` (string, required): 条件字段名
- `keyword` (string, required): 条件值
- `set_column` (string, required): 要更新的字段名
- `value` (string, required): 更新值

### 更新播放列表

```http
POST /update_playlist
```

**请求参数：**
- `audio_id` (string, required): 歌曲ID
- `title` (string, required): 歌名
- `singer` (string, required): 歌手
- `singer_id` (string, optional): 歌手ID
- `album` (string, optional): 专辑名称
- `album_id` (string, optional): 专辑ID
- `platform` (string, required): 平台ID
- `status` (string, optional): 播放状态
- `cover` (string, required): 封面图片URL
- `hd_cover` (string, required): 高清封面图片URL
- `MV` (string, optional): MV链接
- `VIP` (boolean, optional): 是否为VIP歌曲
- `url` (string, required): 歌曲播放链接

### 更新播放状态

```http
GET /update_play_status
```

**请求参数：**
- `audio_number` (string, required): 音频序号
- `status` (string, required): 播放状态，可选值：playing、paused、stopped
- `position` (integer, optional): 播放位置(秒)

### 删除数据

```http
GET /del_data
```

**请求参数：**
- `database` (string, required): 数据库名称
- `table` (string, required): 表名
- `keyword` (string, required): 删除条件值
- `where` (string, required): 删除条件字段

### 删除所有数据

```http
GET /del_all_data
```

**请求参数：**
- `database` (string, required): 数据库名称
- `table` (string, required): 表名
- `confirm` (boolean, required): 确认删除，必须为true