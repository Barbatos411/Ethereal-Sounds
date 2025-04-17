# 浮声 - Ethereal Sounds API 文档

## 基础信息

- 基础URL: `http://localhost:PORT`（PORT在config中配置）
- 所有API返回格式均为JSON，除非特别说明
- 错误响应会包含status_code和detail字段
- 所有请求都应该包含适当的Content-Type头
- 支持跨域请求(CORS)

### 错误码说明

| 状态码 | 说明       |
|-----|----------|
| 200 | 请求成功     |
| 400 | 请求参数错误   |
| 401 | 未授权或登录失效 |
| 403 | 无访问权限    |
| 404 | 资源不存在    |
| 500 | 服务器内部错误  |

## 平台相关接口

### 获取支持的平台列表

获取系统当前支持的所有音乐平台信息。

```http
GET /platforms
```

**响应参数：**
- `platforms` (array): 平台列表
  - `name` (string): 平台名称
  - `id` (string): 平台唯一标识
  - `logo`(string): 平台图标
  - `order` (integer): 平台排序序号


**响应示例：**
```json
{
    "platforms": [
        {
            "name": "网易云音乐",
            "id": "NetEase",
            "logo": "https://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg",
            "order": 1
        },
        {
            "name": "QQ音乐",
            "id": "QQMusic",
            "logo": "https://y.qq.com/favicon.ico?max_age=2592000",
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
- `limit` (integer, default: 30): 每页返回数量，默认30条

**响应参数：**

- `platform` (string): 音乐平台的名称，
- `results` (object): 包含搜索结果相关信息的对象。
  - `song_count` (integer): 搜索结果总数。
  - `song_list` (array): 歌曲信息列表。
    - `title` (string): 歌曲标题
    - `author` (string): 歌曲作者/演唱者
    - `cover` (string): 封面图片URL
    - `hd_cover` (string): 高清封面图片URL（原始尺寸）
    - `url` (string): 歌曲播放页面URL
    - `album` (string): 所属专辑名称
    - `album_id` (integer): 专辑ID
    - `fee` (integer): 收费标识（0表示免费）
    - `mvid` (integer): MV ID（0表示无MV）
    - `duration` (string): 歌曲时长（格式：mm:ss）
    - `id` (integer): 歌曲唯一ID
    
```json
{
  "platform": "NetEase",
  "results": {
    "song_list": [
      {
        "title": "轻涟 La vaguelette",
        "author": "HOYO-MiX",
        "cover": "https://p2.music.126.net/I-cw5yaq4Pz0EL2dZAmq1g==/109951169058808374.jpg?param=300y300",
        "hd_cover": "https://p2.music.126.net/I-cw5yaq4Pz0EL2dZAmq1g==/109951169058808374.jpg",
        "url": "https://music.163.com/song?id=2100334024",
        "album": "原神-「轻涟 La vaguelette」游戏原声EP专辑",
        "album_id": 179193598,
        "fee": 0,
        "mvid": 0,
        "duration": "02:29",
        "id": 2100334024
      }
    ],
    "song_count": 301
  }
}
```



### 获取音频

获取指定歌曲的音频流或播放地址。

```http
GET /get_audio
```

**请求参数：**
- `platform` (string, required): 平台ID
- `audio_id` (string, required): 歌曲ID

**响应：**

- Content-Type: audio/mpeg - 直接返回音频流
- 或 JSON格式：
  ```json
  {
      "audio_url": "音频文件URL"
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

**响应参数：**

- `results` (array): 歌词结果列表
  - `time` (number): 歌词时间点（单位：秒）
  - `text` (string): 歌词文本内容
  - `translation` (string, optional): 歌词翻译文本（非所有条目都有此字段）

### 获取平台主页内容

获取平台首页推荐内容。

```http
GET /home
```

开发中...

### 获取专辑信息

获取专辑详细信息。

```http
GET /album
```

**请求参数：**
- `platform` (string, required): 平台ID
- `album_id` (string, required): 专辑ID

**响应参数：**
- `results` (array): 音乐结果列表
  - `title` (string): 歌曲标题
  - `author` (string): 歌曲作者/演唱者
  - `cover` (string): 封面图片URL
  - `hd_cover` (string): 高清封面图片URL（原始尺寸）
  - `url` (string): 歌曲播放页面URL
  - `album` (string): 所属专辑名称
  - `album_id` (integer): 专辑ID
  - `fee` (integer): 收费标识（0表示免费）
  - `mvid` (integer): MV ID（0表示无MV）
  - `duration` (string): 歌曲时长（格式：mm:ss）
  - `id` (integer): 歌曲唯一ID

### 获取资源引用

获取资源的原始内容（图片等）。

```http
GET /referer
```

**请求参数：**

- `platform` (string, required): 平台ID
- `url` (string, required): 资源URL地址

**响应说明：**

- 如果请求的是图片资源：直接返回图片二进制数据，Content-Type 为对应的图片类型（如 image/jpeg, image/png 等）

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

### 获取所有数据

```http
GET /get_all_data
```

**请求参数：**
- `database` (string, default: "data"): 数据库名称
- `table` (string, required): 表名

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
- `status` (string, optional): 播放状态 (空 或 playing)
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