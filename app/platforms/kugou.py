import hashlib
import time
import urllib.parse

import httpx

from app.cookie.search_cookie import search_cookie


class KugouMusicSearch:
    name = "酷狗音乐"  # 平台名称
    id = 3  # 顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""
            # 从数据库获取 cookie
        }

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """

        # 检查是否需要更新 cookie
        if not self.cookie:
            self.cookie = await search_cookie(self.name)
            self.headers["cookie"] = self.cookie

        # 将 Cookie 字符串解析为 Python 字典格式。以便于解析 cookie
        cookies = self.cookie_to_dict(self.headers["cookie"])

        # 构建请求 URL
        search_url = self.build_kugou_search_url(cookies, keyword, page, limit)

        # 发送 GET 请求并获取响应
        try:
            response = await self.client.get(search_url, headers=self.headers)
            response.raise_for_status()  # 如果请求失败则抛出异常
            data = response.json()
            # 提取搜索结果
            songs = data.get("data", {}).get("lists", [])
            song_list = [
                {
                    # 歌曲名称
                    "title": song.get("SongName"),
                    # 歌手
                    "author": song.get("SingerName"),
                    # 歌曲封面图片
                    "cover": song.get("Image").replace("{size}", "100"),
                    # 歌曲链接
                    "url": f"https://www.kugou.com/song/#hash={song.get('FileHash')}&album_id={song.get('AlbumID')}",
                    # 专辑名称
                    "album": song.get("AlbumName"),
                    # 付费状态8为免费，1为VIP
                    # "fee": song.get("PayType"),
                    # 歌曲MV,0表示无MV
                    # "mvid": song.get("mvdata")[0].get("id") if song.get("mvdata") else 0,
                    # 歌曲时长，单位ms
                    "duration": self.s_to_mmss(song.get("ResDuration"))
                }
                for song in songs
            ]
            song_count = data.get("data", {}).get("total", 0)  # 歌曲总数
            result = {
                "song_list": song_list,
                "song_count": song_count
            }
            return result
        except httpx.HTTPError as e:
            # 处理请求失败的情况
            return {"error": f"请求失败: {e}"}

    async def get_audio(self, audio_id: str):
        """
        定义抽象地获取音频方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        # TODO : 获取歌曲的音频，歌词数据
        pass

    async def Home(self):
        """
        定义抽象地获取主页方法，每个平台都必须实现
        :return: 主页
        """
        # TODO : 首页数据
        pass

    @staticmethod
    def build_kugou_search_url(cookies: dict, keyword: str, page: int, pagesize: int):
        """根据 cookie 和关键字签名并生成搜索地址"""
        # 当前时间戳（毫秒级）
        clienttime = int(time.time() * 1000)

        base_url = "https://complexsearch.kugou.com/v2/search/song"

        # 参数参数
        params = {
            "appid": cookies.get("a_id") if cookies.get("a_id") else "1014",
            "bitrate": "0",
            "clienttime": clienttime,
            "clientver": "1000",
            "dfid": cookies.get("kg_dfid"),
            "filter": "10",
            "inputtype": "0",
            "iscorrection": "1",
            "isfuzzy": "0",
            "keyword": keyword,
            "mid": cookies.get("kg_mid"),
            "page": page,
            "pagesize": pagesize,
            "platform": "WebFilter",
            "privilege_filter": "0",
            "srcappid": "2919",
            "token": cookies.get("t") if cookies.get("t") else "0",  # 对应 token
            "userid": cookies.get("KugooID") if cookies.get("KugooID") else "0",
            "uuid": cookies.get("ku_mid"),  # 通常与 mid 相同
        }

        # 固定值前后包裹
        fixed_value = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt"
        # 按字母顺序排列参数并拼接为字符串
        sorted_params = ''.join(f"{k}={v}" for k, v in sorted(params.items()))
        # 包裹固定值
        to_sign = f"{fixed_value}{sorted_params}{fixed_value}"
        # 使用 MD5 加密
        md5 = hashlib.md5()
        md5.update(to_sign.encode('utf-8'))
        signature = md5.hexdigest()
        # 构建完整 URL
        return f"{base_url}?{urllib.parse.urlencode(params)}&signature={signature}"

    @staticmethod
    def cookie_to_dict(cookie_string):
        """
        将 Cookie 字符串解析为 Python 字典格式。

        :param cookie_string: str, 输入的 Cookie 字符串
        :return: dict, 可通过 .get() 访问的字典
        """
        # 用分号分割多个键值对
        cookie_parts = cookie_string.split(';')

        # 存储结果的字典
        cookie_dict = {}

        for part in cookie_parts:
            # 清理多余的空格
            part = part.strip()
            # 确保键值对合法
            if '=' in part:
                key, value = part.split('=', 1)
                # 对 URL 编码的内容进行解码
                cookie_dict[key] = urllib.parse.unquote(value)

        return cookie_dict

    @staticmethod
    def s_to_mmss(s):
        # 计算分钟和秒
        minutes = int(s // 60)
        seconds = int(s % 60)
        return f"{minutes:02}:{seconds:02}"
